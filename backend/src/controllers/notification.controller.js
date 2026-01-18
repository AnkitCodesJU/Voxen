import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createNotification = async (recipient, sender, type, message, relatedVideo = null, relatedComment = null) => {
    try {
        if (!recipient) return;

        // Don't notify if sender is same as recipient (e.g. liking own video), except for login
        if (sender && recipient.toString() === sender.toString() && type !== 'LOGIN') return;

        await Notification.create({
            recipient,
            sender,
            type,
            message,
            relatedVideo,
            relatedComment
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        // We don't want to break the main flow if notification fails, so just log it
    }
};

const getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .populate("sender", "username avatar")
        .populate("relatedVideo", "title thumbnail")
        .sort({ createdAt: -1 })
        .limit(20);

    const unreadCount = await Notification.countDocuments({ 
        recipient: req.user._id, 
        isRead: false 
    });

    return res.status(200).json(
        new ApiResponse(
            200, 
            { notifications, unreadCount }, 
            "Notifications fetched successfully"
        )
    );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    if (!notificationId) {
        // Mark all as read
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        return res.status(200).json(
            new ApiResponse(200, {}, "All notifications marked as read")
        );
    }

    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to mark this notification as read");
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification marked as read")
    );
});

export {
    createNotification,
    getUserNotifications,
    markNotificationAsRead
};
