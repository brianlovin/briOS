import { atomWithStorage } from "jotai/utils";

import type { ViewMode } from "@/components/good-websites/ViewToggle";

export const sitesViewModeAtom = atomWithStorage<ViewMode>("sites-view-mode", "list");
