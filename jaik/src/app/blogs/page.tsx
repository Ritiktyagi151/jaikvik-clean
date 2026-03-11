import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import dynamic from "next/dynamic"; // ✅ Dynamic import

// ✅ SSR band karo - refresh crash fix
const Blogs = dynamic(() => import("@/pages/blogs/Blogs"), { 
  ssr: false 
});

export const metadata: Metadata = pageMetadata("/blogs");

export default function Page() {
  return <Blogs />;
}