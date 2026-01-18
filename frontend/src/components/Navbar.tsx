"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { isLoggedIn, logout, user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    if (pathname === "/login" || pathname === "/register") return null;

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
                isScrolled ? "bg-background/90 backdrop-blur-sm shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
            )}
        >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold text-primary tracking-tighter uppercase">
                        Voxen
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-foreground hover:text-gray-300 transition">
                            Home
                        </Link>
                        <Link href="/series" className="text-sm font-medium text-gray-300 hover:text-white transition">
                            TV Shows
                        </Link>
                        <Link href="/movies" className="text-sm font-medium text-gray-300 hover:text-white transition">
                            Movies
                        </Link>
                        <Link href="/live" className="text-sm font-medium text-primary hover:text-red-400 transition animate-pulse">
                            Live Classes
                        </Link>
                        <Link href="/my-list" className="text-sm font-medium text-gray-300 hover:text-white transition">
                            My List
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center">
                        {isSearchOpen ? (
                            <div className="flex items-center bg-black/50 border border-gray-600 rounded px-2 py-1 mr-4 transition-all duration-300">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Titles, people, genres"
                                    className="bg-transparent border-none focus:outline-none text-white text-sm ml-2 w-48"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && searchQuery.trim()) {
                                            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                            setIsSearchOpen(false); // Optional: close after search
                                        }
                                    }}
                                    autoFocus
                                />
                                <X
                                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white"
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery("");
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                className="text-gray-300 hover:text-white cursor-pointer mr-6"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    {isLoggedIn ? (
                        <>
                            <div className="hidden sm:block">
                                <NotificationDropdown />
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer group relative">
                                <div
                                    className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white text-xs">{user?.fullName?.charAt(0) || "U"}</span>
                                    )}
                                </div>

                                {userMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded shadow-lg py-1 flex flex-col z-50">
                                        <Link
                                            href="/profile"
                                            className="px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white transition"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white transition"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Your Content
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setUserMenuOpen(false);
                                            }}
                                            className="px-4 py-2 text-sm text-left text-red-500 hover:bg-zinc-800 hover:text-red-400 transition"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link href="/login" className="bg-primary text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-red-700 transition">
                            Sign In
                        </Link>
                    )}

                    <div className="md:hidden text-white cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-zinc-900 absolute top-full left-0 w-full p-4 flex flex-col gap-4 shadow-lg border-t border-zinc-800">
                    <Link href="/" className="text-white hover:text-primary">Home</Link>
                    <Link href="/live" className="text-primary font-bold">Live Classes</Link>
                    <Link href="/my-list" className="text-gray-300">My List</Link>
                    {!isLoggedIn && (
                        <Link href="/login" className="text-white bg-primary px-4 py-2 rounded text-center">Sign In</Link>
                    )}
                </div>
            )}
        </nav>
    );
}
