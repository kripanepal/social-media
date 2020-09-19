const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,unique:true
        }, password: {
            type: String,
            required: true
        },
        followers:[ { type: ObjectId, ref: "User" }],
        followings:[ {type:ObjectId,ref:'User'}],
        profilePictureUrl: {
            type: String,
            default: "https://res.cloudinary.com/denpmf1qv/image/upload/v1599279587/no-user-profile-picture-hand-260nw-99335579_ungsj1.jpg"
        },
        resetToken:{type:String},
        tokenExpire:{type:Date}
    }
)
mongoose.model("User",userSchema)