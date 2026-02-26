"use client";
import * as React from "react";
import { useState } from "react";

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "918874882735";
  const defaultMessage = "Hello! I'm interested in your services.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  const [showMobileTooltip, setShowMobileTooltip] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768) {
      e.preventDefault(); 
      setShowMobileTooltip(true);

  
      setTimeout(() => {
        window.open(whatsappLink, "_blank");
      }, 300);

    
      setTimeout(() => {
        setShowMobileTooltip(false);
      }, 3000);
    }
  
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Jaikvik Technology on WhatsApp"
        className="fixed bottom-6 right-6 z-[9999] group"
        onClick={handleClick} 
      >
        <div className="relative">
          
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></span>

        
          <div className="relative w-14 h-14 md:w-12 md:h-12 bg-[#25D366] mb-8 rounded-full flex items-center justify-center shadow-2xl hover:bg-[#25D366] transform hover:scale-110 transition-all duration-300">
            <i className="fa-brands fa-whatsapp text-white text-3xl md:text-3xl"></i>
          </div>

      
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block">
            Chat on WhatsApp
            <span className="absolute right-[-8px] top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-800"></span>
          </span>
        </div>
      </a>

    
      {showMobileTooltip && (
        <div className="fixed bottom-24 right-6 md:hidden bg-gray-800 text-white text-xs px-4 py-2 rounded-lg opacity-95 shadow-lg animate-fade-in">
          Tap to chat on WhatsApp
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;