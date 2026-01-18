import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

interface Notification {
    _id: string;
    type: 'LIKE' | 'COMMENT' | 'SUBSCRIBE' | 'LOGIN' | 'NEW_VIDEO';
    message: string;
    isRead: boolean;
    createdAt: string;
    sender?: {
        username: string;
        avatar: string;
    };
    relatedVideo?: {
        _id: string;
        title: string;
        thumbnail: string;
    };
}

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/notifications", {
                withCredentials: true
            });
            setNotifications(response.data.data.notifications);
            setUnreadCount(response.data.data.unreadCount);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll for new notifications every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleMarkAsRead = async (notificationId?: string) => {
        try {
            await axios.patch(
                `http://localhost:8000/api/v1/notifications/mark-read/${notificationId || ''}`,
                {},
                { withCredentials: true }
            );

            if (notificationId) {
                setNotifications(prev => prev.map(n =>
                    n._id === notificationId ? { ...n, isRead: true } : n
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const getNotificationLink = (notification: Notification) => {
        switch (notification.type) {
            case 'NEW_VIDEO':
            case 'LIKE':
            case 'COMMENT':
                return notification.relatedVideo ? `/watch/${notification.relatedVideo._id}` : '#';
            case 'SUBSCRIBE':
                return notification.sender ? `/channel/${notification.sender.username}` : '#';
            case 'LOGIN':
            default:
                return '#'; // Maybe link to security settings?
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="text-gray-300 hover:text-white cursor-pointer relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-zinc-900 border border-zinc-800 rounded shadow-xl overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead();
                                }}
                                className="text-xs text-blue-500 hover:text-blue-400"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Link
                                    key={notification._id}
                                    href={getNotificationLink(notification)}
                                    className={`block px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800 transition ${!notification.isRead ? 'bg-zinc-800/50' : ''}`}
                                    onClick={() => {
                                        if (!notification.isRead) handleMarkAsRead(notification._id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {notification.sender?.avatar ? (
                                                <img
                                                    src={notification.sender.avatar}
                                                    alt="Avatar"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                                                    <Bell className="w-4 h-4 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-200 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        {notification.relatedVideo?.thumbnail && (
                                            <div className="flex-shrink-0 ml-2">
                                                <img
                                                    src={notification.relatedVideo.thumbnail}
                                                    alt="Video"
                                                    className="w-16 h-9 object-cover rounded"
                                                />
                                            </div>
                                        )}
                                        {!notification.isRead && (
                                            <div className="flex-shrink-0 self-center ml-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
