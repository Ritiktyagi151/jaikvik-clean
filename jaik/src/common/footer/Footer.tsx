"use client";
import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaEnvelopeOpenText,
  FaPhone,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const API_URL = `${API_BASE}/footer`;

const DESKTOP_USEFUL_LINKS = [
  { text: "About Us", url: "/about" },
  { text: "Portfolio", url: "/portfolio" },
  { text: "Our Blogs", url: "/blogs" },
  { text: "Career", url: "/careers" },
  { text: "Privacy Policy", url: "/privacy-policy" },
  { text: "Contact Us", url: "/contact-us" },
  {
    text: "Brochure",
    url: "https://jaikvik.in/lab/cloud/jaikvik/assets/images/Company-Profile-Jaikvik-Technology-India-Pvt-Ltd.pdf",
    isExternal: true,
  },
];

const DESKTOP_SERVICES_LINKS = [
  { text: "Digital Marketing", url: "/digital-marketing-agency" },
  { text: "Software Development", url: "/cusotmized-software" },
  { text: "Film Making", url: "/film-production" },
  { text: "SEO (Search Engine Optimization)", url: "/seo-services" },
  { text: "E-Commerce", url: "/website-development" },
  { text: "Website Development", url: "/website-development" },
];

const Footer = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await axios.get(API_URL);
        setData(res.data?.data || res.data);
      } catch (err) {
        console.error("Footer load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("facebook")) return <FaFacebookF />;
    if (p.includes("instagram")) return <FaInstagram />;
    if (p.includes("twitter") || p.includes("x")) return <FaXTwitter />;
    if (p.includes("youtube")) return <FaYoutube />;
    if (p.includes("linkedin")) return <FaLinkedinIn />;
    return <FaGlobe />;
  };

  if (loading || !data) return null;

  return (
    <footer className="bg-main-primary pt-12 px-4 md:px-12 lg:pt-12 lg:px-[28px]">

      {/* ── MOBILE LAYOUT (< md) ── */}
      <div className="block md:hidden space-y-8">

        {/* Row 1: Description & Socials — full width */}
        <div>
          <div className="flex gap-6 mb-4">
            {Object.entries(data.socials || {}).map(([platform, url]: any) =>
              url && (
                <Link key={platform} href={url} target="_blank" rel="noopener noreferrer">
                  <span className="text-white text-xl hover:text-main-red transition-all">
                    {getSocialIcon(platform)}
                  </span>
                </Link>
              )
            )}
          </div>
          <p className="text-main-gray text-[16px]">
            {data.description}
            <Link href="/about" className="text-main-red hover:underline ml-1">
              More...
            </Link>
          </p>
        </div>

        {/* Row 2: Useful Links + Our Services — side by side */}
        <div className="grid grid-cols-2 gap-6">
          {/* Useful Links */}
          <div>
            <h3 className="text-lg text-gray-200 mb-2 font-bold">
              Useful Links
            </h3>
            <ul className="list-none p-0 m-0 text-[15px]">
              {DESKTOP_USEFUL_LINKS.map((item) => (
                <li key={item.text} className="mt-2">
                  {item.isExternal ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-main-gray hover:underline cursor-pointer"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <Link href={item.url} className="text-main-gray hover:underline">
                      {item.text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-lg text-gray-200 mb-2 font-bold">
              Our Services
            </h3>
            <ul className="list-none p-0 m-0 text-[15px]">
              {DESKTOP_SERVICES_LINKS.map((item) => (
                <li key={item.text} className="mt-2">
                  <Link href={item.url} className="text-main-gray hover:underline">
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 3: Get In Touch — full width */}
        <div>
          <h3 className="text-lg text-gray-200 mb-2 font-bold">
            Get In Touch
          </h3>
          <ul className="list-none p-0 m-0">
            {data.contacts?.offices?.map((off: any, i: number) => (
              <li key={i} className="flex items-start gap-2 mt-2">
                <FaMapMarkerAlt className="text-main-red shrink-0 mt-1" />
                <p className="text-main-gray text-[16px]">{off.address}</p>
              </li>
            ))}
            <li className="flex items-center gap-2 mt-2">
              <FaEnvelopeOpenText className="text-main-red" />
              <a href={`mailto:${data.contacts.email}`} className="text-main-gray hover:underline">
                {data.contacts.email}
              </a>
            </li>
            <li className="flex items-center gap-2 mt-2 text-[16px]">
              <FaPhone className="text-main-red rotate-120" />
              <ul className="flex flex-wrap gap-2 p-0 m-0 leading-4">
                {data.contacts.phones?.map((ph: string, i: number) => (
                  <li key={i}>
                    <a href={`tel:${ph}`} className="text-main-gray hover:underline">
                      {ph}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (md+) — unchanged ── */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_2fr] gap-10">

        {/* Section 1: Description & Socials */}
        <div>
          <div className="flex gap-6 mb-4">
            {Object.entries(data.socials || {}).map(([platform, url]: any) =>
              url && (
                <Link key={platform} href={url} target="_blank" rel="noopener noreferrer">
                  <span className="text-white text-xl hover:text-main-red transition-all">
                    {getSocialIcon(platform)}
                  </span>
                </Link>
              )
            )}
          </div>
          <p className="text-main-gray text-[16px]">
            {data.description}
            <Link href="/about" className="text-main-red hover:underline ml-1">
              More...
            </Link>
          </p>
        </div>

        {/* Section 2: Useful Links */}
        <div>
          <h3 className="text-lg text-gray-200 mb-2 font-bold">Useful Links</h3>
          <ul className="list-none p-0 m-0 text-[16px]">
            {DESKTOP_USEFUL_LINKS.map((item) => (
              <li key={item.text} className="mt-2">
                {item.isExternal ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-main-gray hover:underline cursor-pointer"
                  >
                    {item.text}
                  </a>
                ) : (
                  <Link href={item.url} className="text-main-gray hover:underline">
                    {item.text}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Our Services */}
        <div>
          <h3 className="text-lg text-gray-200 mb-2 font-bold">Our Services</h3>
          <ul className="list-none p-0 m-0 text-[16px]">
            {DESKTOP_SERVICES_LINKS.map((item) => (
              <li key={item.text} className="mt-2">
                <Link href={item.url} className="text-main-gray hover:underline">
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Get In Touch */}
        <div>
          <h3 className="text-lg text-gray-200 mb-2 font-bold">Get In Touch</h3>
          <ul className="list-none p-0 m-0">
            {data.contacts?.offices?.map((off: any, i: number) => (
              <li key={i} className="flex items-center gap-2 mt-2">
                <FaMapMarkerAlt className="text-main-red shrink-0" />
                <p className="text-main-gray text-[16px]">{off.address}</p>
              </li>
            ))}
            <li className="flex items-center gap-2 mt-2">
              <FaEnvelopeOpenText className="text-main-red" />
              <a href={`mailto:${data.contacts.email}`} className="text-main-gray hover:underline">
                {data.contacts.email}
              </a>
            </li>
            <li className="flex items-center gap-2 mt-2 text-[16px]">
              <FaPhone className="text-main-red rotate-120" />
              <ul className="flex flex-wrap gap-2 p-0 m-0 leading-4">
                {data.contacts.phones?.map((ph: string, i: number) => (
                  <li key={i}>
                    <a href={`tel:${ph}`} className="text-main-gray hover:underline">
                      {ph}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-4 py-4 border-t border-white/5">
        <p className="text-main-gray text-[15px]">
          {data.copyright || "© 2016 All Rights Reserved"}
          <Link href="/" className="text-main-red hover:underline ml-1">
            Jaikvik Technology India Pvt Ltd
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;