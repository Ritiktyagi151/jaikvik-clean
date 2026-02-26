"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import { X, ArrowLeft as BackIcon } from "lucide-react";
import { cachedGet } from "@/lib/clientApiCache";
import ArrowLeft from "../../components/arrows/ArrowLeft";
import ArrowRight from "../../components/arrows/ArrowRight";
import ReelVideoCard from "../../components/cards/ReelVideoCard";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || ""}/testimonial-videos`;

const OurTestimonials = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{
    video: string;
    poster: string;
  } | null>(null);

  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await cachedGet(API_URL);
        
        // ✅ Blog Logic: response.data.data
        // ✅ Direct Array Logic: response.data
        const actualData = response.data.data || response.data;
        
        if (Array.isArray(actualData)) {
          setTestimonialsList(actualData);
        } else {
          console.error("Data is not an array:", actualData);
        }
      } catch (error) {
        console.error("Testimonials fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleVideoHover = (value: boolean) => {
    if (swiperRef.current) {
      if (value) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
    }
  };

  // Skip rendering if no data or loading
  if (loading) {
    return <div className="h-40 flex items-center justify-center text-white animate-pulse">Fetching Testimonials...</div>;
  }

  // Agar list khali hai toh section hide kardein
  if (testimonialsList.length === 0) return null;

  return (
    <div className="overflow-hidden h-auto my-4 ">
      <div className="websiteHeading mb-4">
        <h2 className="uppercase text-gray-200 text-xl inline-block relative">
          <span className="flex font-bold items-center gap-1.5 ml-2">
            Our Testimonials
          </span>
        </h2>
      </div>

      <div className="w-full group relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1.1, spaceBetween: 12 },
            480: { slidesPerView: 1.2, spaceBetween: 12 },
            640: { slidesPerView: 1.2, spaceBetween: 14 },
            768: { slidesPerView: 2, spaceBetween: 14 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
            1280: { slidesPerView: 3, spaceBetween: 16 },
            1536: { slidesPerView: 4, spaceBetween: 18 },
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          loop={testimonialsList.length > 3}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          speed={600}
          className="mySwiper !overflow-visible"
        >
          {testimonialsList.map((item, index) => (
            <SwiperSlide
              key={item._id || index}
              className="hover:z-50 transition-transform duration-200"
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
                  src={item.video}
                  poster={item.poster}
                  onHover={handleVideoHover}
                  aspectRatio="16/9"
                  scale="hover:scale-[1.15]"
                  classname="transition-all duration-300 ease-in-out hover:shadow-lg"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <ArrowLeft onClick={() => swiperRef.current?.slidePrev()} />
        <ArrowRight onClick={() => swiperRef.current?.slideNext()} />
      </div>

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
            src={selectedVideo.video}
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

export default OurTestimonials;
