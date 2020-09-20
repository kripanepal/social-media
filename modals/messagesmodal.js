const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types
const messagesSchema = new mongoose.Schema(
    {
        users: [{ type: ObjectId, ref: "User" }],
        user_messages:
            [
                {
                    from: {type: ObjectId, ref: "User"},
                    to: { type: ObjectId, ref: "User" },
                    text: { type: String },
                    date:Date
                },

            ]
    }
);

mongoose.model("Messages", messagesSchema)