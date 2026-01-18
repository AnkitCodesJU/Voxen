import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        type: {
            type: String,
            enum: ['LIKE', 'COMMENT', 'SUBSCRIBE', 'LOGIN', 'NEW_VIDEO'],
            required: true
        },
        relatedVideo: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        relatedComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        message: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Notification = mongoose.model("Notification", notificationSchema);
