import { atomWithStorage } from "jotai/utils";

export const hnSubscribedAtom = atomWithStorage("hn-subscribed", false);
