const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const fs = require('fs')
Grid.mongo = mongoose.mongo
const Post = mongoose.model("Post")
const User = mongoose.model("User")
const requireLogin = require('../middleware/requireLogin')



router.post('/createpost', requireLogin, (req, res) => {
    const { title } = req.body
    console.log(title,req.body.picUrl)
    if (!title && !req.body.picUrl) {
        console.log('yah')
        return res.status(422).json({ error: "missing fields for post" })
    }
    req.user.password = undefined
    const post = new Post(
        {
            title, postedBy: req.user, picture: req.body.picUrl
        }
    )
    post.save().then(result => {
        if (result) {
            res.json({ post: result })
        }
    })
        .catch(err => { console.log(err) })
})

router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name profilePictureUrl")
        .populate('comments.postedBy', "_id name")
        .populate('likes', "_id name")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/followedPost', requireLogin, (req, res) => {
    console.log(req.user.followings)
    Post.find({postedBy:{$in:req.user.followings}})
    .populate("postedBy", "_id name profilePictureUrl")
    .populate('comments.postedBy', "_id name")
    .populate('likes', "_id name")
    .sort('-createdAt')


        .then(posts => {
            console.log(posts)
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})




router.get('/myposts', requireLogin, ((req, res) => {
    const userID= (req.user._id)
    User.findOne({ _id: userID })
        .select('-password')
        .then(user => {
            Post.find({ postedBy: req.user._id })
            .populate("postedBy", "_id name profilePictureUrl")
            .populate('likes', "_id name")
            .populate("comments.postedBy","_id name")
            .exec((err, posts) => {
                    if (err) {

                        return res.status(422).json({ error: err })
                    } else {
                        return res.json({ user, posts })
                    }
                })
        })
        .catch(err => {
            return res.statusCode(404).json({ error: "message not found" })
        })
}))


router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postID, {
        $addToSet: { likes: req.user._id }
    }, {
        new: true
    })
    .populate("postedBy", "_id name profilePictureUrl")
    .populate('likes', "_id name")
    .populate("comments.postedBy","_id name")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        else {
            return res.json(result)
        }
    })
})



router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
    .populate("postedBy", "_id name profilePictureUrl")
    .populate('likes', "_id name")
    .populate("comments.postedBy","_id name")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})


router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy", "_id name profilePictureUrl")
    .populate('likes', "_id name")

    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
  
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id name profilePictureUrl")

    .exec((err,post)=>{
   
        if(err || !post){
  
            return res.status(422).json({error:err})
        }
            if(post.postedBy._id.toString()===req.user._id.toString())
            {
                post.remove()
                .then(result=>
                    {
                        res.json(result)
                    })
                    .catch(err=>
                        {
                            console.log(err)
                            res.json({error:"deletion failed"})
                        })
            }   
        
    })
})
router.get('/getpost/:postId',requireLogin,(req,res)=>{

    Post.findOne({_id:req.params.postId})
    .populate("comments.postedBy","_id name")
    .populate("postedBy", "_id name profilePictureUrl")
    .populate('likes', "_id name")

    .exec((err,post)=>{
   
        if(err || !post){
  
            return res.status(422).json({error:err})
        }


               
                    
                        res.json(post)
  
        
    })
})


module.exports = router