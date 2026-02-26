"use client";

import React, { useRef, useState, useEffect, memo } from "react";
import { cachedGet } from "@/lib/clientApiCache";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import { X, ArrowLeft as BackIcon } from "lucide-react"; 
import ArrowLeft from "../../components/arrows/ArrowLeft";
import ArrowRight from "../../components/arrows/ArrowRight";
import ReelVideoCard from "../../components/cards/ReelVideoCard";

// ✅ API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const OurVideosSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{
    src: string;
    poster: string;
  } | null>(null);

  // ✅ API States
  const [videoList, setVideoList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Videos from API
  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await cachedGet(`${API_URL}/videos`);
        if (isMounted && response.data.success) {
          setVideoList(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch videos", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchVideos();
    return () => { isMounted = false; };
  }, []);

  const handleVideoHover = (value: boolean) => {
    if (swiperRef.current?.autoplay) {
      if (value) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
    }
  };

  if (loading && videoList.length === 0) return null;

  return (
    <div className="overflow-hidden h-auto my-4 ">
      <div className="websiteHeading mb-4">
        <h2 className="uppercase text-gray-200 text-xl inline-block relative">
          <span className="flex font-bold items-center gap-1.5 ml-2">
            Our Videos
          </span>
        </h2>
      </div>

      {/* Swiper */}
      <div className="w-full group relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={10}
          slidesPerView={4.5}
          // Performance Fix: watchSlidesProgress se sirf visible slides render hongi
          watchSlidesProgress={true}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 8 },
            480: { slidesPerView: 1.3, spaceBetween: 8 },
            640: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 2.5, spaceBetween: 10 },
            1024: { slidesPerView: 3.5, spaceBetween: 10 },
            1280: { slidesPerView: 4.5, spaceBetween: 10 },
            1536: { slidesPerView: 5, spaceBetween: 12 },
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          loop={videoList.length > 5}
          autoplay={{
            delay: 3000, // Speed Fix: 1000ms se badha kar 3000ms kiya taaki smooth chale
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          speed={800} // Smoothness Fix
          className="mySwiper !overflow-visible"
        >
          {videoList.map((item) => (
            <SwiperSlide
              key={item._id}
              className="!overflow-visible hover:z-10 transition-transform duration-200"
            >
              <div
                className="cursor-pointer"
                onClick={() => {
                  if (window.innerWidth <= 768) {
                    setSelectedVideo(item);
                  }
                }}
              >
                <ReelVideoCard
                  src={item.src}
                  poster={item.poster}
                  onHover={handleVideoHover}
                  aspectRatio="16/9"
                  scale="hover:scale-[1.15]"
                  classname="transition-all duration-300 ease-in-out"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <ArrowLeft onClick={() => swiperRef.current?.slidePrev()} />
        <ArrowRight onClick={() => swiperRef.current?.slideNext()} />
      </div>

      {/* Overlay Fullscreen Video (only for mobile) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center">
          <button
            className="absolute top-4 left-4 text-white p-2 rounded-full bg-black/40"
            onClick={() => setSelectedVideo(null)} 
          >
            <BackIcon size={24} />
          </button>

          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/40"
            onClick={() => setSelectedVideo(null)}
          >
            <X size={26} />
          </button>

          <video
            src={selectedVideo.src}
            poster={selectedVideo.poster}
            controls
            autoPlay
            className="max-w-full max-h-[90vh] rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default memo(OurVideosSection);
