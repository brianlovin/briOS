"use client";

import React from "react";

import { ListDetailLayout } from "@/components/ListDetailLayout";
import { ListDetailWrapper } from "@/components/ListDetailWrapper";

import { ComputerList } from "./ComputerList";

export function ComputerDetailLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ListDetailWrapper>
      <ListDetailLayout backHref="/computer" list={<ComputerList />}>
        {children}
      </ListDetailLayout>
    </ListDetailWrapper>
  );
}
