import mongoose, {Schema} from "mongoose";

const liveClassSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        thumbnail: {
            type: String, // cloudinary url
        },
        instructor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"],
            default: "SCHEDULED"
        },
        streamKey: {
            type: String,
            select: false // Only show to instructor
        },
        chatEnabled: {
            type: Boolean,
            default: true
        },
        attendees: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
)

export const LiveClass = mongoose.model("LiveClass", liveClassSchema)
