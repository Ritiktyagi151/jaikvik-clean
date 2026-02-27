"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from "react";
// Lucide-React icons use kar rahe hain jo bundle size kam rakhte hain
import { Play, Pause, Volume2, VolumeX, X, ArrowLeft as BackArrow } from "lucide-react"; 
import { cachedGet } from "@/lib/clientApiCache";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface VideoItemProps {
  label: string;
  videoSrc: string;
  posterSrc: string;
  title: string;
  description: string;
}

const VideoItem: React.FC<VideoItemProps> = memo(({
  label,
  videoSrc,
  posterSrc,
  title,
  description,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPoster, setShowPoster] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isMobileViewport = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  const handlePlay = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      setShowPoster(false);
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      videoRef.current.muted = true;
      setIsMuted(true);
      await videoRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const handlePause = useCallback(() => {
    videoRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const handleResetVideo = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
    setShowPoster(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!entry.isIntersecting) handleResetVideo();
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [handleResetVideo]);

  return (
    <>
      <div ref={containerRef} className="w-full flex justify-center px-4">
        <div
          className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black group cursor-pointer"
          onClick={() =>
            isMobileViewport()
              ? setIsFullscreen(true)
              : isPlaying
              ? handlePause()
              : handlePlay()
          }
        >
          <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase z-10">
            {label}
          </span>

          {isInView ? (
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover z-[2] transition-opacity duration-300 ${showPoster ? "opacity-0" : "opacity-100"}`}
              loop
              playsInline
              muted={isMuted}
              // preload="none" 
              poster={posterSrc}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
             <img src={posterSrc} className="absolute inset-0 w-full h-full object-cover" alt={title} />
          )}

          {showPoster && (
            <img src={posterSrc} alt={title} className="absolute inset-0 w-full h-full object-cover z-[1]" loading="lazy" />
          )}

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-[3]">
              <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center transition-transform hover:scale-110">
                {isPlaying ? <Pause className="text-white" size={32} /> : <Play className="text-white ml-1" size={32} />}
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white z-[3]">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm opacity-90 line-clamp-2">{description}</p>
          </div>

          {!showPoster && !isMobileViewport() && (
            <button
              className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 z-[4] hover:bg-black/70 transition-all"
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); if(videoRef.current) videoRef.current.muted = !isMuted; }}
            >
              {isMuted ? <VolumeX className="text-white" size={20} /> : <Volume2 className="text-white" size={20} />}
            </button>
          )}
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999] md:hidden p-4">
          <button className="absolute top-6 left-6 text-white" onClick={() => setIsFullscreen(false)}><BackArrow size={30} /></button>
          <button className="absolute top-6 right-6 text-white" onClick={() => setIsFullscreen(false)}><X size={30} /></button>
          <video src={videoSrc} autoPlay controls className="max-h-[85%] max-w-full rounded-lg" />
        </div>
      )}
    </>
  );
});

const CorporateVideosSection: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchCorporateVideos = useCallback(async () => {
    try {
      setFetching(true);
      const response = await cachedGet(`${API_BASE}/corporate-videos`);
      setVideos(response.data.filter((v: any) => v.status === "published"));
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchCorporateVideos();
  }, [fetchCorporateVideos]);

  if (fetching) return <div className="py-20 text-center text-white animate-pulse">Loading...</div>;
  if (videos.length === 0) return null;

  return (
    <section className="w-full py-12 px-2 sm:px-4 lg:px-6 bg-black pb-5">
      <div className="max-w-8xl mx-auto">
        <div className="text-left mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Our Corporate Videos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <VideoItem key={video._id} {...video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporateVideosSection;
