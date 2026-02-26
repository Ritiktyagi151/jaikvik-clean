"use client";

import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import NavLayerTop from "./NavLayerTop";
import NavLayerBottom from "./NavLayerBottom";
import {
  digitalMarketingItems,
  filmProductionItems,
  seoServiceItems,
  softwareDevelopmentItems,
  websiteDevelopmentItems,
} from "../../configs/navConfigs";
import Link from "next/link";

const Navbar: React.FC = () => {
  // State for popups and off-canvas menu
  // const [isTranslatePopupOpen, setIsTranslatePopupOpen] = useState(false);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  // const [isSticky, setIsSticky] = useState(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);

  const [expandedMenus, setExpandedMenus] = useState<{
    [key: string]: boolean;
  }>({});

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      const windowTop = window.scrollY;
      const threshold = window.innerWidth < 768 ? 0 : 250;

      setIsSticky(windowTop > threshold);
    };

    window.addEventListener("scroll", handleScroll);

    // Trigger once on mount in case user is already scrolled
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close off-canvas when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOffCanvasOpen) {
        setIsOffCanvasOpen(false);
        document.body.classList.remove("overflow-hidden");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOffCanvasOpen]);

  const toggleOffCanvas = () => {
    setIsOffCanvasOpen(!isOffCanvasOpen);
    document.body.classList.toggle("overflow-hidden");
  };
  const toggleSubmenu = (menuKey: string) => {
    if (menuKey === "services") {
      setExpandedMenus((prev) => ({
        services: !prev.services,
        software: false,
        website: false,
        digital: false,
        seo: false,
        film: false,
      }));
    } else {
      setExpandedMenus((prev) => ({
        ...prev,
        software: menuKey === "software" ? !prev.software : false,
        website: menuKey === "website" ? !prev.website : false,
        digital: menuKey === "digital" ? !prev.digital : false,
        seo: menuKey === "seo" ? !prev.seo : false,
        film: menuKey === "film" ? !prev.film : false,
      }));
    }
  };

  return (
    <>
      <style>
        {`
    @keyframes rgbBorder {
      0% { border-color: #ff0000; }
      33% { border-color: #00ff00; }
      66% { border-color: #0000ff; }
      100% { border-color: #ff0000; }
    }

    @keyframes slideIn {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes slideInRight {
      from { transform: translateX(50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideInLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes sticky {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(0); }
    }

    .menu-expand::before,
    .menu-expand::after {
      position: absolute;
      top: calc(50% - 1px);
      left: calc(50% - 7px);
      width: 14px;
      height: 2px;
      content: "";
      transition: all 0.5s ease;
      transform: scale(0.75);
      background-color: white;
    }

    .menu-expand::after {
      transform: rotate(90deg) scale(0.75);
    }

    .menu-expand.active::after {
      transform: rotate(0) scale(0.75);
    }

    .offcanvas-close::after,
    .offcanvas-close::before {
      position: absolute;
      top: calc(50% - 1px);
      left: 50%;
      margin-left: -10px;
      width: 20px;
      height: 2px;
      content: "";
      transition: all 0.5s ease;
      background-color: #fff;
    }

    .offcanvas-close::before {
      transform: rotate(45deg);
    }

    .offcanvas-close::after {
      transform: rotate(-45deg);
    }

    .offcanvas-close:hover::before {
      transform: rotate(180deg);
    }

    .offcanvas-close:hover::after {
      transform: rotate(0deg);
    }

    .quote-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 2px solid transparent;
      border-radius: 5px;
      animation: rgbBorder 3s linear infinite;
      z-index: 0;
    }

    .customScroll {
      scrollbar-width: thin;
      scrollbar-color: #ef4444 #1f2937;
    }

    .customScroll::-webkit-scrollbar {
      width: 6px;
    }

    .customScroll::-webkit-scrollbar-track {
      background: #1f2937;
    }

    .customScroll::-webkit-scrollbar-thumb {
      background: #ef4444;
      border-radius: 3px;
    }

    .sub-menu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }

    .sub-menu.expanded {
      max-height: 500px;
      transition: max-height 0.3s ease-in;
    }

    .menu-item-with-arrow {
      position: relative;
    }

    .menu-arrow {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      transition: transform 0.3s ease;
    }

    .menu-arrow.expanded {
      transform: translateY(-50%) rotate(180deg);
    }

    .mobile-sticky-header {
      position: sticky;
      top: 0;
      z-index: 990;
      transition: all 0.3s ease;
      animation: ${isSticky ? "sticky 0.3s ease" : "none"};
      box-shadow: ${isSticky ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none"};
      background: ${isSticky ? "rgba(0, 0, 0, 0.95)" : "black"};
      backdrop-filter: ${isSticky ? "blur(10px)" : "none"};
    }

    @media (max-width: 768px) {
      .offcanvas {
        width: 280px !important;
      }
      
      .translate-popup {
        right: 10px !important;
        top: 60px !important;
        width: calc(100vw - 20px) !important;
        max-width: 280px !important;
      }
    }

    @media (max-width: 480px) {
      .offcanvas {
        width: 100vw !important;
      }
      
      .translate-popup {
        right: 5px !important;
        top: 50px !important;
        width: calc(100vw - 10px) !important;
        max-width: none !important;
      }
    }
  `}
      </style>

      {/* Topbar */}
      <div className="hidden md:block">
        <NavLayerTop />
      </div>

      {/* Mobile Header - Sticky */}
      <div className={`block md:hidden mobile-sticky-header`}>
        <div className="flex justify-between items-center py-2 px-4">
          <Link href="/" className="w-24 h-8">
            <img
              src="https://jaikvik.in/lab/cloud/jaikvik/assets/images/banner/logo-1.webp"
              alt="logo"
              className="h-full object-contain"
            />
          </Link>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleOffCanvas}
              className="text-white hover:text-red-500 transition-colors p-1"
              aria-label="Open menu"
            >
              <IoMenu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavLayerBottom isSticky={isSticky} />
      </div>

      {/* OffCanvas Overlay */}
      <div
        className={`offcanvas-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] ${
          isOffCanvasOpen ? "block" : "hidden"
        } transition-opacity duration-300`}
        onClick={toggleOffCanvas}
      ></div>

      {/* OffCanvas Menu */}
      <div
        id="offcanvas-mobile-menu"
        className={`offcanvas offcanvas-mobile-menu fixed top-0 left-0 w-[350px] sm:w-[320px] md:w-[350px] h-full bg-gradient-to-b from-gray-900 to-black text-white transform ${
          isOffCanvasOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 z-[1000] shadow-2xl overflow-y-auto customScroll`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-red-500">Menu</h2>
          <button
            className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            onClick={toggleOffCanvas}
            aria-label="Close menu"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="inner customScroll flex flex-col">
          <div className="offcanvas-menu flex-1 p-4">
            <ul className="list-none m-0 p-0 space-y-1">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-3 text-white text-base font-medium rounded-lg border-b border-gray-700/50 hover:bg-gray-800 hover:text-red-400 transition-all duration-200"
                  onClick={toggleOffCanvas}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="block px-4 py-3 text-white text-base font-medium rounded-lg border-b border-gray-700/50 hover:bg-gray-800 hover:text-red-400 transition-all duration-200"
                  onClick={toggleOffCanvas}
                >
                  About Us
                </Link>
              </li>

              {/* Services Menu */}
              <li>
                <button
                  onClick={() => toggleSubmenu("services")}
                  className="menu-item-with-arrow w-full text-left px-4 py-3 text-white text-base font-medium rounded-lg border-b border-gray-700/50 hover:bg-gray-800 hover:text-red-400 transition-all duration-200"
                >
                  Services
                  <FaChevronDown
                    className={`menu-arrow ${
                      expandedMenus.services ? "expanded" : ""
                    }`}
                    size={12}
                  />
                </button>

                <div
                  className={`sub-menu pl-4 ${
                    expandedMenus.services ? "expanded" : ""
                  } customScroll`}
                  style={{
                    maxHeight: expandedMenus.services ? "300px" : "0",
                    overflowY: "auto",
                  }}
                >
                  <ul>
                    {/* Software Development */}
                    <li>
                      <button
                        onClick={() => toggleSubmenu("software")}
                        className="menu-item-with-arrow w-full text-left px-4 py-2 text-gray-300 text-sm font-medium bg-gray-800/50 rounded-lg my-1 hover:bg-gray-700 hover:text-white transition-all duration-200"
                      >
                        Software Development
                        <FaChevronDown
                          className={`menu-arrow ${
                            expandedMenus.software ? "expanded" : ""
                          }`}
                          size={10}
                        />
                      </button>
                      <ul
                        className={`sub-menu pl-4 ${
                          expandedMenus.software ? "expanded" : ""
                        }`}
                      >
                        {softwareDevelopmentItems?.map((item, index) => (
                          <li key={index} className="my-1">
                            <Link
                              href={item.href}
                              className="block bg-gray-900/70 rounded-lg p-3 hover:bg-gray-800 transition-all duration-200"
                              onClick={toggleOffCanvas}
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.img}
                                  alt={item.text}
                                  className="w-12 h-12 rounded-md object-cover"
                                />
                                <span className="text-gray-200 text-sm font-medium">
                                  {item.text}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>

                    {/* Website Development */}
                    <li>
                      <button
                        onClick={() => toggleSubmenu("website")}
                        className="menu-item-with-arrow w-full text-left px-4 py-2 text-gray-300 text-sm font-medium bg-gray-800/50 rounded-lg my-1 hover:bg-gray-700 hover:text-white transition-all duration-200"
                      >
                        Website Development
                        <FaChevronDown
                          className={`menu-arrow ${
                            expandedMenus.website ? "expanded" : ""
                          }`}
                          size={10}
                        />
                      </button>
                      <ul
                        className={`sub-menu pl-4 ${
                          expandedMenus.website ? "expanded" : ""
                        }`}
                      >
                        {websiteDevelopmentItems?.map((item, index) => (
                          <li key={index} className="my-1">
                            <Link
                              href={item.href}
                              className="block bg-gray-900/70 rounded-lg p-3 grid grid-cols-5 hover:bg-gray-800 transition-all duration-200"
                              onClick={toggleOffCanvas}
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.img}
                                  alt={item.text}
                                  className="w-12 h-12 rounded-md object-cover"
                                />
                                <span className="text-gray-200 text-sm font-medium">
                                  {item.text}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>

                    {/* Digital Marketing */}
                    <li>
                      <button
                        onClick={() => toggleSubmenu("digital")}
                        className="menu-item-with-arrow w-full text-left px-4 py-2 text-gray-300 text-sm font-medium bg-gray-800/50 rounded-lg my-1 hover:bg-gray-700 hover:text-white transition-all duration-200"
                      >
                        Digital Marketing
                        <FaChevronDown
                          className={`menu-arrow ${
                            expandedMenus.digital ? "expanded" : ""
                          }`}
                          size={10}
                        />
                      </button>
                      <ul
                        className={`sub-menu ${
                          expandedMenus.digital ? "expanded" : ""
                        } pl-4`}
                      >
                        {digitalMarketingItems?.map((item, index) => (
                          <li key={index} className="my-1">
                            <Link
                              href={item.href}
                              className="block bg-gray-900/70 rounded-lg p-3 hover:bg-gray-800 transition-all duration-200"
                              onClick={toggleOffCanvas}
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.img}
                                  alt={item.text}
                                  className="w-12 h-12 rounded-md object-cover"
                                />
                                <span className="text-gray-200 text-sm font-medium">
                                  {item.text}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>

                    {/* SEO Services */}
                    <li>
                      <button
                        onClick={() => toggleSubmenu("seo")}
                        className="menu-item-with-arrow w-full text-left px-4 py-2 text-gray-300 text-sm font-medium bg-gray-800/50 rounded-lg my-1 hover:bg-gray-700 hover:text-white transition-all duration-200"
                      >
                        Google SEO Services
                        <FaChevronDown
                          className={`menu-arrow ${
                            expandedMenus.seo ? "expanded" : ""
                          }`}
                          size={10}
                        />
                      </button>
                      <ul
                        className={`sub-menu pl-4 ${
                          expandedMenus.seo ? "expanded" : ""
                        }`}
                      >
                        {seoServiceItems?.map((item, index) => (
                          <li key={index} className="my-1">
                            <Link
                              href={item.href}
                              className="block bg-gray-900/70 rounded-lg p-3 hover:bg-gray-800 transition-all duration-200"
                              onClick={toggleOffCanvas}
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.img}
                                  alt={item.text}
                                  className="w-12 h-12 rounded-md object-cover"
                                />
                                <span className="text-gray-200 text-sm font-medium">
                                  {item.text}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>

                    {/* Film Production */}
                    <li>
                      <button
                        onClick={() => toggleSubmenu("film")}
                        className="menu-item-with-arrow w-full text-left px-4 py-2 text-gray-300 text-sm font-medium bg-gray-800/50 rounded-lg my-1 hover-bg-gray-700 hover:text-white transition-all duration-200"
                      >
                        Film Production
                        <FaChevronDown
                          className={`menu-arrow ${
                            expandedMenus.film ? "expanded" : ""
                          }`}
                          size={10}
                        />
                      </button>
                      <ul
                        className={`sub-menu pl-4 ${
                          expandedMenus.film ? "expanded" : ""
                        }`}
                      >
                        {filmProductionItems?.map((item, index) => (
                          <li key={index} className="my-1">
                            <Link
                              href={item.href}
                              className="block bg-gray-900/70 rounded-lg p-3 hover:bg-gray-800 transition-all duration-200"
                              onClick={toggleOffCanvas}
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.img}
                                  alt={item.text}
                                  className="w-12 h-12 rounded-md object-cover"
                                />
                                <span className="text-gray-200 text-sm font-medium">
                                  {item.text}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>

              {/* Our Blogs */}
              <li>
                <Link
                  href="/blogs"
                  className="block px-4 py-3 text-white text-base font-medium rounded-lg border-b border-gray-700/50 hover:bg-gray-800 hover:text-red-400 transition-all duration-200"
                  onClick={toggleOffCanvas}
                >
                  Our Blogs
                </Link>
              </li>

              {/* Contact */}
              <li>
                <Link
                  href="/contact-us"
                  className="block px-4 py-3 text-white text-base font-medium rounded-lg border-b border-gray-700/50 hover:bg-gray-800 hover:text-red-400 transition-all duration-200"
                  onClick={toggleOffCanvas}
                >
                  Contact
                </Link>
              </li>

              {/* Career */}
              <li>
                <Link
                  href="/career"
                  className="block px-4 py-3 text-white text-base font-medium rounded-lg border-b border-gray-700/50 hover:bg-gray-800 hover:text-red-400 transition-all duration-200"
                  onClick={toggleOffCanvas}
                >
                  Career
                </Link>
              </li>

              {/* Admin */}
              <li>
                <Link
                  href="/admin"
                  className="block px-4 py-3 text-white text-base font-medium rounded-lg border-b border-gray-700/50 hover:bg-gray-800 hover:text-red-400 transition-all duration-200"
                  onClick={toggleOffCanvas}
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <div className="offcanvas-social p-4 border-t border-gray-700">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 text-center">
                Follow Us
              </h3>
              <ul className="flex space-x-3 justify-center">
                <li>
                  <Link
                    href="https://facebook.com"
                    className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebookF size={16} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://twitter.com"
                    className="bg-blue-400 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-500 hover:scale-110 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter size={16} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://instagram.com"
                    className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-600 hover:scale-110 transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram size={16} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
