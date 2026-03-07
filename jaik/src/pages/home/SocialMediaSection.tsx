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

  // ── Track video progress via rAF ──
  const startProgressTracking = useCallback((vid: HTMLVideoElement) => {
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    setProgress(0);

    const tick = () => {
      if (!vid || vid.paused || vid.ended) return;
      const pct = vid.duration ? (vid.currentTime / vid.duration) * 100 : 0;
      setProgress(pct);
      progressRafRef.current = requestAnimationFrame(tick);
    };
    progressRafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── When video ends → go to next slide ──
  const handleVideoEnded = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      swiperRef.current?.slideNext();
    }, 200);
  }, []);

  // ── Mobile: play active video, pause others ──
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth > 768) return;

    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === activeIndex) {
        vid.muted = true;
        vid.onended = handleVideoEnded;
        vid.play().then(() => startProgressTracking(vid)).catch(() => {});
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

  // ── Fix: removed requestAnimationFrame wrapper, use Autoplay module directly ──
  const handleVideoHover = (value: boolean) => {
    if (!desktopSwiperRef.current) return;
    setIsAutoplayPaused(value);

    if (value) {
      desktopSwiperRef.current.autoplay.stop();
    } else {
      setTimeout(() => {
        if (desktopSwiperRef.current && !isAutoplayPaused) {
          desktopSwiperRef.current.autoplay.start();
        }
      }, 100);
    }
  };

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    setProgress(0);
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
  }, []);

  if (loading)
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="flex gap-1.5 items-end">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-1 bg-white/60 rounded-full animate-bounce"
              style={{ height: `${12 + i * 4}px`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="overflow-hidden h-auto my-4">
      {/* Heading */}
      <div className="websiteHeading mb-6">
        <h2 className="uppercase text-gray-200 text-xl inline-block relative">
          <span className="flex font-bold items-center gap-1.5 ml-2">
            Social Media Reels
          </span>
        </h2>
      </div>

      {/* ─── MOBILE SLIDER (< lg) ─── */}
      <div className="block lg:hidden">
        <div className="relative px-6" style={{ paddingBottom: "28px" }}>

          {/* Skeleton stack behind active card */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 bottom-0 w-[78%] rounded-2xl pointer-events-none"
            style={{
              transform: "translateX(-50%) translateY(0px) scale(0.93)",
              zIndex: 1,
              height: "36px",
              background: "linear-gradient(180deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 bottom-0 w-[86%] rounded-2xl pointer-events-none"
            style={{
              transform: "translateX(-50%) translateY(-14px) scale(0.96)",
              zIndex: 2,
              height: "36px",
              background: "linear-gradient(180deg,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0.05) 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 bottom-0 w-[94%] rounded-2xl pointer-events-none"
            style={{
              transform: "translateX(-50%) translateY(-26px) scale(0.985)",
              zIndex: 3,
              height: "36px",
              background: "linear-gradient(180deg,rgba(255,255,255,0.13) 0%,rgba(255,255,255,0.07) 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Main Swiper */}
          <div className="relative" style={{ zIndex: 10 }}>
            <Swiper
              modules={[Navigation]}
              spaceBetween={14}
              breakpoints={{
                320: { slidesPerView: 1.08 },
                480: { slidesPerView: 1.4 },
                640: { slidesPerView: 1.9 },
              }}
              centeredSlides={true}
              loop={reelsData.length > 2}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
              speed={600}
              className="mySwiper"
            >
              {reelsData.map((reel, index) => (
                <SwiperSlide key={reel._id || index}>
                  {({ isActive }) => (
                    <div
                      className={`
                        relative rounded-2xl overflow-hidden
                        transition-all duration-500 ease-out
                        ${isActive ? "scale-100 opacity-100" : "scale-[0.88] opacity-40"}
                      `}
                      style={{
                        boxShadow: isActive
                          ? "0 0 0 1px rgba(255,255,255,0.18), 0 24px 60px rgba(0,0,0,0.85)"
                          : "none",
                      }}
                    >
                      {/* Shimmer line top */}
                      {isActive && (
                        <div
                          className="absolute top-0 left-0 right-0 h-[2px] z-30 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                          }}
                        />
                      )}

                      {/* Dim overlay inactive */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-black/55 z-10 rounded-2xl pointer-events-none" />
                      )}

                      {/* Video */}
                      <video
                        ref={(el) => { videoRefs.current[index] = el; }}
                        src={reel.video}
                        poster={reel.poster}
                        muted
                        playsInline
                        preload="metadata"
                        disablePictureInPicture
                        className="w-full h-full object-cover pointer-events-none select-none"
                        style={{ WebkitUserSelect: "none" }}
                      />

                      {/* Top gradient */}
                      {isActive && (
                        <div
                          className="absolute top-0 left-0 right-0 h-14 z-20 pointer-events-none rounded-t-2xl"
                          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)" }}
                        />
                      )}

                      {/* Bottom bar + progress */}
                      {isActive && (
                        <div
                          className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3 pt-10 rounded-b-2xl"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                          }}
                        >
                          {/* Video progress bar */}
                          <div className="w-full h-[3px] rounded-full mb-2.5 overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.15)" }}
                          >
                            <div
                              className="h-full rounded-full transition-none"
                              style={{
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
                                boxShadow: "0 0 6px rgba(255,255,255,0.5)",
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                              </span>
                              <span className="text-white/80 text-[10px] font-bold tracking-[0.15em] uppercase">
                                Playing
                              </span>
                            </div>
                            <div
                              className="flex items-center gap-1 rounded-full px-2.5 py-1"
                              style={{
                                background: "rgba(255,255,255,0.10)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              <svg className="w-3 h-3 fill-white/60" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              <span className="text-white/60 text-[10px]">Reel</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Pill progress dots */}
        <div className="flex justify-center items-center gap-2 mt-5">
          {reelsData.slice(0, 7).map((_, i) => {
            const isAct = i === activeIndex % reelsData.length;
            return (
              <button
                key={i}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: isAct ? "28px" : "6px",
                  height: "6px",
                  background: isAct ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)",
                  boxShadow: isAct ? "0 0 8px rgba(255,255,255,0.8)" : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ─── DESKTOP SLIDER (lg+) ─── */}
      <div className="hidden lg:block">
        <div className="w-full group relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={10}
            slidesPerView={4.5}
            breakpoints={{
              1024: { slidesPerView: 4, spaceBetween: 10 },
              1280: { slidesPerView: 4.5, spaceBetween: 10 },
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            loop={reelsData.length > 4}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            onSwiper={(swiper) => (desktopSwiperRef.current = swiper)}
            speed={500}
            className="mySwiper !overflow-visible"
          >
            {reelsData.map((reel, index) => (
              <SwiperSlide key={reel._id || index}>
                <ReelVideoCard
                  src={reel.video}
                  poster={reel.poster}
                  onHover={handleVideoHover}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <ArrowLeft onClick={() => desktopSwiperRef.current?.slidePrev()} />
          <ArrowRight onClick={() => desktopSwiperRef.current?.slideNext()} />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;