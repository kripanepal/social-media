const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const fs = require("fs");
Grid.mongo = mongoose.mongo;
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin");

router.get("/user/:id", requireLogin, (req, res) => {
    console.log(req.params.id,'=====')

  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          } else {
            return res.json({ user, posts });
          }
        });
    })
    .catch((err) => {
      return res.statusCode(404).json({ error: "message not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.toBeFollowed,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { followings: req.body.toBeFollowed },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.toBeUnfollowed,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { followings: req.body.toBeUnfollowed },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updateprofilepicture", requireLogin, (req, res) => {
  const { profilePictureUrl } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $set: { profilePictureUrl } },
    { new: true },
    (err, result) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(result);
      }
    }
  );
});

router.get("/search/:name", requireLogin, (req, res) => {
  const name = (req.params.name)
console.log(name)
  User.find({ name: { $regex: name, $options: "i" } })
    .select(["name",'profilePictureUrl'])
  .then(result =>res.json(result))
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

module.exports = router;
