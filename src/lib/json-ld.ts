/**
 * Serialize structured data for a `<script type="application/ld+json">` tag.
 * `JSON.stringify` leaves `<` alone, so a value containing `</script>` would
 * end the tag early. Escaping `<` as `<` keeps the JSON identical once
 * parsed while making that impossible.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
