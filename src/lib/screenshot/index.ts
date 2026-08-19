import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser, type Page } from "puppeteer-core";

const VIEWPORT = {
  width: 1280,
  height: 800,
  deviceScaleFactor: 2, // Retina for sharper screenshots
};

const TIMEOUT = 30000; // 30 seconds
// Intro/loading animations often run 1–2s after first paint; wait a bit longer so
// the screenshot is of the settled page rather than a splash or fade-in.
const SETTLE_DELAY = 2500;

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Check if running in serverless environment
const IS_SERVERLESS = !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.VERCEL;

export type ColorScheme = "light" | "dark";

export type MediaFeature = {
  name: string;
  value: string;
};

/**
 * Media features that make `prefers-color-scheme` resolve to the given scheme.
 * Sites that only read the preference at first paint need this set before navigation.
 */
export function colorSchemeMediaFeatures(colorScheme: ColorScheme): MediaFeature[] {
  return [{ name: "prefers-color-scheme", value: colorScheme }];
}

export type PageLike = {
  emulateMediaFeatures(features?: MediaFeature[]): Promise<void>;
  goto(url: string, options?: Record<string, unknown>): Promise<unknown>;
  screenshot(options?: Record<string, unknown>): Promise<Uint8Array | Buffer | string>;
};

/**
 * Get the Chrome executable path based on environment
 */
async function getExecutablePath(): Promise<string> {
  if (IS_SERVERLESS) {
    return chromium.executablePath();
  }

  // Local development - try common Chrome paths on macOS
  const { execSync } = await import("child_process");
  const chromePaths = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  ];

  for (const path of chromePaths) {
    try {
      execSync(`test -f "${path}"`);
      return path;
    } catch {
      // Path doesn't exist, try next
    }
  }

  throw new Error(
    "Chrome not found. Please install Google Chrome or set CHROME_PATH environment variable.",
  );
}

async function launchBrowser(): Promise<Browser> {
  const executablePath = process.env.CHROME_PATH || (await getExecutablePath());

  return puppeteer.launch({
    args: IS_SERVERLESS
      ? chromium.args
      : ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: VIEWPORT,
    executablePath,
    headless: true,
  });
}

async function preparePage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  return page;
}

/**
 * Capture a viewport screenshot after emulating the given color scheme and navigating.
 *
 * A second navigation (not a same-page media swap) is the reliable path: many sites
 * only apply `prefers-color-scheme` on first paint. Emulation is set before `goto`.
 */
export async function capturePageScreenshot(
  page: PageLike,
  url: string,
  options: { colorScheme?: ColorScheme; settleDelayMs?: number } = {},
): Promise<Buffer> {
  const colorScheme = options.colorScheme ?? "light";
  const settleDelayMs = options.settleDelayMs ?? SETTLE_DELAY;

  await page.emulateMediaFeatures(colorSchemeMediaFeatures(colorScheme));

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: TIMEOUT,
  });

  // Wait in Node (not page JS) so a site that overrides timers still settles
  await new Promise((resolve) => setTimeout(resolve, settleDelayMs));

  const screenshot = await page.screenshot({
    type: "png",
    fullPage: false,
  });

  return Buffer.from(screenshot);
}

/**
 * Capture a screenshot of a website using Puppeteer.
 * Works in both local development (uses system Chrome) and serverless (uses @sparticuz/chromium).
 * Defaults to light; pass `{ colorScheme: "dark" }` for a dark capture.
 */
export async function captureScreenshot(
  url: string,
  options: { colorScheme?: ColorScheme } = {},
): Promise<Buffer> {
  const browser = await launchBrowser();

  try {
    const page = await preparePage(browser);
    return await capturePageScreenshot(page, url, options);
  } finally {
    await browser.close();
  }
}

/**
 * Capture light and dark viewport screenshots in one browser session.
 * Dark is a second navigation with `prefers-color-scheme: dark` already emulated.
 */
export async function captureLightAndDarkScreenshots(url: string): Promise<{
  light: Buffer;
  dark: Buffer;
}> {
  const browser = await launchBrowser();

  try {
    const page = await preparePage(browser);
    const light = await capturePageScreenshot(page, url, { colorScheme: "light" });
    const dark = await capturePageScreenshot(page, url, { colorScheme: "dark" });
    return { light, dark };
  } finally {
    await browser.close();
  }
}
