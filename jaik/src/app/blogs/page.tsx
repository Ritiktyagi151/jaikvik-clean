import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Blogs from "@/pages/blogs/Blogs";

export const metadata: Metadata = pageMetadata("/blogs");

export default function Page() {
  return <Blogs />;
}