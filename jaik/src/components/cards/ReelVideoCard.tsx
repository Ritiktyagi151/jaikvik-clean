"use client";

import { useMemo, useRef } from "react";

const ReelVideoCard: React.FC<{
  src: string;
  onHover: (value: boolean) => void;
  aspectRatio?: string;
  scale?: string;
  poster?: string;
  classname?: string;
}> = ({
  src = "",
  onHover,
  aspectRatio = "9/16",
  scale = "hover:scale-110",
  poster = "https://img.freepik.com/free-vector/silhouette-crowd-people-with-flags-banners-manifestation_23-2148009667.jpg?uid=R186472209&ga=GA1.1.455755995.1738954286&semt=ais_hybrid&w=740",
  classname = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const normalizedAspectRatio = useMemo(() => {
    const [width, height] = aspectRatio.split("/").map(Number);
    if (!width || !height) return "9 / 16";
    return `${width} / ${height}`;
  }, [aspectRatio]);

  const handleVideoClick = () => {
    const isMobileViewport =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;

    if (isMobileViewport && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.muted = false;
        videoRef.current
          .play()
          .catch(() => {
            videoRef.current!.controls = true;
            videoRef.current!.muted = true;
          });
      } else {
        videoRef.current.pause();
        videoRef.current.controls = false;
        videoRef.current.muted = true;
      }
    }
  };

  const handleMouseEnter = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = false;
        await videoRef.current.play();
      } catch {
        videoRef.current.controls = true;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }
    }
    onHover(true);
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.controls = false;
      videoRef.current.muted = true;
    }
    onHover(false);
  };

  return (
    <div
      className={`hover:-translate-y-5 hover:z-[1000] transition-all rounded-md overflow-hidden duration-300 relative w-full ${scale} ${classname}`}
      style={{ aspectRatio: normalizedAspectRatio }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        muted
        controls={false}
        poster={poster}
        loop
        preload="metadata"
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-1 z-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default ReelVideoCard;
