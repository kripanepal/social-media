const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = mongoose.model("User");
const Messages = mongoose.model("Messages")
const requireLogin = require("../middleware/requireLogin");

router.post("/savemessage", requireLogin, (req, res) => {

    const { toId, toSend } = req.body;
    console.log(toSend)
    const from = req.user;
    const to = toId

    Messages.findOneAndUpdate({
        users: { $in: [from, to] }
    }, {
        $push: { user_messages: { text: toSend, from, to, date: new Date() } },

    })

        .then(result => {
            console.log(result)
            if (!result) {
                const message = new Messages({ users: [from, to], user_messages: { text: toSend, from, to, date: new Date() } })
                message.save()
            }
        })
        .catch(err => console.log(err))
});

router.post("/fetchmessages", requireLogin, (req, res) => {

    User.findById(req.body.id)
        .then(user1 => {
            User.findById(req.user)
                .then(user2 => {
                    Messages.find({ users: { $in: [user1, user2] } })
                    .select("user_messages")
                    .select("-_id")
                        .then(result => res.json(result))
                })
        })



});

module.exports = router