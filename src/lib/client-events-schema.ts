import { z } from "zod";

import type { ClientEventFieldMap, ClientEventName } from "@/lib/client-events";

const shortText = z.string().trim().min(1).max(200);
const contentType = z.enum([
  "writing",
  "til",
  "computer",
  "ama",
  "design_details",
  "app_dissection",
  "hn_post",
  "guide",
]);
const empty = z.object({}).strict();

const schemas = {
  "content.viewed": z.object({ content_type: contentType, content_id: shortText }).strict(),
  "content.read_complete": z
    .object({
      content_type: contentType,
      content_id: shortText,
      seconds_on_page: z.number().int().min(0).max(86_400),
    })
    .strict(),
  "outbound.clicked": z
    .object({
      url: z.string().url().max(2000),
      item_type: shortText.optional(),
      item_id: shortText.optional(),
      item_name: shortText.optional(),
    })
    .strict(),
  "filter.changed": z
    .object({
      surface: z.enum(["sites", "stack"]),
      filter: z.enum(["tag", "status", "platform", "view", "sort"]),
      value: shortText,
    })
    .strict(),
  "command_menu.opened": empty,
  "command_menu.selected": z
    .object({ query: z.string().trim().max(100), destination: shortText })
    .strict(),
  "hn.cli_command_copied": empty,
  "activity.item_clicked": z
    .object({ href: z.string().min(1).max(2000), external: z.boolean() })
    .strict(),
} satisfies { [E in ClientEventName]: z.ZodType<ClientEventFieldMap[E]> };

const envelopeSchema = z.object({
  event: z.enum(Object.keys(schemas) as [ClientEventName, ...ClientEventName[]]),
  data: z.unknown(),
  path: z.string().startsWith("/").max(500),
  referrer: z.string().max(253).optional(),
});

export type ParsedClientEvent = {
  [E in ClientEventName]: {
    event: E;
    data: ClientEventFieldMap[E];
    path: string;
    referrer?: string;
  };
}[ClientEventName];

export function parseClientEvent(input: unknown): ParsedClientEvent | null {
  const envelope = envelopeSchema.safeParse(input);
  if (!envelope.success) return null;
  const data = schemas[envelope.data.event].safeParse(envelope.data.data);
  if (!data.success) return null;
  return { ...envelope.data, data: data.data } as ParsedClientEvent;
}
