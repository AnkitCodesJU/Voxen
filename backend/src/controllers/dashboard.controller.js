import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // Get total video views
    // Get total subscribers
    // Get total videos
    // Get total likes
    
    const userId = req.user._id;

    const totalVideos = await Video.countDocuments({ owner: userId });

    const totalViewsAggregate = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ]);

    const totalViews = totalViewsAggregate[0]?.totalViews || 0;

    const totalSubscribers = await Subscription.countDocuments({ channel: userId });

    const totalLikesAggregate = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoInfo"
            }
        },
        {
            $match: {
                "videoInfo.owner": new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $count: "totalLikes"
        }
    ]);

    const totalLikes = totalLikesAggregate[0]?.totalLikes || 0;


    return res.status(200).json(
        new ApiResponse(
            200, 
            {
                totalVideos,
                totalViews,
                totalSubscribers,
                totalLikes
            }, 
            "Channel stats fetched successfully"
        )
    )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // Get all videos uploaded by the user (published + unpublished) for management
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const videoAggregate = Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const videos = await Video.aggregatePaginate(videoAggregate, options);

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }
