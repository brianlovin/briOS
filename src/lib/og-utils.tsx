import { ImageResponse } from "@vercel/og";

// Timeout helper for network requests
const FONT_TIMEOUT_MS = 5000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms),
  );
  return Promise.race([promise, timeout]);
}

// OG Image dimensions
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const OG_PADDING = 56;

// Colors (light mode only)
export const PRIMARY_COLOR = "#171717";
export const TERTIARY_COLOR = "#BFBFBF";

// Font sizes
export const TITLE_SIZE = 64;
export const URL_SIZE = 32;

// Avatar
export const AVATAR_SIZE = 100;

// Font loading from Google Fonts with timeout protection
async function loadGoogleFont(font: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;

  const cssResponse = await withTimeout(fetch(url), FONT_TIMEOUT_MS);
  const css = await cssResponse.text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const fontResponse = await withTimeout(fetch(resource[1]), FONT_TIMEOUT_MS);
    if (fontResponse.status === 200) {
      return fontResponse.arrayBuffer();
    }
  }

  throw new Error(`Failed to load font: ${font} ${weight}`);
}

// Load avatar via HTTP fetch from production URL
// Always use the canonical URL since preview deployments may not be ready during build
export async function loadAvatar(): Promise<string> {
  const avatarUrl = "https://brianlovin.com/img/avatar.jpg";

  const response = await withTimeout(fetch(avatarUrl), FONT_TIMEOUT_MS);
  if (!response.ok) {
    throw new Error(`Failed to load avatar: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

interface OGImageProps {
  title: string;
  url: string;
}

/**
 * Truncate title for OG images to fit within specified number of lines
 * At 64px font size, ~150 characters fits comfortably in 3 lines
 */
export function truncateOGTitle(title: string, maxLines: number = 3): string {
  // Approximate characters per line at 64px font size on 1088px width
  const charsPerLine = 50;
  const maxLength = charsPerLine * maxLines;

  if (title.length <= maxLength) return title;

  const truncated = title.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
}

export async function generateOGImage({ title, url }: OGImageProps) {
  try {
    // Combine all text for font loading
    const allText = `${title}${url}`;

    const [interRegularFont, interSemiBoldFont, avatarData] = await Promise.all([
      loadGoogleFont("Inter", 400, allText),
      loadGoogleFont("Inter", 700, allText),
      loadAvatar(),
    ]);

    return new ImageResponse(
      <div
        style={{
          width: OG_WIDTH,
          height: OG_HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: OG_PADDING,
          backgroundColor: "white",
        }}
      >
        {/* Avatar at the top */}
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarData}
            alt="Avatar"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            style={{
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Title and URL at the bottom */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: TITLE_SIZE,
              fontFamily: "Inter",
              fontWeight: 700,
              color: PRIMARY_COLOR,
              lineHeight: 1.2,
              letterSpacing: "-0.12rem",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title.length > 80 ? title.slice(0, 80) + "..." : title}
          </div>
          <div
            style={{
              fontSize: URL_SIZE,
              fontFamily: "Inter",
              fontWeight: 400,
              color: TERTIARY_COLOR,
            }}
          >
            brianlovin.com
          </div>
        </div>
      </div>,
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts: [
          {
            name: "Inter",
            data: interRegularFont,
            style: "normal",
            weight: 400,
          },
          {
            name: "Inter",
            data: interSemiBoldFont,
            style: "normal",
            weight: 700,
          },
        ],
      },
    );
  } catch (error) {
    console.error(`[OG] Error generating image for "${title}":`, error);
    throw error;
  }
}
