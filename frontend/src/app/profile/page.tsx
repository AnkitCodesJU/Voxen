"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Plus, Camera } from "lucide-react";

export default function ProfilePage() {
    const { user, checkAuth, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            await api.patch("/users/update-account", formData);
            await checkAuth(); // Refresh user data
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error: any) {
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            await api.post("/users/change-password", passwordData);
            setPasswordData({ oldPassword: "", newPassword: "" });
            setMessage({ type: "success", text: "Password changed successfully!" });
        } catch (error: any) {
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to change password" });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "coverImage") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(type, file);

        try {
            setLoading(true);
            const endpoint = type === "avatar" ? "/users/avatar" : "/users/cover-image";
            await api.patch(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await checkAuth();
            setMessage({ type: "success", text: `${type === "avatar" ? "Profile picture" : "Cover image"} updated!` });
        } catch (error: any) {
            setMessage({ type: "error", text: "Failed to upload image" });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white px-4 pb-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header / Cover */}
                {/* Header / Cover */}
                <div className="relative h-48 md:h-64 rounded-xl bg-zinc-800 overflow-hidden border border-zinc-800 group">
                    {user.coverImage ? (
                        <>
                            <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
                            <label className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded cursor-pointer transition backdrop-blur-sm text-sm font-medium flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                Change Cover
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "coverImage")} />
                            </label>
                        </>
                    ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700/50 transition cursor-pointer">
                            <Plus className="w-12 h-12" />
                            <span className="text-sm font-medium mt-2">Add Cover Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "coverImage")} />
                        </label>
                    )}
                </div>

                {/* Profile Info */}
                <div className="relative px-6 -mt-20 mb-8 flex flex-col md:flex-row items-end md:items-end gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black bg-zinc-800 overflow-hidden">
                            <img src={user.avatar || "/default-avatar.svg"} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition">
                            <span className="text-xs font-medium">Change</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "avatar")} />
                        </label>
                    </div>
                    <div className="mb-2 text-center md:text-left">
                        <h1 className="text-3xl font-bold">{user.fullName}</h1>
                        <p className="text-zinc-400">@{user.username}</p>
                    </div>
                    <div className="flex-1" />
                    <button onClick={logout} className="mb-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium transition">
                        Logout
                    </button>
                </div>

                {/* Feedback Message */}
                {message.text && (
                    <div className={`p-4 rounded ${message.type === "success" ? "bg-green-900/50 text-green-200 border border-green-800" : "bg-red-900/50 text-red-200 border border-red-800"}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Edit Details */}
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <h2 className="text-xl font-bold mb-6">Account Details</h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-zinc-400">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-zinc-400">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded font-medium transition disabled:opacity-50">
                                Save Changes
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <h2 className="text-xl font-bold mb-6">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-zinc-400">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-zinc-400">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="bg-zinc-950 border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50">
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
