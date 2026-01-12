"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import CursorParticles from "@/components/CursorParticles";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" }); // Using email field for both email/username for now as backend likely expects one
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData);
            const redirectUrl = searchParams.get('redirect_url') || '/';
            router.push(redirectUrl);
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
            alert(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
            {/* Particle Background */}
            <CursorParticles />

            {/* Login Card */}
            <div className="z-10 w-full max-w-md rounded-2xl bg-black/40 px-8 py-10 shadow-2xl backdrop-blur-xl border border-white/10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black tracking-tighter text-primary mb-2 uppercase">Voxen</h1>
                    <p className="text-zinc-400">Welcome back! Please sign in.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <input
                                type="text"
                                name="email" // Assuming backend accepts email/username in 'email' or 'username' field. Usually 'email' or 'username'. Note says "Email or Username".
                                value={formData.email}
                                onChange={handleChange}
                                className="peer block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder=" "
                                required
                            />
                            <label className="absolute top-3 left-4 scale-75 transform text-sm text-zinc-400 duration-200 -translate-y-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 origin-[0]">
                                Email or Username
                            </label>
                        </div>
                        <div className="relative group">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="peer block w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder=" "
                                required
                            />
                            <label className="absolute top-3 left-4 scale-75 transform text-sm text-zinc-400 duration-200 -translate-y-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 origin-[0]">
                                Password
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary py-3.5 font-bold text-white transition-all hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/25"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Signing In...
                            </span>
                        ) : "Sign In"}
                    </button>

                    <div className="flex items-center justify-between text-xs text-zinc-400">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                            <input type="checkbox" className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary" /> Remember me
                        </label>
                        <Link href="/forgot-password" className="hover:text-primary transition-colors">Forgot Password?</Link>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    New to Voxen?{" "}
                    <Link href="/register" className="font-semibold text-white hover:text-primary transition-colors">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
