import React from "react";
import HeroSection from "./HeroSection";
import HomeDeferredSections from "./HomeDeferredSections";
import HomeScrollStabilizer from "@/components/performance/HomeScrollStabilizer";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <HomeScrollStabilizer />
      <HeroSection />
      <div className="section-spacer" />

      <HomeDeferredSections />
    </div>
  );
};

export default Home;
