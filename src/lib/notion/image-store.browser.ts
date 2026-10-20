import type { PersistImageDeps } from "./persist-images";

function serverOnly(): never {
  throw new Error("Notion image persistence runs on the server only");
}

/** Browser stand-in for `image-store.ts`; Notion reads never run in the browser. */
export const defaultPersistImageDeps: PersistImageDeps = {
  store: { exists: serverOnly, put: serverOnly, publicUrl: serverOnly },
  download: serverOnly,
  optimize: serverOnly,
  isEnabled: () => false,
};
