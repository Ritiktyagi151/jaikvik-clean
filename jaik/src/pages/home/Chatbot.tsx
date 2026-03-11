



  "use client";
import * as React from "react";
import { useState } from "react";

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "918874882735";
  const emailAddress = "info@jaikviktechnology.com";
  const defaultMessage = "Hello! I'm interested in your services.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
  const phoneLink = `tel:+${phoneNumber}`;
  const mailLink = `mailto:${emailAddress}`;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      setShowMobileTooltip(true);
      setTimeout(() => window.open(whatsappLink, "_blank"), 300);
      setTimeout(() => setShowMobileTooltip(false), 3000);
    }
  };

  return (
    <>
      {/* ───────────── DESKTOP: always-visible stack ───────────── */}
      <div className="hidden md:flex flex-col items-center gap-3 fixed bottom-6 right-6 z-[9999]">
        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative"
        >
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></span>
          <div className="relative w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300">
            <i className="fa-brands fa-whatsapp text-white text-2xl"></i>
          </div>
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat on WhatsApp
            <span className="absolute right-[-8px] top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-800"></span>
          </span>
        </a>

        {/* Phone */}
        <a
          href={phoneLink}
          aria-label="Call us"
          className="group relative"
        >
          <div className="w-12 h-12 bg-[#4F46E5] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300">
            <i className="fa-solid fa-phone text-white text-xl"></i>
          </div>
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Call Us
            <span className="absolute right-[-8px] top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-800"></span>
          </span>
        </a>

        {/* Email */}
        <a
          href={mailLink}
          aria-label="Email us"
          className="group relative"
        >
          <div className="w-12 h-12 bg-[#EA4335] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300">
            <i className="fa-solid fa-envelope text-white text-xl"></i>
          </div>
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Email Us
            <span className="absolute right-[-8px] top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-800"></span>
          </span>
        </a>
      </div>

      {/* ───────────── MOBILE: toggle expand/collapse ───────────── */}
      <div className="md:hidden fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-3">
        {/* Expandable icons — shown only when mobileOpen */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-300 origin-bottom ${
            mobileOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-75 pointer-events-none"
          }`}
        >
          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            onClick={handleWhatsAppClick}
          >
            <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <div className="relative w-13 h-13 w-[52px] h-[52px] bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl">
              <i className="fa-brands fa-whatsapp text-white text-2xl"></i>
            </div>
          </a>

          {/* Phone */}
          <a href={phoneLink} aria-label="Call us">
            <div className="w-[52px] h-[52px] bg-[#4F46E5] rounded-full flex items-center justify-center shadow-2xl">
              <i className="fa-solid fa-phone text-white text-xl"></i>
            </div>
          </a>

          {/* Email */}
          <a href={mailLink} aria-label="Email us">
            <div className="w-[52px] h-[52px] bg-[#EA4335] rounded-full flex items-center justify-center shadow-2xl">
              <i className="fa-solid fa-envelope text-white text-xl"></i>
            </div>
          </a>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close contact options" : "Open contact options"}
          className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:bg-gray-700 focus:outline-none"
        >
          <i
            className={`fa-solid text-white text-xl transition-transform duration-300 ${
              mobileOpen ? "fa-xmark rotate-90" : "fa-headset"
            }`}
          ></i>
        </button>
      </div>

      {/* Mobile WhatsApp toast */}
      {showMobileTooltip && (
        <div className="fixed bottom-24 right-6 md:hidden bg-gray-800 text-white text-xs px-4 py-2 rounded-lg opacity-95 shadow-lg animate-fade-in z-[9999]">
          Tap to chat on WhatsApp
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;