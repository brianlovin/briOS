"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { getAllNavigationItems } from "@/config/navigation";

export function CommandMenu() {
  const [value, setValue] = React.useState("linear");
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Memoize navigation items to avoid recomputing on every render
  const navigationItems = React.useMemo(() => getAllNavigationItems(), []);

  // Global hotkey to open command menu
  useHotkeys(
    "mod+k",
    (e) => {
      e.preventDefault();
      setOpen(!open);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
  );

  // Close on Escape
  useHotkeys(
    "escape",
    () => {
      if (open) {
        setOpen(false);
      }
    },
    {
      enableOnFormTags: true,
      enabled: open,
    },
  );

  React.useEffect(() => {
    if (open) {
      // Reset value when opening
      setValue("linear");
      // Focus input after a brief delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-white/80 dark:bg-black/80" />
        <Dialog.Content className="fixed top-16 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 transform">
          <Dialog.Title className="sr-only">Command menu</Dialog.Title>
          <div className="dark:shadow-contrast bg-elevated relative w-full max-w-lg rounded-xl border shadow-md dark:border-0">
            <Command value={value} onValueChange={(v: string) => setValue(v)} className="w-full">
              <Command.Input
                ref={inputRef}
                placeholder="Jump to..."
                className="text-secondary w-full border-b bg-transparent p-3 text-sm placeholder-neutral-500 focus:outline-none"
              />
              <Command.List ref={listRef} className="max-h-96 overflow-y-auto p-2">
                <Command.Empty className="text-tertiary py-6 text-center text-sm">
                  No results found
                </Command.Empty>

                <Command.Group>
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Item
                        key={item.id}
                        value={item.label}
                        keywords={item.keywords}
                        onSelect={() => handleNavigate(item.href)}
                      >
                        <IconComponent />
                        {item.label}
                      </Item>
                    );
                  })}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Item({
  children,
  value,
  keywords,
  onSelect,
}: {
  children: React.ReactNode;
  value: string;
  keywords?: string[];
  onSelect?: () => void;
}) {
  return (
    <Command.Item
      value={value}
      keywords={keywords}
      onSelect={onSelect}
      className="text-primary data-[selected=true]:bg-tertiary flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm select-none dark:data-[selected=true]:bg-white/10"
    >
      {children}
    </Command.Item>
  );
}
