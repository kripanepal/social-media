const jwt = require("jsonwebtoken")
const { jwt_secret } = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports = (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: "please log in" })
    }

    else {
        const token = authorization.replace("Bearer ", "")
        jwt.verify(token, jwt_secret, (err, payload) => {
            if (err) {
                return res.status(401).json({ erroe: "please log in" })

            }

            else {
                const { _id } = payload;
                User.findById(_id)
                .select(_id)
                    .then(userdata => {
                        req.user = userdata
                        next()
                    })
               
            }
        })
    }
}