"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { cachedGet } from "@/lib/clientApiCache";
import ArrowLeft from "../../components/arrows/ArrowLeft";
import ArrowRight from "../../components/arrows/ArrowRight";
import ReelVideoCard from "../../components/cards/ReelVideoCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_URL = `${API_BASE_URL}/reels`;

const SocialMediaSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const desktopSwiperRef = useRef<SwiperType | null>(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reelsData, setReelsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const progressRafRef = useRef<number | null>(null);

  // Fetch Data
  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const response = await cachedGet(API_URL);
        if (response.data.success) {
          setReelsData(response.data.data);
        } else {
          setReelsData(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error("Error fetching reels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  // Track Video Progress
  const startProgressTracking = useCallback((vid: HTMLVideoElement) => {
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    const tick = () => {
      if (!vid || vid.paused || vid.ended) return;
      const pct = vid.duration ? (vid.currentTime / vid.duration) * 100 : 0;
      setProgress(pct);
      progressRafRef.current = requestAnimationFrame(tick);
    };
    progressRafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      swiperRef.current?.slideNext();
    }, 200);
  }, []);

  // Mobile Video Control Logic
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth > 1024 || reelsData.length === 0) return;

    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === activeIndex) {
        vid.muted = true;
        vid.onended = handleVideoEnded;
        vid.play()
          .then(() => startProgressTracking(vid))
          .catch((err) => console.log("Autoplay prevented:", err));
      } else {
        vid.onended = null;
        vid.pause();
        vid.currentTime = 0;
      }
    });

    return () => {
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    };
  }, [activeIndex, reelsData, handleVideoEnded, startProgressTracking]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    setProgress(0);
  }, []);

  const handleVideoHover = (value: boolean) => {
    if (!desktopSwiperRef.current) return;
    if (value) desktopSwiperRef.current.autoplay.stop();
    else desktopSwiperRef.current.autoplay.start();
  };

  if (loading) return <div className="h-60 flex items-center justify-center text-white">Loading Reels...</div>;

  return (
    <div className="overflow-hidden h-auto my-8 bg-black py-10">
      {/* Heading */}
      <div className="px-6 mb-8">
        <h1 className="text-white text-2xl font-bold uppercase tracking-wider border-l-4 border-red-500 pl-4">
          Social Media Reels
        </h1>
      </div>

      {/* ─── MOBILE SLIDER (Shows 3+ videos on screen) ─── */}
      <div className="block lg:hidden">
        <div className="relative w-full">
          <Swiper
            modules={[Navigation]}
            slidesPerView={2.2} // Shows center + partial sides
            centeredSlides={true}
            spaceBetween={-10} // Slight overlap for the stack look
            loop={reelsData.length > 3}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={handleSlideChange}
            speed={600}
            className="!overflow-visible" // Crucial to see side videos
          >
            {reelsData.map((reel, index) => (
              <SwiperSlide key={reel._id || index} className="py-10">
                {({ isActive, isPrev, isNext }) => {
                  // If it's not the active one or direct neighbor, scale it down more
                  const isFar = !isActive && !isPrev && !isNext;
                  
                  return (
                    <div
                      className={`
                        relative rounded-2xl overflow-hidden shadow-2xl
                        transition-all duration-500 ease-in-out
                        ${isActive ? "scale-125 z-30 opacity-100" : "scale-90 z-10 opacity-40"}
                        ${isFar ? "scale-75 opacity-20" : ""}
                      `}
                      style={{ aspectRatio: "9/16" }}
                    >
                      <video
                        ref={(el) => { videoRefs.current[index] = el; }}
                        src={reel.video}
                        poster={reel.poster}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Active Video Overlay */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white shadow-[0_0_10px_#fff]" 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {reelsData.slice(0, 10).map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex % reelsData.length ? "w-8 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─── DESKTOP SLIDER ─── */}
      <div className="hidden lg:block px-10">
        <div className="relative group">
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={4.5}
            spaceBetween={20}
            loop={reelsData.length > 4}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            onSwiper={(swiper) => (desktopSwiperRef.current = swiper)}
            className="mySwiper"
          >
            {reelsData.map((reel) => (
              <SwiperSlide key={reel._id}>
                <ReelVideoCard
                  src={reel.video}
                  poster={reel.poster}
                  onHover={handleVideoHover}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowLeft onClick={() => desktopSwiperRef.current?.slidePrev()} />
            <ArrowRight onClick={() => desktopSwiperRef.current?.slideNext()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;