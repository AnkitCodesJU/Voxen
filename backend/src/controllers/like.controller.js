import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {createNotification} from "./notification.controller.js"
import {Video} from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid Video Id")
    }

    const alreadyLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    if(alreadyLiked){
        await Like.findByIdAndDelete(alreadyLiked?._id)
        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked: false}, "Unliked successfully"))
    }

    await Like.create({
        video: videoId,
        likedBy: req.user?._id
    })

    // Notify video owner
    const video = await Video.findById(videoId);
    if (video) {
        await createNotification(
            video.owner,
            req.user._id,
            'LIKE',
            `${req.user.fullName} liked your video: ${video.title}`,
            video._id
        );
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, {isLiked: true}, "Liked successfully"))

})


const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet Id");
    }

    const alreadyLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked?._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Unliked successfully"));
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    });
    
    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Liked successfully"));
});

export {
    toggleVideoLike,
    getLikedVideos,
    toggleTweetLike
}
