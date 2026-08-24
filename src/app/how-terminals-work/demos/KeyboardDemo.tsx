"use client";

import { useRef, useState } from "react";

import { SPECIAL_KEYS } from "../lib/sequences";
import { TerminalWindow } from "../ui";

interface KeyInfo {
  key: string;
  bytes: string;
  sequence: string;
  desc: string;
}

export function KeyboardDemo() {
  const [lastKey, setLastKey] = useState<KeyInfo | null>(null);
  const [history, setHistory] = useState<KeyInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const special = SPECIAL_KEYS[e.code] || SPECIAL_KEYS[e.key];
    const keyInfo: KeyInfo = special
      ? {
          key: e.key,
          bytes: special.bytes,
          sequence: special.sequence,
          desc: special.desc,
        }
      : {
          key: e.key,
          bytes: e.key.charCodeAt(0).toString(16).padStart(2, "0"),
          sequence: e.key,
          desc: `Character '${e.key}'`,
        };

    if (special) e.preventDefault();
    setLastKey(keyInfo);
    setHistory((prev) => [keyInfo, ...prev].slice(0, 8));
  };

  return (
    <div className="space-y-6">
      <TerminalWindow>
        <div
          className="flex min-h-[180px] cursor-text flex-col items-center justify-center"
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={inputRef}
            type="text"
            className="pointer-events-none absolute opacity-0"
            onKeyDown={handleKeyDown}
          />
          {lastKey ? (
            <div className="space-y-4 text-center">
              <div className="text-primary text-3xl font-medium">
                {lastKey.key === " " ? "Space" : lastKey.key}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-quaternary mb-1 text-xs uppercase">Bytes</div>
                  <code className="text-secondary">{lastKey.bytes}</code>
                </div>
                <div>
                  <div className="text-quaternary mb-1 text-xs uppercase">Sequence</div>
                  <code className="text-secondary">{lastKey.sequence}</code>
                </div>
              </div>
              <div className="text-tertiary text-sm">{lastKey.desc}</div>
            </div>
          ) : (
            <div className="text-tertiary text-center">
              <div className="mb-1 text-base">Press any key</div>
              <div className="text-quaternary text-sm">Try arrow keys, Enter, Tab, or letters</div>
            </div>
          )}
        </div>
      </TerminalWindow>

      {history.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {history.map((k, i) => (
            <div
              key={i}
              className="border-primary border px-3 py-1.5 text-sm"
              style={{ opacity: 1 - i * 0.1 }}
            >
              <span className="text-primary">{k.key === " " ? "␣" : k.key}</span>
              <span className="text-quaternary mx-2">→</span>
              <code className="text-secondary">{k.bytes}</code>
            </div>
          ))}
        </div>
      )}

      <div className="text-tertiary text-sm">
        When you press an arrow key, your terminal doesn't send "arrow up" — it sends{" "}
        <code className="text-secondary">ESC [ A</code> (three bytes). Programs that don't
        understand this will print <code className="text-secondary">^[[A</code> literally.
      </div>
    </div>
  );
}
