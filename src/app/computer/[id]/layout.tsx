import type { ReactNode } from "react";

import { ComputerDetailLayoutClient } from "../ComputerDetailLayoutClient";

export default function ComputerDetailLayout({ children }: { children: ReactNode }) {
  return <ComputerDetailLayoutClient>{children}</ComputerDetailLayoutClient>;
}
