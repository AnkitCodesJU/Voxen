"use client";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function MyListPage() {
    const { isLoggedIn } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-24 px-8">
                <h1 className="text-3xl font-bold mb-4">My List</h1>
                {isLoggedIn ? (
                    <p className="text-zinc-400">Your saved videos will appear here.</p>
                ) : (
                    <p className="text-zinc-400">Please sign in to view your list.</p>
                )}
            </div>
        </div>
    );
}
