/**
 * Favicon extraction utilities
 * Fetches and parses favicons from URLs with multiple fallback strategies
 */

/**
 * Check if a URL is a valid HTTP/HTTPS URL (not a data URL or other scheme)
 */
function isValidHttpUrl(iconUrl: string): boolean {
  return iconUrl.startsWith("http://") || iconUrl.startsWith("https://");
}

/**
 * Check if a URL is a base64 data URL
 */
export function isDataUrl(iconUrl: string): boolean {
  return iconUrl.startsWith("data:");
}

/**
 * Parse a data URL and extract the buffer and content type
 * Returns null if the data URL is invalid or not base64 encoded
 */
export function parseDataUrl(dataUrl: string): { buffer: Buffer; contentType: string } | null {
  if (!isDataUrl(dataUrl)) {
    return null;
  }

  // Data URL format: data:[<mediatype>][;base64],<data>
  const match = dataUrl.match(/^data:([^;,]+)?(?:;base64)?,(.*)$/);
  if (!match) {
    return null;
  }

  const contentType = match[1] || "application/octet-stream";
  const data = match[2];

  if (!data) {
    return null;
  }

  // Check if it's base64 encoded (most common case)
  if (dataUrl.includes(";base64,")) {
    try {
      const buffer = Buffer.from(data, "base64");
      return { buffer, contentType };
    } catch {
      return null;
    }
  }

  // URL-encoded data (less common)
  try {
    const decoded = decodeURIComponent(data);
    const buffer = Buffer.from(decoded);
    return { buffer, contentType };
  } catch {
    return null;
  }
}

/**
 * Fetch and parse HTML to extract metadata including favicon
 */
async function fetchBasicMetadata(url: string): Promise<{
  title?: string;
  description?: string;
  author?: string;
  imageUrl?: string;
  siteName?: string;
  iconUrl?: string;
}> {
  try {
    // Use a simple fetch with headers that mimic a browser
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract just the head section to minimize parsing
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const headContent = headMatch ? headMatch[1] : html.substring(0, 10000); // Fallback to first 10KB

    // Helper function to extract meta content with flexible attribute order
    const extractMetaByProperty = (property: string): string | undefined => {
      // Try multiple patterns to handle different attribute orders
      const patterns = [
        new RegExp(
          `<meta[^>]*\\s+property=["']${property}["'][^>]*\\s+content=["']([^"']+)["']`,
          "i",
        ),
        new RegExp(
          `<meta[^>]*\\s+content=["']([^"']+)["'][^>]*\\s+property=["']${property}["']`,
          "i",
        ),
      ];

      for (const pattern of patterns) {
        const match = headContent.match(pattern);
        if (match) return match[1]?.trim();
      }
      return undefined;
    };

    const extractMetaByName = (name: string): string | undefined => {
      // Try multiple patterns to handle different attribute orders
      const patterns = [
        new RegExp(`<meta[^>]*\\s+name=["']${name}["'][^>]*\\s+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta[^>]*\\s+content=["']([^"']+)["'][^>]*\\s+name=["']${name}["']`, "i"),
      ];

      for (const pattern of patterns) {
        const match = headContent.match(pattern);
        if (match) return match[1]?.trim();
      }
      return undefined;
    };

    // Extract Open Graph tags
    const ogTitle = extractMetaByProperty("og:title");
    const ogDescription = extractMetaByProperty("og:description");
    const ogImage = extractMetaByProperty("og:image");
    const ogSiteName = extractMetaByProperty("og:site_name");

    // Extract Twitter Card tags as fallback
    const twitterTitle =
      extractMetaByProperty("twitter:title") || extractMetaByName("twitter:title");
    const twitterDescription =
      extractMetaByProperty("twitter:description") || extractMetaByName("twitter:description");
    const twitterImage =
      extractMetaByProperty("twitter:image") || extractMetaByName("twitter:image");

    // Extract standard meta tags
    const metaDescription = extractMetaByName("description");
    const metaAuthor = extractMetaByName("author");

    // Extract title tag
    const titleMatch = headContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    const titleTag = titleMatch ? titleMatch[1]?.trim() : undefined;

    // Extract favicon/icon information
    let iconUrl: string | undefined;

    // Helper function to extract link href with flexible attribute order
    const extractLinkHref = (relPattern: string): string | undefined => {
      const patterns = [
        new RegExp(`<link[^>]*\\s+rel=["']${relPattern}["'][^>]*\\s+href=["']([^"']+)["']`, "i"),
        new RegExp(`<link[^>]*\\s+href=["']([^"']+)["'][^>]*\\s+rel=["']${relPattern}["']`, "i"),
      ];

      for (const pattern of patterns) {
        const match = headContent.match(pattern);
        if (match) return match[1];
      }
      return undefined;
    };

    // Try to extract high-quality icons in order of preference
    // Data URLs (base64 encoded) are now supported
    const candidateIcons: string[] = [];

    // 1. Apple touch icon (usually highest quality, 180x180 or similar)
    const appleIcon =
      extractLinkHref("apple-touch-icon") || extractLinkHref("apple-touch-icon-precomposed");
    if (appleIcon) candidateIcons.push(appleIcon);

    // 2. High-res icon with sizes attribute
    const highResIcon = headContent.match(
      /<link[^>]*\s+rel=["']icon["'][^>]*\s+sizes=["'](?:192x192|256x256|512x512)[^>]*\s+href=["']([^"']+)["']/i,
    );
    if (highResIcon && highResIcon[1]) {
      candidateIcons.push(highResIcon[1]);
    }

    // 3. Icon with type="image/png" or type="image/svg+xml"
    const patterns = [
      /<link[^>]*\s+type=["']image\/(?:png|svg\+xml)["'][^>]*\s+href=["']([^"']+)["']/i,
      /<link[^>]*\s+href=["']([^"']+\.(?:png|svg))["'][^>]*>/i,
    ];

    for (const pattern of patterns) {
      const match = headContent.match(pattern);
      if (match && match[1]) {
        candidateIcons.push(match[1]);
        break;
      }
    }

    // 4. Any icon or shortcut icon
    const standardIcon =
      extractLinkHref("icon") || extractLinkHref("shortcut icon") || extractLinkHref("shortcut");
    if (standardIcon) candidateIcons.push(standardIcon);

    // 5. OG image as last resort (sometimes sites use their logo as og:image)
    if (ogImage && ogImage.includes("logo")) {
      candidateIcons.push(ogImage);
    }

    // Use the first valid candidate
    iconUrl = candidateIcons[0];

    // Make icon URL absolute if it's relative
    if (iconUrl) {
      try {
        const baseUrl = new URL(url);
        iconUrl = new URL(iconUrl, baseUrl).toString();
      } catch {
        // If URL construction fails, keep the original
      }
    }

    // Combine results with fallbacks
    return {
      title: ogTitle || twitterTitle || titleTag || undefined,
      description: ogDescription || twitterDescription || metaDescription || undefined,
      author: metaAuthor || undefined,
      imageUrl: ogImage || twitterImage || undefined,
      siteName: ogSiteName || undefined,
      iconUrl: iconUrl || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Verify that a URL is accessible and returns a valid response
 */
async function verifyIconUrl(iconUrl: string): Promise<boolean> {
  try {
    const response = await fetch(iconUrl, {
      method: "HEAD", // Just check headers, don't download the full file
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get the best quality favicon URL for a given URL
 * This function prioritizes higher quality favicons over Google's generic service
 *
 * Priority order:
 * 1. Apple touch icon from HTML meta tags (verified to be accessible)
 * 2. High-res icon from HTML meta tags (verified to be accessible)
 * 3. Standard icon from HTML meta tags (verified to be accessible)
 * 4. Google's favicon service (128px for better quality)
 */
export async function getBestFaviconUrl(url: string): Promise<string> {
  try {
    const metadata = await fetchBasicMetadata(url);
    if (metadata.iconUrl) {
      // Data URLs (base64 encoded) can be returned directly - no verification needed
      if (isDataUrl(metadata.iconUrl)) {
        return metadata.iconUrl;
      }

      // Only use HTTP/HTTPS URLs, and verify they're accessible
      if (isValidHttpUrl(metadata.iconUrl)) {
        const isAccessible = await verifyIconUrl(metadata.iconUrl);
        if (isAccessible) {
          return metadata.iconUrl;
        }
        // If the icon URL is not accessible, fall through to Google's service
      }
    }
  } catch {
    // Silent failure, will use fallback
  }

  // Fallback to Google's favicon service
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
  } catch {
    return "https://www.google.com/s2/favicons?sz=128&domain=example.com";
  }
}
