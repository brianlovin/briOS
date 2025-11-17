import React from "react";

import { AppDissection } from "@/components/icons/AppDissection";
import { Components } from "@/components/icons/Components";
import { DoubleChatBubble } from "@/components/icons/DoubleChatBubble";
import { FileText2 } from "@/components/icons/FileText2";
import { Headphones3 } from "@/components/icons/Headphones3";
import { Home } from "@/components/icons/Home";
import { Triangle } from "@/components/icons/Triangle";
import { IconProps } from "@/components/icons/types";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<IconProps>;
  keywords?: string[];
  isActive?: (pathname: string) => boolean;
  section?: "main" | "projects";
}

export const navigationItems: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: Home,
    keywords: ["home", "dashboard"],
    isActive: (pathname) => pathname === "/",
    section: "main",
  },
  {
    id: "writing",
    label: "Writing",
    href: "/writing",
    icon: FileText2,
    keywords: ["writing", "blog", "posts"],
    isActive: (pathname) => pathname.startsWith("/writing"),
    section: "main",
  },
  {
    id: "better-hn",
    label: "Hacker News",
    href: "/hn",
    icon: Triangle,
    keywords: ["hackernews", "hn", "news"],
    isActive: (pathname) => pathname.startsWith("/hn"),
    section: "projects",
  },

  {
    id: "app-dissection",
    label: "App Dissection",
    href: "/app-dissection",
    icon: AppDissection,
    keywords: ["app", "dissection", "analysis"],
    isActive: (pathname) => pathname.startsWith("/app-dissection"),
    section: "projects",
  },
  {
    id: "stack",
    label: "My Stack",
    href: "/stack",
    icon: Components,
    keywords: ["stack", "tools", "tech"],
    isActive: (pathname) => pathname.startsWith("/stack"),
    section: "projects",
  },
  {
    id: "ama",
    label: "AMA",
    href: "/ama",
    icon: DoubleChatBubble,
    keywords: ["ama", "questions", "ask"],
    isActive: (pathname) => pathname.startsWith("/ama"),
    section: "projects",
  },

  {
    id: "music",
    label: "Listening",
    href: "/listening-history",
    icon: Headphones3,
    keywords: ["listening", "music", "audio"],
    isActive: (pathname) => pathname === "/listening-history",
    section: "projects",
  },
];

// Helper functions to filter navigation items
export const getMainNavigationItems = () =>
  navigationItems.filter((item) => item.section === "main");

export const getProjectNavigationItems = () =>
  navigationItems.filter((item) => item.section === "projects");

export const getAllNavigationItems = () => navigationItems;
