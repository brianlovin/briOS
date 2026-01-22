import type { Metadata } from "next";

/**
 * Site-wide metadata constants
 */
export const SITE_CONFIG = {
  name: "Brian Lovin",
  title: "Brian Lovin",
  description:
    "Designer and software engineer living in San Francisco. Currently designing AI products at Notion.",
  url: "https://brianlovin.com",
  author: {
    name: "Brian Lovin",
    twitter: "@brian_lovin",
    twitterUrl: "https://x.com/brian_lovin",
    github: "https://github.com/brianlovin",
  },
  social: {
    twitter: {
      handle: "@brian_lovin",
      cardType: "summary_large_image" as const,
    },
  },
  ogImage: {
    width: 1200,
    height: 630,
  },
} as const;

/**
 * Default metadata shared across all pages
 */
export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/img/og.png",
        width: SITE_CONFIG.ogImage.width,
        height: SITE_CONFIG.ogImage.height,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: SITE_CONFIG.social.twitter.cardType,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.author.twitter,
    images: ["/img/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Brian Lovin",
  },
};

interface CreateMetadataParams {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  type?: "website" | "article";
}

/**
 * Create metadata for a page with optional overrides
 *
 * @example
 * ```ts
 * export const metadata = createMetadata({
 *   title: "My Blog Post",
 *   description: "A great post about Next.js",
 *   path: "/writing/my-blog-post",
 * });
 * ```
 */
export function createMetadata(params: CreateMetadataParams = {}): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    path = "",
    image,
    noIndex = false,
    publishedTime,
    modifiedTime,
    type = "website",
  } = params;

  const url = `${SITE_CONFIG.url}${path}`;

  const ogImage = image || "/img/og.png";

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      type,
      url,
      siteName: SITE_CONFIG.name,
      title: title || SITE_CONFIG.title,
      description,
      images: [
        {
          url: ogImage,
          width: SITE_CONFIG.ogImage.width,
          height: SITE_CONFIG.ogImage.height,
          alt: title || SITE_CONFIG.title,
        },
      ],
      ...(type === "article" &&
        publishedTime && {
          publishedTime,
          modifiedTime: modifiedTime || publishedTime,
          authors: [SITE_CONFIG.author.name],
        }),
    },
    twitter: {
      card: SITE_CONFIG.social.twitter.cardType,
      title: title || SITE_CONFIG.title,
      description,
      creator: SITE_CONFIG.author.twitter,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };

  return metadata;
}

/**
 * Generate JSON-LD structured data for a website
 */
export function createWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
      sameAs: [SITE_CONFIG.author.twitter, SITE_CONFIG.author.github],
    },
  };
}

interface ArticleJsonLdParams {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
}

/**
 * Generate JSON-LD structured data for an article
 */
export function createArticleJsonLd(params: ArticleJsonLdParams) {
  const { title, description, path, publishedTime, modifiedTime, image } = params;
  const url = `${SITE_CONFIG.url}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
      sameAs: [SITE_CONFIG.author.twitter, SITE_CONFIG.author.github],
    },
    publisher: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    image: image || `${SITE_CONFIG.url}/img/og.png`,
  };
}

/**
 * Generate JSON-LD structured data for a person
 */
export function createPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.author.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    sameAs: [
      SITE_CONFIG.author.twitter,
      SITE_CONFIG.author.github,
      "https://www.youtube.com/@brian_lovin",
    ],
    jobTitle: "Product Designer",
    worksFor: {
      "@type": "Organization",
      name: "Notion",
      url: "https://notion.com",
    },
  };
}

interface BreadcrumbJsonLdParams {
  items: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function createBreadcrumbJsonLd(params: BreadcrumbJsonLdParams) {
  const { items } = params;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Helper to truncate text to a specific length for meta descriptions
 */
export function truncateDescription(text: string, maxLength: number = 155): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
}
