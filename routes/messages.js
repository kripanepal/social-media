const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = mongoose.model("User");
const Messages = mongoose.model("Messages")
const requireLogin = require("../middleware/requireLogin");

router.post("/savemessage", requireLogin, (req, res) => {

    const { toId, toSend } = req.body;
    const from = req.user;
    const to = toId
    Messages.findOneAndUpdate({
        $or: [{ users: [from, to] }, { users: [to, from] }]
    }, {
        $push: { user_messages: { text: toSend, from, to, date: new Date() } },
        users: [from, to],
        readBy: [from]
    }, { upsert: true })
        .catch(err => console.log(err))
});

router.post("/fetchmessages", requireLogin, (req, res) => {
console.log('here')

    Messages.findOneAndUpdate({ users: { $all: [req.body.id, req.user] } }, {
        $addToSet: { readBy: req.user._id }
    })
        .select("user_messages")
        .select("_id")
        .then(result => res.json(result))



});

router.get("/fetchinbox", requireLogin, (req, res) => {
    console.log(req.user)
    Messages.find({
        users: { $in: req.user }
    }, { user_messages: { $slice: -1 } })
        .populate('user_messages.to', 'name profilePictureUrl')
        .populate('user_messages.from', 'name profilePictureUrl')
        .select('readBy')
        .sort('-user_messages.date')


        .then(result => {
            console.log(result)
            res.json(result)
        })
        .catch(err => console.log(err))

});
router.put("/unread", requireLogin, (req, res) => {
    console.log(req.body.id)
    console.log(req.user)
    Messages.findByIdAndUpdate(
        req.body.id, { $pull: { readBy: req.user._id } })
        .catch(err => console.log(err))

});

module.exports = router