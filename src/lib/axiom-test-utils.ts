import { mock } from "bun:test";

import { resetAxiomForTests } from "@/lib/axiom";

export type IngestedEvent = Record<string, unknown> & { event: string };

/**
 * Replace the Axiom client with an in-memory recorder. Call at module top
 * level (before importing code under test), then `enable()` in beforeEach.
 */
export function installAxiomMock() {
  const ingested: IngestedEvent[] = [];
  const flush = mock(async () => {});

  mock.module("@axiomhq/js", () => ({
    Axiom: class {
      ingest(_dataset: string, events: IngestedEvent[]) {
        ingested.push(...events);
      }
      flush = flush;
    },
  }));

  const previousToken = process.env.AXIOM_TOKEN;

  return {
    flush,
    events: (name?: string) =>
      name ? ingested.filter((event) => event.event === name) : [...ingested],
    enable() {
      ingested.length = 0;
      flush.mockClear();
      process.env.AXIOM_TOKEN = "test-axiom-token";
      resetAxiomForTests();
    },
    disable() {
      ingested.length = 0;
      if (previousToken === undefined) delete process.env.AXIOM_TOKEN;
      else process.env.AXIOM_TOKEN = previousToken;
      resetAxiomForTests();
    },
  };
}
