import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import DigitalMarketing from "@/pages/service/Digital_Marketing";

export const metadata: Metadata = pageMetadata("/digital-marketing-agency");

export default function Page() {
  return <DigitalMarketing />;
}