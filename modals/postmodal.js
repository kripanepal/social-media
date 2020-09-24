const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        picture: {
            type: String,

        },
        postedBy:
        {
            type: ObjectId,
            ref: "User"
        },
        likes:
            [
                {
                    type: ObjectId,
                    ref: "User", default: "no photo"
                }
            ] ,
        comments:
            [
                {
                    text: String,
                    postedBy: { type: ObjectId, ref: "User" },
                    likes:[ { type: ObjectId, ref: "User" }]
                }
            ],
    },{ timestamps:true}

)

mongoose.model("Post", postSchema)