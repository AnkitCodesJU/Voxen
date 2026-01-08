"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();

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
                    <div className="hidden sm:block text-gray-300 hover:text-white cursor-pointer">
                        <Search className="w-5 h-5" />
                    </div>
                    {isLoggedIn ? (
                        <>
                            <div className="hidden sm:block text-gray-300 hover:text-white cursor-pointer">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer group" onClick={logout}>
                                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Profile" className="w-full h-full object-cover" />
                                </div>
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
