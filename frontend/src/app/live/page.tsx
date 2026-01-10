"use client";

import React, { useEffect, useState } from "react";
import VideoCard from "@/components/VideoCard";
import api from "@/lib/axios";

export default function LiveClassPage() {
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [scheduledClasses, setScheduledClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await api.get("/live-classes");
                if (response.data.success) {
                    const allData = response.data.data;
                    setLiveClasses(allData.filter((v: any) => v.status === "LIVE"));
                    setScheduledClasses(allData.filter((v: any) => v.status === "SCHEDULED"));
                }
            } catch (error) {
                console.error("Failed to fetch live classes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">

            <div className="space-y-12 px-8 pt-6"> {/* Added padding to match layout */}
                {/* Live Now Section */}
                {liveClasses.length > 0 ? (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            Happening Now
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                            {liveClasses.map((video) => (
                                <VideoCard key={video._id} {...video} isLive={true} />
                            ))}
                        </div>
                    </section>
                ) : (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                            Happening Now
                        </h2>
                        <p className="text-zinc-500">No live classes at the moment.</p>
                    </section>
                )}

                {/* Upcoming Section */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-blue-500 pl-3">
                        Upcoming Streams
                    </h2>
                    {scheduledClasses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                            {scheduledClasses.map((video) => (
                                <VideoCard key={video._id} {...video} isLive={false} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-500">No upcoming streams scheduled.</p>
                    )}
                </section>
            </div>
        </div>
    );
}
