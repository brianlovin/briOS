"use client";

import { useEffect, useState } from "react";

import { DA1_CODES, FEATURE_SEQUENCES, TERM_CAPABILITIES } from "../lib/sequences";
import { SubsectionLabel, TerminalWindow } from "../ui";

const FEATURES = FEATURE_SEQUENCES;

type QueryPhase = "idle" | "sending" | "responding" | "done";

export function CapabilityDiscoveryDemo() {
  const [selectedTerm, setSelectedTerm] = useState("xterm-256color");
  const [queryPhase, setQueryPhase] = useState<QueryPhase>("idle");
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set());

  const capabilities = TERM_CAPABILITIES[selectedTerm]!;

  const runQuery = () => {
    if (queryPhase !== "idle" && queryPhase !== "done") return;
    setQueryPhase("sending");
  };

  useEffect(() => {
    if (queryPhase === "sending") {
      const timer = setTimeout(() => setQueryPhase("responding"), 800);
      return () => clearTimeout(timer);
    }
    if (queryPhase === "responding") {
      const timer = setTimeout(() => setQueryPhase("done"), 800);
      return () => clearTimeout(timer);
    }
  }, [queryPhase]);

  const toggleFeature = (featureId: string) => {
    setEnabledFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-10">
      {/* Section 1: TERM Variable */}
      <div className="space-y-4">
        <SubsectionLabel>The TERM Variable</SubsectionLabel>

        <TerminalWindow>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-quaternary">$</span>
                <span className="text-secondary">TERM</span>
                <span className="text-quaternary">=</span>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="bg-secondary border-primary text-secondary hover:border-primary focus:border-primary cursor-pointer border px-2 py-1 font-mono text-sm focus:outline-none"
                >
                  {Object.keys(TERM_CAPABILITIES).map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-tertiary text-sm">{capabilities.description}</span>
            </div>

            {/* Capability Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
              <CapabilityItem
                label="Colors"
                value={capabilities.colors === 0 ? "None" : capabilities.colors.toString()}
                supported={capabilities.colors > 0}
              />
              <CapabilityItem
                label="Mouse"
                value={capabilities.mouse ? "Yes" : "No"}
                supported={capabilities.mouse}
              />
              <CapabilityItem
                label="Alt Screen"
                value={capabilities.altScreen ? "Yes" : "No"}
                supported={capabilities.altScreen}
              />
              <CapabilityItem
                label="Unicode"
                value={capabilities.unicode ? "Yes" : "No"}
                supported={capabilities.unicode}
              />
            </div>
          </div>
        </TerminalWindow>

        <p className="text-tertiary text-sm">
          Programs check the <code className="text-secondary">TERM</code> environment variable to
          look up capabilities in the terminfo database. It's just a string—the terminal doesn't
          enforce it.
        </p>
      </div>

      {/* Section 2: Query/Response */}
      <div className="space-y-4">
        <SubsectionLabel>Query & Response</SubsectionLabel>

        <TerminalWindow>
          <div className="space-y-4">
            {/* Query visualization */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="flex-1 text-center">
                <div className="text-quaternary mb-2 text-xs uppercase">Program</div>
                <div className="border-primary text-tertiary mx-auto flex h-12 w-12 items-center justify-center border">
                  vim
                </div>
              </div>

              <div className="relative h-16 flex-1">
                {/* Query arrow */}
                <div
                  className={`absolute top-2 right-0 left-0 flex items-center transition-opacity duration-300 ${
                    queryPhase === "sending" ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <div className="border-primary flex-1 border-t border-dashed" />
                  <div className="text-primary px-2 font-mono text-xs whitespace-nowrap">ESC[c</div>
                  <div className="text-primary">→</div>
                </div>

                {/* Response arrow */}
                <div
                  className={`absolute right-0 bottom-2 left-0 flex items-center transition-opacity duration-300 ${
                    queryPhase === "responding" || queryPhase === "done"
                      ? "opacity-100"
                      : "opacity-30"
                  }`}
                >
                  <div className="text-secondary">←</div>
                  <div className="text-secondary px-2 font-mono text-xs whitespace-nowrap">
                    ESC[?64;1;4;22c
                  </div>
                  <div className="border-secondary flex-1 border-t border-dashed" />
                </div>
              </div>

              <div className="flex-1 text-center">
                <div className="text-quaternary mb-2 text-xs uppercase">Terminal</div>
                <div className="border-primary text-tertiary mx-auto flex h-12 w-12 items-center justify-center border">
                  tty
                </div>
              </div>
            </div>

            {/* Response decoder */}
            {(queryPhase === "responding" || queryPhase === "done") && (
              <div className="bg-secondary border-primary space-y-2 border p-3">
                <div className="text-quaternary text-xs uppercase">Response Decoded</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-mono">64</span>
                    <span className="text-tertiary">VT420</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-mono">1</span>
                    <span className="text-tertiary">{DA1_CODES["1"]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-mono">4</span>
                    <span className="text-tertiary">{DA1_CODES["4"]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-mono">22</span>
                    <span className="text-tertiary">{DA1_CODES["22"]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Query button */}
            <div className="flex justify-center">
              <button
                onClick={runQuery}
                disabled={queryPhase === "sending" || queryPhase === "responding"}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  queryPhase === "sending" || queryPhase === "responding"
                    ? "bg-tertiary cursor-not-allowed text-white dark:text-neutral-950"
                    : "bg-primary hover:bg-primary text-white dark:text-neutral-950"
                }`}
              >
                {queryPhase === "sending"
                  ? "Sending..."
                  : queryPhase === "responding"
                    ? "Receiving..."
                    : queryPhase === "done"
                      ? "Send Again"
                      : "Send DA1 Query"}
              </button>
            </div>
          </div>
        </TerminalWindow>

        <p className="text-tertiary text-sm">
          Programs can also query the terminal directly. DA1 (
          <code className="text-secondary">ESC[c</code>) asks "what are you?" and the terminal
          responds with capability codes.
        </p>
      </div>

      {/* Section 3: Feature Toggles */}
      <div className="space-y-4">
        <SubsectionLabel>Enabling Features</SubsectionLabel>

        <TerminalWindow>
          <div className="space-y-3">
            {FEATURES.map((feature) => {
              const isEnabled = enabledFeatures.has(feature.id);
              return (
                <div
                  key={feature.id}
                  className="border-primary/50 flex flex-col gap-2 border-b py-2 last:border-0 sm:flex-row sm:items-center sm:gap-4"
                >
                  <label className="flex flex-shrink-0 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => toggleFeature(feature.id)}
                      className="accent-primary h-4 w-4"
                    />
                    <span
                      className={`text-sm font-medium ${isEnabled ? "text-primary" : "text-tertiary"}`}
                    >
                      {feature.name}
                    </span>
                  </label>

                  <code
                    className={`px-2 py-1 font-mono text-xs ${
                      isEnabled ? "text-primary bg-primary/5" : "text-quaternary bg-secondary"
                    }`}
                  >
                    {isEnabled ? feature.enable : feature.disable}
                  </code>

                  <span className="text-quaternary text-xs sm:ml-auto">{feature.description}</span>
                </div>
              );
            })}
          </div>
        </TerminalWindow>

        <p className="text-tertiary text-sm">
          Features are off by default. Programs send escape sequences to enable them—that's why vim
          sends <code className="text-secondary">^[[?1049h</code> at startup (to enter alternate
          screen) and <code className="text-secondary">^[[?1049l</code> when you quit.
        </p>
      </div>
    </div>
  );
}

function CapabilityItem({
  label,
  value,
  supported,
}: {
  label: string;
  value: string;
  supported: boolean;
}) {
  return (
    <div
      className={`border px-3 py-2 ${supported ? "border-primary/50 bg-primary/5" : "border-primary bg-secondary"}`}
    >
      <div className="text-quaternary text-xs uppercase">{label}</div>
      <div className={`text-sm font-medium ${supported ? "text-primary" : "text-quaternary"}`}>
        {value}
      </div>
    </div>
  );
}
