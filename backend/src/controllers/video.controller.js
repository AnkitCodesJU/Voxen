import mongoose, {isValidObjectId} from "mongoose"
import fs from "fs"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const pipeline = [];

    // Search by query (title or description)
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        });
    }

    // Filter by userId
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    }

    // Only show published videos unless it's the owner viewing their own videos (logic can be complex, for now strictly published for public list)
    // If we want to show all videos to the owner, we might need a separate endpoint or conditionally add this match.
    // For general feed:
    pipeline.push({ $match: { isPublished: true } });

    // Filter by isMovie if query param is provided
    if (req.query.isMovie !== undefined) {
        pipeline.push({
            $match: {
                isMovie: req.query.isMovie === 'true'
            }
        });
    }


    // Calculate likes count for sorting or display
    pipeline.push({
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "likes"
        }
    });

    pipeline.push({
        $addFields: {
            likesCount: {
                $size: "$likes"
            }
        }
    });

    pipeline.push({
        $project: {
            likes: 0
        }
    });

    // Sort
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "desc" ? -1 : 1
            }
        });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Populate owner
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                {
                    $project: {
                        fullName: 1,
                        username: 1,
                        avatar: 1
                    }
                }
            ]
        }
    });

    pipeline.push({
        $addFields: {
            owner: {
                $first: "$owner"
            }
        }
    });

    const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const videos = await Video.aggregatePaginate(videoAggregate, options);

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isMovie, isPublished } = req.body
    
    if (
        [title, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    // 1. Upload to Cloudinary (preserve local file)
    const videoFile = await uploadOnCloudinary(videoFileLocalPath, { deleteAfterUpload: false })
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, { deleteAfterUpload: false })

    if (!videoFile) {
        throw new ApiError(400, "Video file upload failed")
    }

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail file upload failed")
    }

    // 2. Retry logic for Database Entry
    let createdVideo;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const video = await Video.create({
                title,
                description,
                videoFile: videoFile.url,
                thumbnail: thumbnail.url,
                duration: videoFile.duration,
                owner: req.user._id,
                isMovie: isMovie === 'true' || isMovie === true,
                isPublished: isPublished === undefined ? true : (isPublished === 'true' || isPublished === true)
            })

            createdVideo = await Video.findById(video._id)
            if (createdVideo) break; // Success

        } catch (error) {
            console.error(`Database save attempt ${attempts + 1} failed:`, error);
            attempts++;
            if (attempts === maxAttempts) {
                // Determine if we should delete files here or not. 
                // Request says "if not dn successfully try again", implying we keep trying.
                // If it ultimately fails, we probably SHOULD delete the file to avoid junk, 
                // OR keep it for manual intervention. 
                // Given "remove it... if successfully", implies "don't remove if not successful" immediately?
                // But usually we don't want to fill disk.
                // However, I will adhere to "try again" as the retry loop.
                // If max attempts reached, I will throw error.
                // Safe default: Delete files on ultimate failure to prevent storage leak, 
                // unless user specifically wants manual recovery. 
                // I'll keep them for safety as per "if not sucessfully try again" 
                // (maybe user implies USER tries again, so file must exist? No, user re-uploads usually).
                
                // Let's Clean up on ultimate failure to be a good citizen, 
                // BUT the prompt "make sure if... successfully then remove" might imply 
                // "only remove if successful".
                // I will NOT delete on failure for now to strictly follow "only remove if successful".
                throw new ApiError(500, "Failed to save video to database after multiple attempts")
            }
            // Wait a bit before retry? (Optional, but good practice)
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }
    }

    // 3. Success: Delete local files
    if (createdVideo) {
        try {
            if (fs.existsSync(videoFileLocalPath)) fs.unlinkSync(videoFileLocalPath)
            if (fs.existsSync(thumbnailLocalPath)) fs.unlinkSync(thumbnailLocalPath)
        } catch (cleanupError) {
            console.error("Error cleaning up local files after successful DB save:", cleanupError);
            // Non-blocking error
        }
    }

    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Video published successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    // Increment view count
    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    });

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: {
                                $size: "$subscribers"
                            },
                            isSubscribed: {
                                $cond: {
                                    if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            subscribersCount: 1,
                            isSubscribed: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            }
        }
    ]);

    if (!video?.length) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, video[0], "Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    if (!title && !description) {
        throw new ApiError(400, "Title or description required for update")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    const thumbnailLocalPath = req.file?.path;

    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnail.url) {
            throw new ApiError(400, "Error while uploading thumbnail");
        }
        video.thumbnail = thumbnail.url;
    }

    if (title) video.title = title;
    if (description) video.description = description;

    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    // TODO: Delete from Cloudinary (videoFile and thumbnail) - skipped for brevity but recommended

    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, { isPublished: video.isPublished }, "Publish status toggled successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
