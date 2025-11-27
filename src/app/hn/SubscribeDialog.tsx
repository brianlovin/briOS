"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

import { SubscribeForm } from "./SubscribeForm";

export function SubscribeDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm" className="ml-auto">
          Daily digest email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>HN Daily Digest</DialogTitle>
          <DialogDescription>
            Get a simple email every day with the top stories from Hacker News. Unsubscribe at any
            time.
          </DialogDescription>
        </DialogHeader>

        <SubscribeForm
          onComplete={() => {
            setOpen(false);
          }}
          className="py-4"
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
