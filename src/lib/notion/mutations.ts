import { notion } from "./client";

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
      Name: {
        title: [{ text: { content: data.name } }],
      },
    };

    if (data.slug) {
      properties.Slug = {
        rich_text: [{ text: { content: data.slug } }],
      };
    }

    if (data.description) {
      properties.Description = {
        rich_text: [{ text: { content: data.description } }],
      };
    }

    if (data.image) {
      properties.Image = {
        url: data.image,
      };
    }

    if (data.url) {
      properties.URL = {
        url: data.url,
      };
    }

    if (data.platforms && data.platforms.length > 0) {
      properties.Platforms = {
        multi_select: data.platforms.map((platform) => ({ name: platform })),
      };
    }

    if (data.status) {
      properties.Status = {
        select: { name: data.status },
      };
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
      properties.Name = {
        title: [{ text: { content: data.name } }],
      };
    }

    if (data.slug) {
      properties.Slug = {
        rich_text: [{ text: { content: data.slug } }],
      };
    }

    if (data.description !== undefined) {
      properties.Description = {
        rich_text: data.description ? [{ text: { content: data.description } }] : [],
      };
    }

    if (data.image !== undefined) {
      if (data.image) {
        properties.Image = {
          url: data.image,
        };
      } else {
        properties.Image = null;
      }
    }

    if (data.url !== undefined) {
      if (data.url) {
        properties.URL = {
          url: data.url,
        };
      } else {
        properties.URL = null;
      }
    }

    if (data.platforms !== undefined) {
      if (data.platforms.length > 0) {
        properties.Platforms = {
          multi_select: data.platforms.map((platform) => ({ name: platform })),
        };
      } else {
        properties.Platforms = {
          multi_select: [],
        };
      }
    }

    if (data.status) {
      properties.Status = {
        select: { name: data.status },
      };
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
    Name: { title: [{ text: { content: title } }] },
    Status: { select: { name: "Unanswered" } },
  };

  if (description) {
    properties.Description = {
      rich_text: [{ text: { content: description } }],
    };
  }

  return notion.pages.create({
    parent: { database_id: databaseId },
    properties: properties as any,
  });
}
