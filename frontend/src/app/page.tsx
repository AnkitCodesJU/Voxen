"use client";

import React, { useEffect, useState } from "react";
import VideoCard from "@/components/VideoCard";
import api from "@/lib/axios";

export default function Home() {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [vodVideos, setVodVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/live-classes");
        if (response.data.success) {
          const allVideoData = response.data.data;
          const live = allVideoData.filter((v: any) => v.status === "LIVE");
          const others = allVideoData.filter((v: any) => v.status !== "LIVE");
          setLiveClasses(live);
          setVodVideos(others);
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
    <div className="min-h-screen bg-black text-white">
      {/* Live Classes Section */}
      {liveClasses.length > 0 && (
        <section className="mb-8 px-4 md:px-8 mt-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <span className="w-2 h-8 bg-primary rounded-sm"></span>
            Live Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {liveClasses.map((video) => (
              <VideoCard key={video._id} {...video} isLive={true} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended Videos */}
      <section className="px-4 md:px-8 mt-4 mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">Recommended / Upcoming</h2>
        {vodVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {vodVideos.map((video) => (
              <VideoCard key={video._id} {...video} isLive={false} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">No recommended videos at the moment.</p>
        )}
      </section>
    </div>
  );
}
