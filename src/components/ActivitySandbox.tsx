"use client";

import { useCallback, useState } from "react";

import { ActivityFeed } from "@/components/ActivityFeed";
import { ActivityGlobeSandboxPanel, SandboxHeading } from "@/components/ActivityGlobeSandboxPanel";
import { Close } from "@/components/icons/Close";
import { Button } from "@/components/ui/Button";
import type { ActivityEvent } from "@/lib/activity";
import {
  type ActivityGlobeConfig,
  DEFAULT_ACTIVITY_GLOBE_CONFIG,
} from "@/lib/activity-globe-config";
import { SANDBOX_SCENARIOS, SANDBOX_SINGLES } from "@/lib/activity-sandbox";
import { cn } from "@/lib/utils";

type SandboxTab = "events" | "globe";

export function ActivitySandbox() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [count, setCount] = useState(0);
  const [globeConfig, setGlobeConfig] = useState<ActivityGlobeConfig>(
    DEFAULT_ACTIVITY_GLOBE_CONFIG,
  );
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<SandboxTab>("events");

  const inject = useCallback((incoming: ActivityEvent[]) => {
    if (incoming.length === 0) return;
    setEvents((current) => [...incoming, ...current]);
    setCount((current) => current + incoming.length);
  }, []);

  const clear = useCallback(() => {
    setEvents([]);
    setCount(0);
  }, []);

  return (
    <>
      <ActivityFeed
        initialEvents={[]}
        initialCount={0}
        events={events}
        count={count}
        globeConfig={globeConfig}
      />
      <div className="pointer-events-none fixed bottom-4 left-4 z-30 flex max-w-[min(24rem,calc(100vw-2rem))] flex-col items-start gap-2">
        {open ? (
          <div className="bg-primary border-secondary pointer-events-auto relative flex max-h-[min(70vh,42rem)] w-full flex-col overflow-hidden rounded-xl border p-3 shadow-lg">
            <button
              type="button"
              className="text-tertiary hover:bg-tertiary hover:text-primary absolute top-0 right-0 flex size-9 items-center justify-center rounded-tr-xl"
              aria-label="Hide sandbox"
              onClick={() => setOpen(false)}
            >
              <Close size={14} strokeWidth={2.25} />
            </button>
            <div className="mb-3 flex items-center pr-8">
              <p className="text-primary text-sm font-medium">Sandbox</p>
            </div>
            <div className="mb-3 flex items-center gap-1.5">
              {(
                [
                  ["events", "Events"],
                  ["globe", "Globe"],
                ] as const
              ).map(([id, label]) => (
                <Button
                  key={id}
                  type="button"
                  size="xs"
                  variant="outline"
                  className={cn(tab !== id && "text-tertiary")}
                  onClick={() => setTab(id)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {tab === "events" ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                <SandboxHeading>Scenarios</SandboxHeading>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {Object.entries(SANDBOX_SCENARIOS).map(([id, scenario]) => (
                    <Button
                      key={id}
                      type="button"
                      size="xs"
                      variant="outline"
                      title={scenario.hint}
                      onClick={() => inject(scenario.build())}
                    >
                      {scenario.label}
                    </Button>
                  ))}
                </div>
                <SandboxHeading>Singles</SandboxHeading>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {SANDBOX_SINGLES.map((single) => (
                    <Button
                      key={single.id}
                      type="button"
                      size="xs"
                      variant="outline"
                      onClick={() => inject([single.build()])}
                    >
                      {single.label}
                    </Button>
                  ))}
                </div>
                <Button type="button" size="xs" variant="outline" onClick={clear}>
                  Clear
                </Button>
              </div>
            ) : (
              <ActivityGlobeSandboxPanel config={globeConfig} onChange={setGlobeConfig} />
            )}
          </div>
        ) : (
          <Button
            type="button"
            size="xs"
            variant="outline"
            className="pointer-events-auto shadow-sm"
            onClick={() => setOpen(true)}
          >
            Sandbox
          </Button>
        )}
      </div>
    </>
  );
}
