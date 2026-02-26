"use client";

import dynamic from "next/dynamic";
import LazySection from "@/components/performance/LazySection";

const SocialMediaPostSection = dynamic(() => import("./SocialMediaPostSection"));
const OurVideosSection = dynamic(() => import("./OurVideosSection"));
const GalleryImages = dynamic(() => import("./GalleryImages"));
const CorporateVideosSection = dynamic(() => import("./CorporateVideosSection"));
const OurTestimonials = dynamic(() => import("./OurTestimonials"));
const BlogsSection = dynamic(() => import("./BlogsSection"));
const OurServices = dynamic(() => import("./OurSerives"));
const TeamVideoSlider = dynamic(() => import("./TeamVideoSlider"));
const ReviewsSection = dynamic(() => import("./ReviewsSection"));
const OurClients = dynamic(() => import("./OurClients"));
const EnquireSection = dynamic(() => import("./EnquireSection"));

const HomeDeferredSections = () => {
  return (
    <>
      <LazySection minHeight={180}>
        <SocialMediaPostSection />
      </LazySection>
      <LazySection minHeight={220}>
        <OurVideosSection />
      </LazySection>
      <LazySection minHeight={220}>
        <GalleryImages />
      </LazySection>
      <LazySection minHeight={320}>
        <CorporateVideosSection />
      </LazySection>
      <LazySection minHeight={220}>
        <OurTestimonials />
      </LazySection>
      <LazySection minHeight={240}>
        <BlogsSection />
      </LazySection>
      <LazySection minHeight={220}>
        <OurServices />
      </LazySection>
      <LazySection minHeight={220}>
        <TeamVideoSlider />
      </LazySection>
      <LazySection minHeight={220}>
        <ReviewsSection />
      </LazySection>
      <LazySection minHeight={140}>
        <OurClients />
      </LazySection>
      <LazySection minHeight={220}>
        <EnquireSection />
      </LazySection>
    </>
  );
};

export default HomeDeferredSections;
