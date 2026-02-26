"use client";

import { usePathname } from "next/navigation";
import AppLayout from "./AppLayout";
import AdminLayout from "./AdminLayout";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  if (pathname.startsWith("/admin/dashboard")) {
    return <AdminLayout>{children}</AdminLayout>;
  }
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }
  return <AppLayout>{children}</AppLayout>;
}
