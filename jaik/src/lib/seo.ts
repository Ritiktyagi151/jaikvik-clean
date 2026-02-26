import type { Metadata } from "next";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.jaikvik.com").replace(
    /\/$/,
    ""
  );

const SITE_NAME = "Jaikvik Technology India";
const DEFAULT_TITLE = "Digital Marketing, SEO & Web Development Company";
const DEFAULT_DESCRIPTION =
  "Jaikvik Technology India offers digital marketing, SEO services, website and mobile app development, ERP, CRM, and branding solutions.";
const DEFAULT_OG_IMAGE = "https://jaikvik.com/img/logo/og-image.jpg";
const DEFAULT_KEYWORDS = [
  "digital marketing agency",
  "SEO services",
  "web development",
  "mobile app development",
  "Jaikvik Technology",
].join(", ");

type PageSeoConfig = {
  title: string;
  description: string;
  keywords?: string;
  noIndex?: boolean;
};

const PUBLIC_PAGE_SEO: Record<string, PageSeoConfig> = {
  "/": {
    title: "Jaikvik Technology India",
    description: DEFAULT_DESCRIPTION,
  },
  "/about": {
    title: "About Us",
    description:
      "Learn about Jaikvik Technology India, our mission, team, and expertise across digital marketing and software services.",
  },
  "/blogs": {
    title: "Our Blogs",
    description:
      "Read digital marketing, SEO, development, and business growth insights from Jaikvik Technology India.",
  },
  "/blogs/[id]": {
    title: "Blog Details",
    description:
      "Explore detailed blog insights from Jaikvik Technology India on marketing, SEO, and development trends.",
  },
  "/branding": {
    title: "Brand Promotion Services",
    description:
      "Grow your brand visibility with strategic branding and promotion services from Jaikvik Technology India.",
  },
  "/brochure": {
    title: "Company Brochure",
    description:
      "Download the official Jaikvik Technology India company brochure and explore our services.",
  },
  "/careers": {
    title: "Careers",
    description:
      "Apply for open roles at Jaikvik Technology India and build your career with our growing team.",
  },
  "/contact-us": {
    title: "Contact Us",
    description:
      "Contact Jaikvik Technology India for digital marketing, SEO, website, app, and software project requirements.",
  },
  "/crm": {
    title: "CRM Software Development",
    description:
      "Custom CRM software solutions to streamline customer management, sales, and support workflows.",
  },
  "/cusotmized-software": {
    title: "Customized Software Development",
    description:
      "Build custom software tailored to your business process, goals, and operational requirements.",
  },
  "/digital-marketing-agency": {
    title: "Digital Marketing Agency",
    description:
      "Performance-focused digital marketing services including SEO, social media, ads, and lead generation.",
  },
  "/erp": {
    title: "ERP Software Development",
    description:
      "Scalable ERP software solutions for inventory, operations, finance, and enterprise workflows.",
  },
  "/film-production": {
    title: "Film Production Services",
    description:
      "Corporate film production, promotional shoots, and creative video services by Jaikvik Technology India.",
  },
  "/java": {
    title: "Java Development",
    description:
      "Enterprise-grade Java development services for robust, scalable, and secure business applications.",
  },
  "/javascript": {
    title: "JavaScript Development",
    description:
      "Modern JavaScript development for fast, interactive web apps and scalable front-end experiences.",
  },
  "/jquery": {
    title: "jQuery Development",
    description:
      "Efficient jQuery development support for dynamic UI enhancements and legacy project maintenance.",
  },
  "/laravel": {
    title: "Laravel Development",
    description:
      "Custom Laravel web application development with secure architecture and high-performance backend.",
  },
  "/mobile-application": {
    title: "Mobile App Development",
    description:
      "Android and iOS mobile application development services with modern UX and reliable performance.",
  },
  "/mongodb": {
    title: "MongoDB Development",
    description:
      "MongoDB-powered app architecture and backend development for high-scale data-driven applications.",
  },
  "/node-js": {
    title: "Node.js Development",
    description:
      "High-performance Node.js backend development for APIs, real-time systems, and web platforms.",
  },
  "/portfolio": {
    title: "Our Portfolio",
    description:
      "Explore Jaikvik Technology India's portfolio of digital marketing, software, and web development projects.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "Read Jaikvik Technology India's privacy policy and how we collect, process, and secure user information.",
  },
  "/python": {
    title: "Python Development",
    description:
      "Python development services for automation, backend systems, and scalable business applications.",
  },
  "/react-js": {
    title: "React.js Development",
    description:
      "React.js development services for modern, high-performance, and SEO-conscious web interfaces.",
  },
  "/seo-services": {
    title: "SEO Services",
    description:
      "Result-oriented SEO services to improve rankings, organic visibility, and qualified traffic growth.",
  },
  "/social-media-marketing": {
    title: "Social Media Marketing Services",
    description:
      "Social media strategy, creatives, and campaign management services for sustained brand growth.",
  },
  "/sql": {
    title: "SQL Development",
    description:
      "SQL database design, optimization, and management solutions for secure and reliable data systems.",
  },
  "/web-development": {
    title: "Web Development Services",
    description:
      "End-to-end web development services for business websites, portals, and custom web platforms.",
  },
  "/wordpress": {
    title: "WordPress Development",
    description:
      "WordPress website development, customization, and optimization services for business growth.",
  },
  "/youtube-meta-ads": {
    title: "YouTube & Meta Ads Services",
    description:
      "High-conversion YouTube and Meta ads campaign management to maximize reach and ROI.",
  },
};

const normalizePath = (path: string) => {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

const toCanonicalUrl = (path: string) => `${SITE_URL}${normalizePath(path)}`;

export const pageMetadata = (path: string): Metadata => {
  const normalizedPath = normalizePath(path);
  const pageConfig = PUBLIC_PAGE_SEO[normalizedPath];
  const title = pageConfig?.title
    ? `${pageConfig.title} | ${SITE_NAME}`
    : `${DEFAULT_TITLE} | ${SITE_NAME}`;
  const description = pageConfig?.description || DEFAULT_DESCRIPTION;
  const keywords = pageConfig?.keywords || DEFAULT_KEYWORDS;
  const canonical = toCanonicalUrl(normalizedPath);
  const shouldNoIndex = Boolean(pageConfig?.noIndex);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: shouldNoIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
};

export const adminNoIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

