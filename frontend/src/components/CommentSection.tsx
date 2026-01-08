"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Comment {
    id: string;
    user: string;
    avatar: string;
    text: string;
    likes: number;
    timeAgo: string;
}

const dummyComments: Comment[] = [
    { id: "1", user: "John Doe", avatar: "https://picsum.photos/seed/user1/50/50", text: "This is exactly what I was looking for! Thanks for sharing.", likes: 45, timeAgo: "2 days ago" },
    { id: "2", user: "Jane Smith", avatar: "https://picsum.photos/seed/user2/50/50", text: "Great quality, looking forward to the next part.", likes: 12, timeAgo: "1 day ago" },
    { id: "3", user: "Dev Guy", avatar: "https://picsum.photos/seed/user3/50/50", text: "Can you make a tutorial on Redux Toolkit as well?", likes: 89, timeAgo: "5 hours ago" },
];

export default function CommentSection({ videoId }: { videoId: string }) {
    const [comments, setComments] = useState<Comment[]>(dummyComments);
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newComment: Comment = {
            id: Date.now().toString(),
            user: "You",
            avatar: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
            text: input,
            likes: 0,
            timeAgo: "Just now"
        };
        setComments([newComment, ...comments]);
        setInput("");
    };

    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold text-white mb-4">{comments.length} Comments</h3>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="You" className="w-10 h-10 rounded-full" />
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
                    <div key={comment.id} className="flex gap-4">
                        <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-white">{comment.user}</span>
                                <span className="text-xs text-zinc-400">{comment.timeAgo}</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{comment.text}</p>
                            <div className="flex items-center gap-4 text-zinc-400 text-sm">
                                <button className="flex items-center gap-1 hover:text-white"><ThumbsUp className="w-4 h-4" /> {comment.likes}</button>
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
