"use client";

import React, { useState, useEffect } from "react";
import { FaRegCalendarCheck, FaRegUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import type { blogInterface } from "../../interfaces/blogInterface";

// ✅ API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";
const MEDIA_BASE = API_URL.replace('/api', '');

const BlogCard: React.FC<blogInterface> = ({
  category = "",
  author = "",
  createdAt,
  title = "",
  summary = "",
  image = "",
  description = "",
  id = "", // Next.js standard ke liye _id ya id use karein
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // ✅ Hydration Fix: Component mount hone tak render wait karega
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReadMore = () => {
    // Agar slug nahi hai toh _id use karein
    router.push(`/blogs/${id}`);
  };

  const displayDate = createdAt ? new Date(createdAt).toLocaleDateString() : "";

  if (!mounted) return null; // Server aur client mismatch rokne ke liye

  return (
    <div className="w-full rounded-lg group p-3 gap-2 flex flex-col justify-start items-start bg-zinc-900/80 border border-zinc-800 hover:border-red-600 transition-all">
      <div className="w-full overflow-hidden rounded-lg aspect-video">
        <img
          src={`${MEDIA_BASE}${image}`}
          alt={title}
          className="group-hover:scale-110 transition-all duration-500 h-full w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://via.placeholder.com/400x225?text=Jaikvik+Technology";
          }}
        />
      </div>

      <div className="flex justify-start text-sm w-full items-center gap-x-3 text-neutral-400 mt-2">
        <h2 className="font-bold text-red-600 uppercase text-[10px] tracking-widest">{category}</h2>
        <div className="flex items-center gap-1">
          <FaRegUser size={10} className="text-red-600" />
          <span className="text-[11px]">{author || "Admin"}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaRegCalendarCheck size={10} className="text-red-600" />
          <span className="text-[11px]">{displayDate}</span>
        </div>
      </div>

      <div className="w-full mt-2">
        <h4 className="font-bold text-white line-clamp-2 text-lg leading-snug group-hover:text-red-500 transition-colors">
          {title}
        </h4>
        <p className="text-neutral-400 text-sm line-clamp-2 mt-2 leading-relaxed">
          {summary && summary !== ""
            ? summary
            : description.replace(/<[^>]*>?/gm, '').substring(0, 100) + "..."} 
            {/* ✅ HTML tags ko strip kar diya description se takki crash na ho */}
        </p>
      </div>

      <button
        onClick={handleReadMore}
        className="w-full text-center rounded bg-red-600 text-[13px] text-white cursor-pointer py-2 mt-4 font-black uppercase tracking-tighter hover:bg-red-700 transition-all"
      >
        Read Full Story
      </button>
    </div>
  );
};

export default BlogCard;