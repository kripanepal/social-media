const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: `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`
  }
}))

router.post('/resetpassword', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) { console.log(err) }
    else {
      const emailAddress = (req.body.email).toLowerCase()
      const token = buffer.toString('hex')
      User.findOne({ email: emailAddress})
        .then(user => {
          if (!user) {
            return res.status(422).json({ error: "No user found with this email address" })
          }
          user.resetToken = token+""
          user.tokenExpire = Date.now() +3600000
          user.save().then(result => {
            transporter.sendMail(
              {
                to: user.email,
                from: "kripanepali20@gmail.com",
                subject: "password reset for insta",
                html: `
                      <p>You requested for password reset</p>
                      <h5>Click  <a href = "http://localhost:3000/reset/${token}">here </a> link to reset password</h5>
                      `
              }
            )

            res.json({ message: "Reset instructions sent to your mailbox" })
          })
          .catch(err=>
            {console.log(err)})
        })
    }
  })
})

router.post('/updatepassword', (req, res) => {
  const {newPassword,token} = req.body
  User.findOne({resetToken:token,tokenExpire:{$gt:Date.now()}})
  .then(user =>
    {
      if(!user)
      {
        return res.status(422).json({error:"Something went wrong. Try again"})
      }

      bcrypt.hash(newPassword,12)
      .then(result =>
        {
          user.password = result;
          user.resetToken=undefined;
          user.tokenExpire = undefined

          user.save().then(result=>
            {
              console.log(user)
              res.json({message:'Passwoed reset successfull'})
            })
        })
    })


})

router.post("/signup", (req, res) => {

  const { name, email, password, profilePictureUrl } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "missing fields" });
  } else {
    const emailAddress = (req.body.email).toLowerCase()
    User.findOne({ email: emailAddress })
      .then((user) => {
        if (user) {
          return res.status(422).json({ error: "user already registered" });
        }
        bcrypt.hash(password, 12).then((hashedpassword) => {

          var newUser;
          if (profilePictureUrl) {
            newUser = new User({ name, password: hashedpassword, email:emailAddress, profilePictureUrl });
          }
          else {
            newUser = new User({ name, password: hashedpassword, email:emailAddress });
          }

          newUser
            .save()
            .then((user) => {
              transporter.sendMail({
                to: user.email,
                from: 'kripanepali20@gmail.com',
                subject: "Signup success",
                html: "<h1>Welcome to something useless<h1>"
              })

                .catch((err) => {
                  console.log(err);
                });
              res.json({ message: "saved successfully" });
            })
            .catch((err) => {
              res.json({ message: "saved fail" });
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const emailAddress = (req.body.email).toLowerCase()

  if (!email || !password) {
    return res.status(422).json({ error: "missing fields here" });
  } else {
    User.findOne({ email: emailAddress })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.password).then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign({ _id: user._id }, jwt_secret);
              const { name, email, _id, followings, followers, profilePictureUrl } = user
              res.json({ token, user: { _id, name, email, followings, followers, profilePictureUrl } });
            } else {
              return res.status(422).json({
                error: "invalid password",
              });
            }
          });
        } else {
          return res.status(422).json({
            error: "user not found with this email",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});


module.exports = router;
