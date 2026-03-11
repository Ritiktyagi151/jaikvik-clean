"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/cards/BlogCard";
import type { blogInterface } from "@/interfaces/blogInterface";
import { cachedGet } from "@/lib/clientApiCache";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || ""}/blogs`;

type BlogApiResponse =
  | blogInterface[]
  | {
      success?: boolean;
      data?: blogInterface[];
    };

const Blogs = () => {
  const [blogs, setBlogs] = useState<blogInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await cachedGet<BlogApiResponse>(API_URL);
        const payload = response.data;

        if (Array.isArray(payload)) {
          setBlogs(payload);
          return;
        }

        if (payload.success && Array.isArray(payload.data)) {
          setBlogs(payload.data);
          return;
        }

        setBlogs([]);
      } catch (fetchError) {
        console.error("Error fetching blogs:", fetchError);
        setError("Unable to load blogs right now.");
      } finally {
        setLoading(false);
      }
    };

    void fetchBlogs();
  }, []);

  return (
    <section className="min-h-screen bg-main-primary px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-main-red">
            Insights
          </span>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
                Blogs & Updates
              </h1>
              <p className="mt-3 text-sm text-neutral-300 sm:text-base">
                News, product thinking, and execution notes from the Jaikvik team.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="inline-flex w-fit items-center rounded-sm border border-main-red px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-main-red"
            >
              Start a Project
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[340px] animate-pulse rounded-lg bg-main-secondary/60"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-10 text-center">
            <p className="text-lg font-semibold">{error}</p>
            <p className="mt-2 text-sm text-neutral-300">
              Check the blog API response or try rebuilding after the backend is reachable.
            </p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-main-secondary/50 px-6 py-10 text-center">
            <p className="text-lg font-semibold">No blogs available.</p>
            <p className="mt-2 text-sm text-neutral-300">
              Publish a post from the admin dashboard to populate this page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog._id || blog.id || blog.slug || `${blog.title}-${index}`}
                {...blog}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
