"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);

    const router = useRouter();
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (e.target.name === "avatar") {
            setAvatar(file);
        } else if (e.target.name === "coverImage") {
            setCoverImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("fullName", formData.fullName);
            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("password", formData.password);

            if (avatar) data.append("avatar", avatar);
            if (coverImage) data.append("coverImage", coverImage);

            await register(data);

            // Redirect to login on success
            alert("Account created successfully! Please log in.");
            router.push("/login");
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black bg-opacity-95 bg-[url('https://images.unsplash.org/photo-1574375927938-d5a98e8efe85?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-blend-overlay">
            <div className="w-full max-w-md rounded-lg bg-black/80 px-8 py-10 shadow-2xl backdrop-blur-sm border border-zinc-800">
                <h2 className="mb-6 text-3xl font-bold text-white">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="relative">
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="peer block w-full rounded-md bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder=" "
                                required
                            />
                            <label className="absolute top-3 left-4 scale-75 transform text-sm text-zinc-400 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 origin-[0]">
                                Full Name
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="peer block w-full rounded-md bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder=" "
                                required
                            />
                            <label className="absolute top-3 left-4 scale-75 transform text-sm text-zinc-400 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 origin-[0]">
                                Username
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="peer block w-full rounded-md bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder=" "
                                required
                            />
                            <label className="absolute top-3 left-4 scale-75 transform text-sm text-zinc-400 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 origin-[0]">
                                Email Address
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="peer block w-full rounded-md bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder=" "
                                required
                            />
                            <label className="absolute top-3 left-4 scale-75 transform text-sm text-zinc-400 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 origin-[0]">
                                Password
                            </label>
                        </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-zinc-400">Profile Picture (Required)</label>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-500 overflow-hidden">
                                {avatar ? (
                                    <img src={URL.createObjectURL(avatar)} alt="Preview" className="w-full h-full object-cover" />
                                ) : "Avatar"}
                            </div>
                            <label className="cursor-pointer text-sm text-primary hover:underline">
                                Upload Avatar
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required
                                />
                            </label>
                        </div>
                    </div>
                    {/* Cover Image Upload (Optional) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-zinc-400">Cover Image (Optional)</label>
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-primary hover:file:bg-zinc-700"
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded bg-primary py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-8 text-zinc-400">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-white hover:underline">
                        Sign in now.
                    </Link>
                </div>
            </div>
        </div>
    );
}
