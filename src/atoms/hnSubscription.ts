import { atomWithStorage } from "jotai/utils";

export const hnSubscribedAtom = atomWithStorage("hn-subscribed", false);
export const hnCliCopiedAtom = atomWithStorage("hn-cli-copied", false);
