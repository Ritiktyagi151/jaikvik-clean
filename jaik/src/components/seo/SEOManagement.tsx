"use client";

import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

const SEOManagement = ({
  title,
  description,
  keywords,
  image,
  canonical,
  noIndex,
  noFollow,
}: SEOProps) => {
  const metaTitle = title || "Default Meta Title";
  const metaDescription = description || "Default description of your site";
  const metaKeywords = keywords || "default, keywords, website";
  const metaImage = image || "/default-image.jpg";

  const metaCanonical =
    canonical ||
    (typeof window !== "undefined" ? window.location.href : "");

  const robotsContent = `${noIndex ? "noindex" : "index"}, ${
    noFollow ? "nofollow" : "follow"
  }`;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content={robotsContent} />
      {metaCanonical && (
        <link rel="canonical" href={metaCanonical} />
      )}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaCanonical} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default SEOManagement;
