"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import { Loader2, ArrowLeft } from "lucide-react";
import CursorParticles from "@/components/CursorParticles";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await axios.post("/users/forgot-password", { email });
            setMessage("Reset link sent to your email (Check console for mock token).");
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
            <CursorParticles />

            <div className="z-10 w-full max-w-md rounded-2xl bg-zinc-900/50 px-8 py-10 shadow-2xl backdrop-blur-xl border border-white/10">
                <div className="mb-8">
                    <Link href="/login" className="flex items-center text-sm text-zinc-400 hover:text-white mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
                    <p className="text-zinc-400 text-sm">Enter your email and we'll send you a reset link.</p>
                </div>

                {message ? (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-sm mb-6">
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg bg-black/50 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-primary py-3 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
