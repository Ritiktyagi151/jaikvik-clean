"use client";

import { FaRegCalendarCheck, FaRegUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { blogInterface } from "../../interfaces/blogInterface";

const BlogCard: React.FC<blogInterface> = ({
  category = "",
  author = "",
  createdAt,
  publishedAt,
  title = "",
  summary = "",
  image = "",
  description = "",
  slug = "",
}) => {
  const router = useRouter();
  
  // ✅ Fix 1: MEDIA_BASE client-side pe safely compute karo
  const [mediaBase, setMediaBase] = useState("");
  
  // ✅ Fix 2: Date state mein rakho — server pe empty, client pe set karo
  const [displayDate, setDisplayDate] = useState("");

  useEffect(() => {
    // MEDIA_BASE sirf client pe set hoga — hydration mismatch khatam
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
    setMediaBase(apiBase.replace("/api", ""));

    // Date bhi sirf client pe set hogi
    const rawDate = publishedAt || createdAt;
    if (rawDate) {
      setDisplayDate(new Date(rawDate as string).toLocaleDateString());
    }
  }, [publishedAt, createdAt]);

  const handleReadMore = () => {
    router.push(`/blog/${slug}`);
  };

  // ✅ Fix 3: description safely handle karo
  const fallbackText = description
    ? description.substring(0, 80) + "..."
    : "No description available.";

  return (
    <div className="w-full rounded-lg group p-3 gap-2 flex flex-col justify-start items-start bg-main-secondary/80">
      <div className="w-full overflow-hidden rounded-lg">
        <img
          // ✅ mediaBase ab safely client-side se aayega
          src={mediaBase && image ? `${mediaBase}${image}` : "https://placehold.co/300x120?text=Loading"}
          alt={title}
          className="group-hover:scale-110 transition-all duration-300 h-[160px] w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://placehold.co/300x120?text=No+Image";
          }}
        />
      </div>
      <div className="flex justify-start text-sm w-full items-center gap-x-3 text-neutral-200">
        <h2 className="font-bold text-main-red uppercase text-[10px]">{category}</h2>
        <div className="flex justify-center items-center gap-1">
          <FaRegUser size={10} className="text-main-red" />
          <span className="text-[11px]">{author || "Admin"}</span>
        </div>
        <div className="flex justify-center items-center gap-1">
          <FaRegCalendarCheck size={10} className="text-main-red" />
          {/* ✅ displayDate ab state se aayega — no hydration mismatch */}
          <span className="text-[11px]">{displayDate}</span>
        </div>
      </div>
      <div className="w-full">
        <h4 className="font-extrabold text-white line-clamp-1">{title}</h4>
        <p className="text-neutral-300 text-[13px] line-clamp-2 mt-1">
          {/* ✅ safely fallback */}
          {summary || fallbackText}
        </p>
      </div>
      <button
        onClick={handleReadMore}
        className="rounded-sm bg-main-red text-[13px] text-neutral-50 cursor-pointer py-1 px-4 mt-2 font-bold hover:bg-red-700 transition-colors"
      >
        Read Full Story
      </button>
    </div>
  );
};

export default BlogCard;