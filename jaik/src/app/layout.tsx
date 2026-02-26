import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AppProvider from "@/providers/AppProvider";
import ClientLayoutWrapper from "@/layouts/ClientLayoutWrapper";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="X2yD33PfPoVCpTrJj89X2NimQXPRWR76wfD1Z28kUQA"
        />
        <link
          rel="icon"
          type="image/png"
          href="https://jaikvik.in/lab/cloud/jaikvik/assets/images/banner/favicon.png"
        />
      </head>
      <body suppressHydrationWarning>
        <AppProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
