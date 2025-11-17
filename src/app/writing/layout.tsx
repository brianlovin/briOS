import React from "react";

export default async function WritingLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-w-0 flex-1 flex-col">{children}</div>;
}
