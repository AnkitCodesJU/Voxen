"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";

interface Comment {
    _id: string;
    content: string;
    owner: {
        _id: string;
        username: string;
        fullName: string;
        avatar: string;
    };
    likes: number; // Not implemented backend yet, defaulting
    createdAt: string;
}

export default function CommentSection({ videoId }: { videoId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    const fetchComments = async () => {
        try {
            const res = await api.get(`/comments/${videoId}`);
            setComments(res.data.data.docs);
        } catch (error) {
            console.error("Error fetching comments", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            const res = await api.post(`/comments/${videoId}`, { content: input });
            // Add new comment to list (optimistic or fetch again)
            // The response contains the new comment but 'owner' might be ID only unless populated or we manually construct using current user.
            // For simplicity, fetch again or manually append if we had user info in context. 
            // We'll fetch again to be safe and simple.
            fetchComments();
            setInput("");
        } catch (error) {
            console.error("Error posting comment", error);
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold text-white mb-4">{comments.length} Comments</h3>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
                {/* Avatar: We should get from user context really, hardcoding for now or using placeholder */}
                <img src={"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="You" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-transparent border-b border-zinc-700 pb-2 text-white focus:outline-none focus:border-white transition-colors"
                    />
                    <div className="flex justify-end mt-2">
                        <button type="submit" disabled={!input.trim()} className="bg-blue-600 text-black font-bold px-4 py-2 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500">
                            Comment
                        </button>
                    </div>
                </div>
            </form>

            {/* List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4">
                        <img src={comment.owner?.avatar || "https://picsum.photos/50"} alt={comment.owner?.username} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-white">{comment.owner?.fullName || "User"}</span>
                                <span className="text-xs text-zinc-400">{comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ""}</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{comment.content}</p>
                            <div className="flex items-center gap-4 text-zinc-400 text-sm">
                                <button className="flex items-center gap-1 hover:text-white"><ThumbsUp className="w-4 h-4" /> {0}</button>
                                <button className="hover:text-white"><ThumbsDown className="w-4 h-4" /></button>
                                <button className="hover:text-white text-xs font-bold">Reply</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
