import React from "react";
import HeroSection from "./HeroSection";
import WebsiteSection from "./WebsiteSection";
import SocialMediaSection from "./SocialMediaSection";
import OurTechnologies from "./OurTechnologies";
import MobileAppSection from "./MobileAppSection";
import HomeDeferredSections from "./HomeDeferredSections";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <HeroSection />
      <div className="section-spacer" />

      <WebsiteSection />
      <OurTechnologies />
      <SocialMediaSection />
      <MobileAppSection />

      <HomeDeferredSections />
    </div>
  );
};

export default Home;
