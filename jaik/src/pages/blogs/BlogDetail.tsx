"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaRegCalendarCheck, FaRegUser } from "react-icons/fa";

// ✅ Environment variables se URLs fetch karein
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const MEDIA_BASE = API_URL.replace('/api', ''); 

const BlogDetail: React.FC = () => {
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // ✅ Hydration mismatch fix

  useEffect(() => {
    setMounted(true);
    // Next.js 15 mein params ko safely access karne ka naya tareeka
    const id = params?.id;

    const fetchDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/blogs/${id}`);
        if (response.data.success) {
          setBlog(response.data.data);
        }
      } catch (err) {
        console.error("Detail Fetch Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [params?.id]);

  // Loading State
  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold animate-pulse text-gray-400">Loading Content...</p>
        </div>
      </div>
    );
  }
  
  // 404 State
  if (!blog) {
    return (
      <div className="text-center py-40 bg-black min-h-screen text-white">
        <h1 className="text-3xl text-red-600 font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-400">The URL "{params?.id}" is invalid or the post has been removed.</p>
        <button onClick={() => window.history.back()} className="mt-6 text-red-500 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="w-full h-[60vh] relative">
        <img 
          src={`${MEDIA_BASE}${blog.image}`} 
          className="w-full h-full object-cover shadow-2xl" 
          alt={blog.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-center justify-center p-6">
          <h1 className="text-3xl md:text-6xl font-extrabold text-white text-center drop-shadow-lg leading-tight">
            {blog.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Meta Metadata */}
        <div className="flex flex-wrap gap-6 mb-10 text-sm text-gray-400 border-b border-zinc-800 pb-8">
          <span className="flex items-center gap-2"><FaRegUser className="text-red-600"/> {blog.author || 'Admin'}</span>
          <span className="flex items-center gap-2"><FaRegCalendarCheck className="text-red-600"/> {new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{blog.category}</span>
        </div>

        {/* Content Area */}
        <article className="prose prose-invert max-w-none">
          {/* Description Section */}
          <div className="text-2xl font-medium text-gray-300 italic mb-10 border-l-4 border-red-600 pl-6 leading-relaxed">
            "{blog.description}"
          </div>

          {/* ✅ Hydration mismatch fixed using suppressHydrationWarning */}
          <div 
            suppressHydrationWarning={true}
            className="content-render text-gray-200 leading-loose text-lg space-y-4"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;