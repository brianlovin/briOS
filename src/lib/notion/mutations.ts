import { notion } from "./client";
import { writeMultiSelect, writeRichText, writeSelect, writeTitle, writeUrl } from "./properties";

// ===== Stack Mutations =====

export async function createStackItem(data: {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  url?: string;
  platforms?: string[];
  status?: string;
}) {
  try {
    const databaseId = process.env.NOTION_STACK_DATABASE_ID || "";

    // Build properties object based on the schema
    const properties: Record<string, unknown> = {
      Name: writeTitle(data.name),
    };

    if (data.slug) {
      properties.Slug = writeRichText(data.slug);
    }

    if (data.description) {
      properties.Description = writeRichText(data.description);
    }

    if (data.image) {
      properties.Image = writeUrl(data.image);
    }

    if (data.url) {
      properties.URL = writeUrl(data.url);
    }

    if (data.platforms && data.platforms.length > 0) {
      properties.Platforms = writeMultiSelect(data.platforms);
    }

    if (data.status) {
      properties.Status = writeSelect(data.status);
    }

    // Build the page creation object
    const pageData: Record<string, unknown> = {
      parent: { database_id: databaseId },
      properties,
    };

    // Set page icon if image is provided
    if (data.image) {
      pageData.icon = {
        type: "external",
        external: { url: data.image },
      };
    }

    const response = await notion.pages.create(pageData as any);

    return response;
  } catch (error) {
    console.error("Error creating stack item:", error);
    throw error;
  }
}

export async function updateStackItem(
  pageId: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    url?: string;
    platforms?: string[];
    status?: string;
  },
) {
  try {
    // Build properties object based on the schema
    const properties: Record<string, unknown> = {};

    if (data.name) {
      properties.Name = writeTitle(data.name);
    }

    if (data.slug) {
      properties.Slug = writeRichText(data.slug);
    }

    if (data.description !== undefined) {
      properties.Description = writeRichText(data.description);
    }

    if (data.image !== undefined) {
      properties.Image = data.image ? writeUrl(data.image) : null;
    }

    if (data.url !== undefined) {
      properties.URL = data.url ? writeUrl(data.url) : null;
    }

    if (data.platforms !== undefined) {
      properties.Platforms = writeMultiSelect(data.platforms);
    }

    if (data.status) {
      properties.Status = writeSelect(data.status);
    }

    // Set page icon if image is provided
    const icon =
      data.image !== undefined
        ? data.image
          ? {
              type: "external" as const,
              external: { url: data.image },
            }
          : null
        : undefined;

    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties as any,
      ...(icon !== undefined && { icon }),
    });

    return response;
  } catch (error) {
    console.error("Error updating stack item:", error);
    throw error;
  }
}

// ===== AMA Mutations =====

export async function createAmaQuestion(title: string, description?: string) {
  const databaseId = process.env.NOTION_AMA_DATABASE_ID || "";
  const properties: Record<string, unknown> = {
    Name: writeTitle(title),
    Status: writeSelect("Unanswered"),
  };

  if (description) {
    properties.Description = writeRichText(description);
  }

  return notion.pages.create({
    parent: { database_id: databaseId },
    properties: properties as any,
  });
}

// ===== Writing Mutations =====

export async function updateWritingShortId(pageId: string, shortId: string) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: {
        "Short ID": writeRichText(shortId),
      } as any,
    });

    return response;
  } catch (error) {
    console.error(`Error updating short ID for page ${pageId}:`, error);
    throw error;
  }
}
