"use client";

import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="overflow-hidden w-full px-0 lg:px-2.5">
      <div className="flex flex-wrap w-full justify-center">

        {/* LEFT IMAGES - Priority Loading */}
        <div className="hidden lg:block w-full lg:w-1/4 px-4">
          <div className="flex justify-center items-center relative h-full">
            <img
              src="https://jaikvik.in/lab/cloud/jaikvik/assets/images/banner/new-cricle-image.webp"
              className="w-full animate-[spin_15s_linear_infinite]"
              loading="lazy"
              fetchPriority="low"
              alt="Circle Decor"
            />
            <img
              src="https://jaikvik.in/lab/cloud/jaikvik/assets/images/banner/rotate-3.webp"
              className="absolute w-[900px] mr-7 max-w-none"
              loading="lazy"
              fetchPriority="low"
              alt="Rotate Decor"
            />
          </div>
        </div>

        {/* VIDEO - High Priority */}
        <div className="w-full lg:w-3/4 px-0 lg:px-4 mt-3 lg:mt-0">
          <div className="w-full relative group">
            <video
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
              className="w-full h-auto cursor-pointer lg:rounded-lg lg:shadow-lg transition-transform duration-300 group-hover:scale-[1.01]"
            >
              {/* Mobile video (max-width: 768px) */}
              <source
                src="https://jaikvik.in/lab/cloud/jaikvik/assets/images/jaikvik.commobile-view.mp4"
                type="video/mp4"
                media="(max-width: 768px)"
              />
              {/* Desktop video (min-width: 769px) */}
              <source
                src="https://jaikvik.in/lab/cloud/jaikvik/assets/images/video/jaikvik-corporate-film1.mp4"
                type="video/mp4"
                media="(min-width: 769px)"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
