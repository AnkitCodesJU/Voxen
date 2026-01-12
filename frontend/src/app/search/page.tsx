"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

interface SearchResults {
    videos: any[];
    liveClasses: any[];
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const [results, setResults] = useState<SearchResults>({ videos: [], liveClasses: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/search?query=${query}`);
                setResults(response.data.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
        );
    }

    const hasResults = results.videos.length > 0 || results.liveClasses.length > 0;

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-24 px-8 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Search Results for <span className="text-red-500">"{query}"</span>
                </h1>

                {!hasResults && !loading && (
                    <div className="text-gray-400">No results found for your query.</div>
                )}

                {/* Live Classes Section */}
                {results.liveClasses.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold mb-4">Live Classes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {results.liveClasses.map((item) => (
                                <Link key={item._id} href={`/live/${item._id}`} className="block group">
                                    <div className="relative aspect-video rounded-md overflow-hidden bg-gray-900 mb-2">
                                        <img
                                            src={item.thumbnail?.url || item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded animate-pulse">
                                            LIVE
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white truncate">{item.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Videos Section */}
                {results.videos.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold mb-4">Videos & Movies</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {results.videos.map((item) => (
                                <Link key={item._id} href={`/watch/${item._id}`} className="block group">
                                    <div className="relative aspect-video rounded-md overflow-hidden bg-gray-900 mb-2">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                                            {formatDuration(item.duration)}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white truncate">{item.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{item.views} views</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
