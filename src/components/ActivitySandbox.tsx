"use client";

import { useCallback, useRef, useState } from "react";

import { ActivityFeed } from "@/components/ActivityFeed";
import { ActivityGlobeSandboxPanel } from "@/components/ActivityGlobeSandboxPanel";
import { Button } from "@/components/ui/Button";
import type { ActivityEvent } from "@/lib/activity";
import {
  type ActivityGlobeConfig,
  DEFAULT_ACTIVITY_GLOBE_CONFIG,
} from "@/lib/activity-globe-config";
import { SANDBOX_SCENARIOS, SANDBOX_SINGLES } from "@/lib/activity-sandbox";
import { cn } from "@/lib/utils";

const INJECT_DELAY_MS = 600;

type SandboxTab = "events" | "globe";

export function ActivitySandbox() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [count, setCount] = useState(0);
  const [globeConfig, setGlobeConfig] = useState<ActivityGlobeConfig>(
    DEFAULT_ACTIVITY_GLOBE_CONFIG,
  );
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<SandboxTab>("events");
  const [watch, setWatch] = useState(true);
  const [pending, setPending] = useState(false);
  const timerRef = useRef<number | null>(null);

  const inject = useCallback(
    (incoming: ActivityEvent[]) => {
      if (incoming.length === 0) return;
      const apply = () => {
        setEvents((current) => [...incoming, ...current]);
        setCount((current) => current + incoming.length);
        setPending(false);
      };

      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (!watch) {
        apply();
        return;
      }

      setPending(true);
      timerRef.current = window.setTimeout(apply, INJECT_DELAY_MS);
    },
    [watch],
  );

  const clear = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setPending(false);
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
        <Button
          type="button"
          size="xs"
          variant="secondary"
          className="pointer-events-auto shadow-sm"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? "Hide sandbox" : "Sandbox"}
        </Button>
        {open ? (
          <div className="bg-primary border-secondary pointer-events-auto flex max-h-[min(70vh,42rem)] w-full flex-col rounded-xl border p-3 shadow-lg">
            <div className="mb-3 flex items-center gap-1">
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
                  variant={tab === id ? "secondary" : "ghost"}
                  className={cn(tab !== id && "text-tertiary")}
                  onClick={() => setTab(id)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {tab === "events" ? (
              <>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-secondary text-xs">
                    {pending ? "Watch the feed…" : `${count.toLocaleString("en-US")} fake events`}
                  </p>
                  <label className="text-tertiary flex cursor-pointer items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      checked={watch}
                      onChange={(event) => setWatch(event.target.checked)}
                      className="accent-current"
                    />
                    Pause before inject
                  </label>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                  <p className="text-quaternary mb-1.5 text-[11px] font-medium tracking-wide uppercase">
                    Scenarios
                  </p>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {Object.entries(SANDBOX_SCENARIOS).map(([id, scenario]) => (
                      <Button
                        key={id}
                        type="button"
                        size="xs"
                        variant="outline"
                        title={scenario.hint}
                        disabled={pending}
                        onClick={() => inject(scenario.build())}
                      >
                        {scenario.label}
                      </Button>
                    ))}
                  </div>
                  <p className="text-quaternary mb-1.5 text-[11px] font-medium tracking-wide uppercase">
                    Singles
                  </p>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {SANDBOX_SINGLES.map((single) => (
                      <Button
                        key={single.id}
                        type="button"
                        size="xs"
                        variant="ghost"
                        disabled={pending}
                        onClick={() => inject([single.build()])}
                      >
                        {single.label}
                      </Button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    size="xs"
                    variant="ghost"
                    className={cn("text-tertiary")}
                    onClick={clear}
                  >
                    Clear
                  </Button>
                </div>
              </>
            ) : (
              <ActivityGlobeSandboxPanel config={globeConfig} onChange={setGlobeConfig} />
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
