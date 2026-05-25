import type { Metadata } from "next";
import GalleryClient from "@/components/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery | Jaikvik Technology India",
  description:
    "Explore Jaikvik Technology India's latest banners, gallery images, and visual updates.",
};

export default function Page() {
  return <GalleryClient />;
}
