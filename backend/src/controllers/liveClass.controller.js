import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { LiveClass } from "../models/liveClass.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createLiveClass = asyncHandler(async (req, res) => {
    const { title, description, startTime } = req.body;

    if (!title || !startTime) {
        throw new ApiError(400, "Title and Start Time are required");
    }

    let thumbnailUrl = "https://images.unsplash.com/photo-1536240478700-b869060f5c79?q=80&w=2000&auto=format&fit=crop"; // Default

    if (req.file) {
        const thumbnailLocalPath = req.file.path;
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (thumbnail?.url) {
            thumbnailUrl = thumbnail.url;
        }
    }

    const liveClass = await LiveClass.create({
        title,
        description,
        startTime,
        thumbnail: thumbnailUrl,
        instructor: req.user._id,
        status: "SCHEDULED"
    });

    return res.status(201).json(
        new ApiResponse(201, liveClass, "Live Class Scheduled Successfully")
    );
});

const getLiveClasses = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    // Sort by startTime, nearest first
    const liveClasses = await LiveClass.find({ status: { $ne: "CANCELLED" } })
        .populate("instructor", "fullName avatar")
        .sort({ startTime: 1 }) 
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
        
    return res.status(200).json(
        new ApiResponse(200, liveClasses, "Live Classes Fetched Successfully")
    );
});

const getLiveClassById = asyncHandler(async (req, res) => {
    const { liveClassId } = req.params;
    
    const liveClass = await LiveClass.findById(liveClassId).populate("instructor", "fullName avatar");
    
    if (!liveClass) {
        throw new ApiError(404, "Live Class not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, liveClass, "Live Class details fetched")
    );
});


const startLiveClass = asyncHandler(async (req, res) => {
    const { liveClassId } = req.params;
    const { streamKey } = req.body;

    const liveClass = await LiveClass.findById(liveClassId);

    if (!liveClass) {
        throw new ApiError(404, "Live Class not found");
    }

    if (liveClass.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the instructor can start the class");
    }

    liveClass.status = "LIVE";
    if (streamKey) liveClass.streamKey = streamKey; // maintain stream key securely
    await liveClass.save();

    return res.status(200).json(
        new ApiResponse(200, liveClass, "Live Class Started")
    );
});

const endLiveClass = asyncHandler(async (req, res) => {
    const { liveClassId } = req.params;

    const liveClass = await LiveClass.findById(liveClassId);

    if (!liveClass) {
        throw new ApiError(404, "Live Class not found");
    }

    if (liveClass.instructor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the instructor can end the class");
    }

    liveClass.status = "COMPLETED";
    await liveClass.save();

    // Archive as Video
    // Since we don't have a real recording, we use placeholders or previous data
    await Video.create({
        videoFile: "https://res.cloudinary.com/demo/video/upload/v1631234567/sample_recording.mp4", // Placeholder for demo
        thumbnail: liveClass.thumbnail || "https://res.cloudinary.com/demo/image/upload/v1631234567/sample_thumb.jpg",
        title: `[Recorded] ${liveClass.title}`,
        description: liveClass.description || "Recorded live class",
        duration: 3600, // Placeholder duration 1hr
        owner: req.user._id,
        isPublished: true, // Default to public as per "recorded as a normal video" implication, but user can change later
        isMovie: false
    });

    return res.status(200).json(
        new ApiResponse(200, liveClass, "Live Class Ended and Recorded")
    );
});

export {
    createLiveClass,
    getLiveClasses,
    getLiveClassById,
    startLiveClass,
    endLiveClass
}
