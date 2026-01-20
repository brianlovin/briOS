import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const VIEWPORT = {
  width: 1280,
  height: 800,
  deviceScaleFactor: 2, // Retina for sharper screenshots
};

const TIMEOUT = 30000; // 30 seconds
const SETTLE_DELAY = 1500; // Wait for animations/transitions to settle

// Check if running in serverless environment
const IS_SERVERLESS = !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.VERCEL;

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

/**
 * Capture a screenshot of a website using Puppeteer
 * Works in both local development (uses system Chrome) and serverless (uses @sparticuz/chromium)
 */
export async function captureScreenshot(url: string): Promise<Buffer> {
  const executablePath = process.env.CHROME_PATH || (await getExecutablePath());

  const browser = await puppeteer.launch({
    args: IS_SERVERLESS
      ? chromium.args
      : ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: VIEWPORT,
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    // Navigate to the page
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: TIMEOUT,
    });

    // Wait for any animations/transitions to settle
    await page.evaluate(
      (delay) => new Promise((resolve) => setTimeout(resolve, delay)),
      SETTLE_DELAY,
    );

    // Take screenshot of the viewport (not full page)
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    return Buffer.from(screenshot);
  } finally {
    await browser.close();
  }
}
