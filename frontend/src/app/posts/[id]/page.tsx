"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Heart, MessageCircle, Send, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function PostPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [tweet, setTweet] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchPostData();
    }, [id]);

    const fetchPostData = async () => {
        try {
            setLoading(true);
            const [tweetRes, commentsRes] = await Promise.all([
                api.get(`/tweets/${id}`),
                api.get(`/comments/t/${id}`)
            ]);

            if (tweetRes.data.success) {
                setTweet(tweetRes.data.data);
            }
            if (commentsRes.data.success) {
                setComments(commentsRes.data.data.docs);
            }
        } catch (err: any) {
            console.error("Error fetching post data", err);
            setError("Failed to load post.");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!tweet) return;
        try {
            const res = await api.post(`/likes/toggle/t/${tweet._id}`);
            if (res.data.success) {
                setTweet((prev: any) => ({
                    ...prev,
                    isLiked: res.data.data.isLiked,
                    likesCount: res.data.data.isLiked ? prev.likesCount + 1 : prev.likesCount - 1
                }));
            }
        } catch (err) {
            console.error("Error toggling like", err);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setCommentLoading(true);
            const res = await api.post(`/comments/t/${tweet._id}`, { content: newComment });
            if (res.data.success) {
                setNewComment("");
                const commentsRes = await api.get(`/comments/t/${tweet._id}`);
                if (commentsRes.data.success) {
                    setComments(commentsRes.data.data.docs);
                }
            }
        } catch (err) {
            console.error("Error adding comment", err);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/tweets/${tweet._id}`);
            router.push("/dashboard");
        } catch (err) {
            console.error("Error deleting post", err);
            alert("Failed to delete post");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error || !tweet) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h1 className="text-xl mb-4 text-red-500">Post not found</h1>
                <Link href="/" className="text-blue-500 hover:underline">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-24 px-4 max-w-4xl mx-auto pb-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-400 hover:text-white mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>

                {/* Post Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg mb-8">
                    {/* Header */}
                    <div className="p-6 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                                <img
                                    src={tweet.owner?.avatar || "/default-avatar.png"}
                                    alt={tweet.owner?.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">{tweet.owner?.fullName}</h1>
                                <p className="text-gray-400 text-sm">@{tweet.owner?.username}</p>
                                <p className="text-gray-500 text-xs mt-1">
                                    {new Date(tweet.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        {user && user._id === tweet.owner?._id && (
                            <button
                                onClick={handleDelete}
                                className="text-zinc-500 hover:text-red-500 transition p-2"
                                title="Delete Post"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-4">
                        <p className="text-gray-200 text-lg whitespace-pre-wrap leading-relaxed">
                            {tweet.content}
                        </p>
                    </div>

                    {/* Image */}
                    {tweet.image && (
                        <div className="w-full max-h-[600px] overflow-hidden bg-black flex justify-center bg-zinc-950">
                            <img
                                src={tweet.image}
                                alt="Post content"
                                className="max-w-full max-h-[600px] object-contain"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="px-6 py-4 border-t border-zinc-800 flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 transition ${tweet.isLiked ? "text-red-500" : "text-gray-400 hover:text-white"}`}
                        >
                            <Heart className={`w-6 h-6 ${tweet.isLiked ? "fill-current" : ""}`} />
                            <span className="text-sm font-medium">{tweet.likesCount} Likes</span>
                        </button>

                        <div className="flex items-center gap-2 text-gray-400">
                            <MessageCircle className="w-6 h-6" />
                            <span className="text-sm font-medium">{comments.length} Comments</span>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-6">Comments</h3>

                    {/* Add Comment */}
                    <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                            <img
                                src={user?.avatar || "/default-avatar.png"}
                                alt="My Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-zinc-800 border-none rounded-full px-4 py-3 pr-12 text-white focus:ring-1 focus:ring-zinc-600 outline-none placeholder-zinc-500 transition"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || commentLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-700 rounded-full text-white hover:bg-zinc-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                                        <img
                                            src={comment.owner?.avatar || "/default-avatar.png"}
                                            alt={comment.owner?.username}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-zinc-800/50 rounded-2xl px-4 py-3 inline-block min-w-[200px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-sm text-gray-200">{comment.owner?.fullName}</h4>
                                                <span className="text-xs text-zinc-500 ml-4">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-zinc-500 py-4">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
