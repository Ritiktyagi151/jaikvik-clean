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
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="X2yD33PfPoVCpTrJj89X2NimQXPRWR76wfD1Z28kUQA"
        />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          href="https://jaikvik.in/lab/cloud/jaikvik/assets/images/banner/favicon.png"
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-B99PTB12R1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B99PTB12R1');
            `,
          }}
        />

        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.jaikvik.com/#localbusiness",
                  name: "Jaikvik Technology India",
                  image:
                    "https://jaikvik.com/lab/new-post-video/img/logo/logo-1.png",
                  url: "https://www.jaikvik.com/",
                  logo: "https://jaikvik.com/lab/new-post-video/img/logo/logo-1.png",
                  description:
                    "Jaikvik Technology India offers digital marketing, SEO services, web and mobile app development, ERP, CRM, and more. Trusted tech partner for business growth.",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "A 82, Sector 63",
                    addressLocality: "Noida",
                    addressRegion: "Uttar Pradesh",
                    postalCode: "201301",
                    addressCountry: "IN",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: "28.6280",
                    longitude: "77.3705",
                  },
                  telephone: "+91-9220826934",
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+91-9220826934",
                    contactType: "customer support",
                    availableLanguage: ["English", "Hindi"],
                    areaServed: "IN",
                  },
                  sameAs: [
                    "https://www.facebook.com/jaikviktechnology",
                    "https://www.instagram.com/jaikviktechnology/",
                    "https://twitter.com/jaikvik",
                    "https://www.youtube.com/@jaikviktechnology",
                    "https://www.linkedin.com/company/jaikviktechnology/",
                  ],
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ],
                      opens: "10:00",
                      closes: "19:00",
                    },
                  ],
                  priceRange: "$$",
                },
              ],
            }),
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.jaikvik.com/#organization",
              name: "Jaikvik Technology India",
              url: "https://www.jaikvik.com/",
              logo: "https://jaikvik.com/lab/new-post-video/img/logo/logo-1.png",
              description:
                "Jaikvik Technology India offers digital marketing, SEO services, web and mobile app development, ERP, CRM, and more. Trusted tech partner for business growth.",
              sameAs: [
                "https://www.facebook.com/jaikviktechnology",
                "https://www.instagram.com/jaikviktechnology/",
                "https://twitter.com/jaikvik",
                "https://www.youtube.com/@jaikviktechnology",
                "https://www.linkedin.com/company/jaikviktechnology/",
              ],
            }),
          }}
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