"use client";

import React, { useEffect, useState } from "react";
import VideoCard from "@/components/VideoCard";
import api from "@/lib/axios";
import Link from "next/link";

export default function Home() {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [vodVideos, setVodVideos] = useState<any[]>([]);
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, videoRes, tweetRes] = await Promise.all([
          api.get("/live-classes"),
          api.get("/videos?sortBy=likesCount&sortType=desc&limit=20"),
          api.get("/tweets"),
        ]);

        if (liveRes.data.success) {
          const allVideoData = liveRes.data.data;
          const live = Array.isArray(allVideoData)
            ? allVideoData.filter((v: any) => v.status === "LIVE")
            : [];
          setLiveClasses(live);
        }

        if (videoRes.data.success) {
          const videos = videoRes.data.data.docs;
          setVodVideos(videos);
        }

        if (tweetRes.data.success) {
          setTweets(tweetRes.data.data);
        }

      } catch (error) {
        console.error("Failed to fetch home page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

      {/* Latest Posts */}
      <section className="px-4 md:px-8 mt-4 mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">Latest Posts</h2>
        {tweets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tweets.map((tweet) => (
              <Link key={tweet._id} href={`/posts/${tweet._id}`} className="block">
                <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 hover:bg-zinc-900 transition flex flex-col gap-4 h-full">
                  {tweet.image && (
                    <img src={tweet.image} alt="Post image" className="w-full h-48 object-cover rounded-md" />
                  )}
                  <div>
                    <p className="text-gray-200 mb-2 line-clamp-3">{tweet.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">No posts available.</p>
        )}
      </section>
    </div>
  );
}
