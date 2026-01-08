"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, Film, CheckSquare, Clock, ThumbsUp, History } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { name: "Home", href: "/", icon: Home },
        { name: "Live Classes", href: "/live", icon: Radio }, // Radio icon for "Live" feel
        { name: "Movies", href: "/movies", icon: Film }, // Keep movies if user wants mixed content
        { name: "Subscriptions", href: "/subscriptions", icon: CheckSquare },
    ];

    const secondaryLinks = [
        { name: "History", href: "/history", icon: History },
        { name: "Watch Later", href: "/watch-later", icon: Clock },
        { name: "Liked Videos", href: "/liked", icon: ThumbsUp },
    ]

    return (
        <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 -translate-x-full border-r border-zinc-800 bg-black/95 transition-transform md:translate-x-0 hidden md:block">
            <div className="flex h-full flex-col overflow-y-auto py-4">
                <div className="px-3 pb-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-1",
                                    isActive
                                        ? "bg-red-600/10 text-primary hover:bg-red-600/20"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-zinc-400")} />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-2 text-sm font-semibold text-zinc-500 uppercase px-6 mb-2 tracking-wider">
                    You
                </div>
                <div className="px-3 pb-4 border-t border-zinc-800 pt-4">
                    {secondaryLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-1",
                                    isActive
                                        ? "bg-red-600/10 text-primary hover:bg-red-600/20"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-zinc-400")} />
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

            </div>
        </aside>
    );
}
