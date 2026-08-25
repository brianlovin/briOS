import {
  collectMedia,
  type MediaBlockLike,
  type MediaView,
} from "../optimize-writing-images/media";

export type { MediaBlockLike, MediaView };

export const FIELD_NOTE_MARK = "field-note";
export const MAX_IMAGES_PER_RUN = 8;

export function captionPlainText(caption: unknown[] | undefined): string {
  if (!Array.isArray(caption)) return "";

  return caption
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const record = item as { plain_text?: unknown; text?: { content?: unknown } };
      if (typeof record.plain_text === "string") return record.plain_text;
      if (typeof record.text?.content === "string") return record.text.content;
      return "";
    })
    .join("");
}

export function isFieldNoteCaption(caption: unknown[] | undefined): boolean {
  return captionPlainText(caption).includes(FIELD_NOTE_MARK);
}

export function collectJournalImages(blocks: MediaBlockLike[]): {
  pending: MediaView[];
  skipped: MediaView[];
  remaining: number;
} {
  const images = collectMedia(blocks).filter((item) => item.kind === "image");
  const skipped = images.filter((item) => isFieldNoteCaption(item.file.caption));
  const eligible = images.filter((item) => !isFieldNoteCaption(item.file.caption));

  return {
    pending: eligible.slice(0, MAX_IMAGES_PER_RUN),
    skipped,
    remaining: Math.max(0, eligible.length - MAX_IMAGES_PER_RUN),
  };
}

export function fieldNoteBlockUpdate(media: MediaView, r2Url: string) {
  return {
    block_id: media.id,
    image: {
      external: { url: r2Url },
      caption: [{ type: "text", text: { content: FIELD_NOTE_MARK } }],
    },
  };
}
