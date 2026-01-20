import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { LiveClass } from "../models/liveClass.model.js";
import { Tweet } from "../models/tweet.model.js";

const searchAll = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query) {
        throw new ApiError(400, "Query is required");
    }

    const [videos, liveClasses, tweets] = await Promise.all([
        Video.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        }).limit(10),
        LiveClass.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        }).limit(10),
        LiveClass.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        }).limit(10),
        Tweet.find({
            content: { $regex: query, $options: "i" }
        }).limit(10)
    ]);

    return res.status(200).json(
        new ApiResponse(200, { videos, liveClasses, tweets }, "Search results fetched successfully")
    );
});

export { searchAll };
