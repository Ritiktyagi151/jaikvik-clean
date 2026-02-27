"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaRegCalendarCheck, FaRegUser } from "react-icons/fa";

// ✅ API URLs from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const MEDIA_BASE = API_URL.replace('/api', ''); 

const BlogDetail: React.FC = () => {
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Next.js 15+ mein params ko safely access karne ke liye
    const id = params?.id;

    const fetchDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // API call to fetch blog by ID
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
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold animate-pulse">Loading Content...</p>
        </div>
      </div>
    );
  }
  
  // 404 State
  if (!blog) {
    return (
      <div className="text-center py-40 bg-black min-h-screen text-white">
        <h1 className="text-4xl text-red-600 font-extrabold mb-4">Post Not Found</h1>
        <p className="text-gray-400">The blog post you are looking for does not exist or has been removed.</p>
        <a href="/blogs" className="mt-6 inline-block bg-red-600 px-6 py-2 rounded-lg font-bold">Go Back to Blogs</a>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-red-600 selection:text-white">
      {/* Hero Header */}
      <div className="w-full h-[50vh] md:h-[70vh] relative">
        <img 
          src={`${MEDIA_BASE}${blog.image}`} 
          className="w-full h-full object-cover" 
          alt={blog.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl max-w-5xl">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 mb-12 text-sm text-gray-400 border-b border-zinc-800 pb-8">
          <span className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
            <FaRegUser className="text-red-600"/> 
            <span className="font-semibold text-gray-200">{blog.author || 'Admin'}</span>
          </span>
          <span className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
            <FaRegCalendarCheck className="text-red-600"/> 
            {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="bg-red-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-red-900/20">
            {blog.category}
          </span>
        </div>

        {/* Blog Content Section */}
        <article className="prose prose-invert prose-red max-w-none">
          {/* Summary / Sub-description */}
          <div className="text-xl md:text-2xl font-medium text-gray-300 italic mb-12 border-l-8 border-red-600 pl-8 leading-relaxed bg-zinc-900/50 py-8 rounded-r-2xl">
            "{blog.description}"
          </div>

          {/* Main Body Content with Hydration Fix */}
          <div 
            suppressHydrationWarning={true}
            className="blog-content-area text-gray-200 leading-[1.8] text-lg md:text-xl space-y-6"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </article>

        {/* Footer Navigation */}
        <div className="mt-20 pt-10 border-t border-zinc-800 flex justify-between items-center">
            <button 
              onClick={() => window.history.back()}
              className="text-red-500 font-bold hover:text-red-400 transition flex items-center gap-2"
            >
              ← Back to Overview
            </button>
            <p className="text-zinc-600 text-sm">© 2026 Jaikvik Technology India Pvt Ltd</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;