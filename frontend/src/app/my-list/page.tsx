"use client";
"use client";
import { useAuth } from "@/context/AuthContext";

export default function MyListPage() {
    const { isLoggedIn } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="px-8 mt-4">
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
