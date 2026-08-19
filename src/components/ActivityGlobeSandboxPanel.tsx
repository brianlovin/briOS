"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/Button";
import { DialSlider } from "@/components/ui/DialSlider";
import {
  type ActivityGlobeConfig,
  DEFAULT_ACTIVITY_GLOBE_CONFIG,
} from "@/lib/activity-globe-config";

export function SandboxHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-quaternary mb-1.5 ml-1 flex items-center gap-2 text-xs font-medium">
      <span className="shrink-0">{children}</span>
      <span className="bg-secondary h-px min-w-0 flex-1" aria-hidden />
    </p>
  );
}

type SliderDef = {
  key: keyof ActivityGlobeConfig;
  label: string;
  min: number;
  max: number;
  step: number;
};

const COBE_SLIDERS: SliderDef[] = [
  { key: "diffuse", label: "Diffuse", min: 0.2, max: 3, step: 0.05 },
  { key: "mapSamples", label: "Map samples", min: 2000, max: 32000, step: 500 },
  { key: "mapBrightness", label: "Map brightness (light)", min: 1, max: 12, step: 0.1 },
  { key: "mapBrightnessDark", label: "Map brightness (dark)", min: 1, max: 12, step: 0.1 },
  { key: "mapBaseBrightness", label: "Ocean base", min: 0, max: 1, step: 0.01 },
  { key: "scale", label: "Scale", min: 0.6, max: 1.2, step: 0.01 },
  { key: "offsetX", label: "Offset X", min: -120, max: 120, step: 1 },
  { key: "offsetY", label: "Offset Y", min: -120, max: 120, step: 1 },
  { key: "opacity", label: "Globe opacity", min: 0.2, max: 1, step: 0.01 },
  { key: "markerElevation", label: "Marker elevation", min: 0, max: 0.12, step: 0.005 },
];

const MARKER_SLIDERS: SliderDef[] = [
  { key: "markerDotPx", label: "Dot size (px)", min: 3, max: 16, step: 1 },
  { key: "markerBlurPx", label: "Horizon blur (px)", min: 0, max: 20, step: 1 },
  { key: "markerFadeMs", label: "Horizon fade (ms)", min: 0, max: 800, step: 25 },
  { key: "markerRecentCount", label: "Recent markers", min: 1, max: 16, step: 1 },
  { key: "markerAgeShrink", label: "Age size shrink", min: 0.04, max: 0.25, step: 0.01 },
  { key: "focusPulseScale", label: "Focus size pulse", min: 0, max: 1.5, step: 0.05 },
  { key: "focusMs", label: "Focus duration (ms)", min: 400, max: 2400, step: 50 },
];

const RGB_FIELDS: Array<{
  key: keyof ActivityGlobeConfig;
  label: string;
}> = [
  { key: "markerColor", label: "Marker color" },
  { key: "lightBaseColor", label: "Light base" },
  { key: "lightGlowColor", label: "Light glow" },
  { key: "darkBaseColor", label: "Dark base" },
  { key: "darkGlowColor", label: "Dark glow" },
];

function RgbControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: [number, number, number];
  onChange: (value: [number, number, number]) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-tertiary text-[11px]">{label}</span>
      <div className="grid grid-cols-3 gap-1">
        {(["R", "G", "B"] as const).map((channel, index) => (
          <input
            key={channel}
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={value[index]?.toFixed(2) ?? "0"}
            onChange={(event) => {
              const next = [...value] as [number, number, number];
              next[index] = Number(event.target.value);
              onChange(next);
            }}
            className="border-secondary bg-primary text-primary rounded border px-1.5 py-1 font-mono text-[11px] tabular-nums"
            aria-label={`${label} ${channel}`}
          />
        ))}
      </div>
    </div>
  );
}

function GlobeSliderSection({
  title,
  sliders,
  config,
  onPatch,
}: {
  title?: string;
  sliders: SliderDef[];
  config: ActivityGlobeConfig;
  onPatch: (patch: Partial<ActivityGlobeConfig>) => void;
}) {
  return (
    <div>
      {title ? <SandboxHeading>{title}</SandboxHeading> : null}
      <div className="flex flex-col gap-1.5">
        {sliders.map((def) => (
          <DialSlider
            key={def.key}
            label={def.label}
            value={config[def.key] as number}
            min={def.min}
            max={def.max}
            step={def.step}
            onChange={(value) => onPatch({ [def.key]: value })}
          />
        ))}
      </div>
    </div>
  );
}

export function ActivityGlobeSandboxPanel({
  config,
  onChange,
}: {
  config: ActivityGlobeConfig;
  onChange: (config: ActivityGlobeConfig) => void;
}) {
  const [copied, setCopied] = useState(false);

  const patch = useCallback(
    (partial: Partial<ActivityGlobeConfig>) => {
      onChange({ ...config, ...partial });
    },
    [config, onChange],
  );

  const copyConfig = useCallback(async () => {
    const payload = JSON.stringify(config, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy globe config:", payload);
    }
  }, [config]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex flex-col gap-5">
        <GlobeSliderSection title="COBE" sliders={COBE_SLIDERS} config={config} onPatch={patch} />

        <div>
          <SandboxHeading>Colors (0–1 RGB)</SandboxHeading>
          <div className="flex flex-col gap-2">
            {RGB_FIELDS.map(({ key, label }) => (
              <RgbControl
                key={key}
                label={label}
                value={config[key] as [number, number, number]}
                onChange={(value) => patch({ [key]: value })}
              />
            ))}
          </div>
        </div>

        <GlobeSliderSection
          title="Markers (CSS fade)"
          sliders={MARKER_SLIDERS}
          config={config}
          onPatch={patch}
        />

        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="xs"
            variant="outline"
            onClick={() => onChange(DEFAULT_ACTIVITY_GLOBE_CONFIG)}
          >
            Reset
          </Button>
          <Button type="button" size="xs" variant="outline" onClick={copyConfig}>
            {copied ? "Copied" : "Copy JSON"}
          </Button>
        </div>
      </div>
    </div>
  );
}
