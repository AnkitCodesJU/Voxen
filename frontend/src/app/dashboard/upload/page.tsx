"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Upload, X, Image as ImageIcon, FileVideo } from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

export default function UploadVideoPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "thumbnail") => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === "video") setVideoFile(file);
            else setThumbnail(file);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim() || !description.trim() || !videoFile || !thumbnail) {
            setError("All fields (Title, Description, Video, Thumbnail) are required");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);

        try {
            await api.post("/videos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Upload failed", err);
            setError(err.response?.data?.message || "Upload failed");
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-3xl bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Upload Video</h1>
                    <button onClick={() => router.back()} className="p-2 hover:bg-zinc-800 rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-6">
                    {/* Video Upload Area */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Video File</label>
                        <div className={cn(
                            "border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center transition hover:border-blue-500 hover:bg-zinc-800/50 cursor-pointer",
                            videoFile && "border-green-500 bg-green-500/5"
                        )}>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleFileChange(e, "video")}
                                className="hidden"
                                id="video-upload"
                            />
                            <label htmlFor="video-upload" className="cursor-pointer">
                                {videoFile ? (
                                    <div className="flex flex-col items-center text-green-400">
                                        <FileVideo className="w-10 h-10 mb-2" />
                                        <p className="font-medium">{videoFile.name}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Upload className="w-10 h-10 mb-2" />
                                        <p className="text-sm">Drag and drop or click to select video</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Thumbnail Upload Area */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Thumbnail</label>
                        <div className={cn(
                            "border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center transition hover:border-blue-500 hover:bg-zinc-800/50 cursor-pointer",
                            thumbnail && "border-green-500 bg-green-500/5"
                        )}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "thumbnail")}
                                className="hidden"
                                id="thumbnail-upload"
                            />
                            <label htmlFor="thumbnail-upload" className="cursor-pointer">
                                {thumbnail ? (
                                    <div className="flex flex-col items-center text-green-400">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <p className="font-medium">{thumbnail.name}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <p className="text-sm">Select thumbnail image</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Video title"
                            className="w-full bg-zinc-800 border-none rounded p-3 text-white focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell viewers about your video"
                            rows={4}
                            className="w-full bg-zinc-800 border-none rounded p-3 text-white focus:ring-2 focus:ring-blue-600 resize-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 rounded text-sm font-medium text-gray-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-8 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    Uploading...
                                </>
                            ) : (
                                "Publish Video"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
