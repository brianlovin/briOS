import { RichTextItemResponse } from "@notionhq/client";
import { Buffer } from "buffer";

import { notion } from "@/lib/notion/client";
import { getDataSourceId } from "@/lib/notion/queries";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI || "https://brianlovin.com/api/spotify/callback";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

/**
 * Thrown when Spotify rejects the stored refresh token with `invalid_grant`
 * (expired or revoked). The stored token is discarded before this is thrown;
 * recovery requires the user to sign in again via `/api/spotify/login`.
 */
export class SpotifyReauthRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpotifyReauthRequiredError";
  }
}

// Simple in-memory cache for the token
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

export async function getSpotifyToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }

  // Get the stored refresh token from Notion
  const dataSourceId = await getDataSourceId(process.env.SPOTIFY_TOKEN_DATABASE_ID!);
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "Name",
      title: {
        equals: "Spotify Refresh Token",
      },
    },
  });

  if (!response.results.length) {
    throw new Error("No Spotify refresh token found in Notion");
  }

  const page = response.results[0];
  if (!("properties" in page)) {
    throw new Error("Invalid page response from Notion");
  }

  const valueProperty = page.properties["Value"];
  if (!("rich_text" in valueProperty)) {
    throw new Error("Invalid property type in Notion response");
  }

  const richTextArray = valueProperty.rich_text as RichTextItemResponse[];
  if (!richTextArray.length) {
    throw new Error("No rich text content found in Notion response");
  }

  const refreshToken = richTextArray[0].plain_text;

  // Exchange refresh token for new access token
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
        "base64",
      )}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!tokenResponse.ok) {
    const errorBody = (await tokenResponse.json().catch(() => null)) as {
      error?: string;
      error_description?: string;
    } | null;

    // Spotify returns `invalid_grant` once a refresh token expires or is
    // revoked. Per Spotify guidance: discard the stored token (do not retry)
    // and require the user to sign in again.
    if (errorBody?.error === "invalid_grant") {
      cachedToken = null;
      await notion.pages.update({ page_id: page.id, archived: true });
      throw new SpotifyReauthRequiredError(
        errorBody.error_description ||
          "Spotify refresh token is invalid or expired. Re-authorize at /api/spotify/login.",
      );
    }

    throw new Error(
      `Failed to refresh Spotify token: ${tokenResponse.status} ${
        errorBody?.error ?? tokenResponse.statusText
      }`,
    );
  }

  const data: SpotifyTokenResponse = await tokenResponse.json();

  // Update the refresh token in Notion if a new one was provided
  if (data.refresh_token) {
    await notion.pages.update({
      page_id: page.id,
      properties: {
        Value: {
          rich_text: [
            {
              text: {
                content: data.refresh_token,
              },
            },
          ],
        },
      },
    });
  }

  // Cache the new token with an expiry time (5 minutes before actual expiry)
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return data.access_token;
}

export function getSpotifyAuthUrl(): string {
  const scopes = ["user-read-recently-played", "user-top-read", "user-read-playback-state"].join(
    " ",
  );

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: scopes,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<void> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
        "base64",
      )}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to exchange code for token: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const data: SpotifyTokenResponse = await response.json();

  // Store the refresh token in Notion
  const pageData = {
    parent: { database_id: process.env.SPOTIFY_TOKEN_DATABASE_ID! },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: "Spotify Refresh Token",
            },
          },
        ],
      },
      Value: {
        rich_text: [
          {
            text: {
              content: data.refresh_token,
            },
          },
        ],
      },
    },
  };

  await notion.pages.create(pageData as any);
}
