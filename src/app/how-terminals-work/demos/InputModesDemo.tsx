"use client";

import { useCallback, useRef, useState } from "react";

import { TerminalWindow } from "../ui";
import { Button, InfoPanel, StepDotsNavigation, SubsectionLabel } from "../ui";

type InputMode = "cooked" | "raw";

type ExplainerStep = "cooked" | "raw" | "difference" | "examples";

const EXPLAINER_STEPS: Record<ExplainerStep, { title: string; description: string }> = {
  cooked: {
    title: "Cooked Mode (Line-Buffered)",
    description:
      "In cooked mode (also called canonical mode), the terminal collects your input into a line buffer. You can edit with backspace, and nothing is sent to the program until you press Enter. This is how your shell normally works.",
  },
  raw: {
    title: "Raw Mode (Character-at-a-Time)",
    description:
      "In raw mode, every keystroke is sent to the program immediately—no buffering, no line editing. The program sees each key the instant you press it. This is how vim, htop, and other interactive programs work.",
  },
  difference: {
    title: "Why Two Modes?",
    description:
      "Your terminal always sends the same bytes—the difference is how the kernel processes them. In cooked mode, the kernel's line discipline buffers input and handles editing. In raw mode, bytes pass straight through to the program. This lets simple programs get free line editing, while complex TUIs get full control.",
  },
  examples: {
    title: "Real-World Examples",
    description:
      "Your shell (bash/zsh) uses cooked mode—type, edit, then press Enter. Vim uses raw mode—press j and you immediately move down. SSH uses raw mode to forward your keys. Even Ctrl+C works differently: in cooked mode, the line discipline generates SIGINT; in raw mode, the byte reaches the program directly.",
  },
};

export function InputModesDemo() {
  const [mode, setMode] = useState<InputMode>("cooked");
  const [buffer, setBuffer] = useState("");
  const [sentLines, setSentLines] = useState<string[]>([]);
  const [rawKeyHistory, setRawKeyHistory] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<ExplainerStep>("cooked");
  const inputRef = useRef<HTMLInputElement>(null);

  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const stepContent = EXPLAINER_STEPS[currentStep];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (mode === "cooked") {
        // Cooked mode: standard behavior, only send on Enter
        if (e.key === "Enter") {
          e.preventDefault();
          if (buffer.trim()) {
            setSentLines((prev) => [...prev, buffer]);
            setBuffer("");
          }
        }
        // Backspace and other editing is handled automatically
      } else {
        // Raw mode: every key is immediately "sent"
        e.preventDefault();
        let keyName = e.key;
        if (e.key === " ") keyName = "Space";
        if (e.key === "Backspace") keyName = "BS";
        if (e.key === "Enter") keyName = "Enter";
        if (e.key === "Escape") keyName = "Esc";
        if (e.key === "ArrowUp") keyName = "↑";
        if (e.key === "ArrowDown") keyName = "↓";
        if (e.key === "ArrowLeft") keyName = "←";
        if (e.key === "ArrowRight") keyName = "→";
        if (e.key === "Tab") keyName = "Tab";

        setRawKeyHistory((prev) => [...prev.slice(-11), keyName]);
      }
    },
    [mode, buffer],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (mode === "cooked") {
        setBuffer(e.target.value);
      }
      // In raw mode, onChange doesn't do anything meaningful
    },
    [mode],
  );

  const reset = useCallback(() => {
    setBuffer("");
    setSentLines([]);
    setRawKeyHistory([]);
  }, []);

  // Reset state when mode changes
  const handleModeChange = useCallback((newMode: InputMode) => {
    setMode(newMode);
    setBuffer("");
    setSentLines([]);
    setRawKeyHistory([]);
  }, []);

  // Focus input when clicking anywhere in the terminal
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex items-center gap-4">
        <SubsectionLabel className="mb-0">Input Mode:</SubsectionLabel>
        <div className="inline-flex">
          <button
            onClick={() => handleModeChange("cooked")}
            className={`border px-4 py-2 text-sm transition-all ${
              mode === "cooked"
                ? "border-primary bg-primary/10 text-primary z-10"
                : "border-primary text-tertiary hover:text-primary"
            }`}
          >
            Cooked (Line-Buffered)
          </button>
          <button
            onClick={() => handleModeChange("raw")}
            className={`-ml-px border px-4 py-2 text-sm transition-all ${
              mode === "raw"
                ? "border-primary bg-primary/10 text-primary z-10"
                : "border-primary text-tertiary hover:text-primary"
            }`}
          >
            Raw (Immediate)
          </button>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Terminal Simulation */}
        <div className="space-y-4">
          <SubsectionLabel>
            {mode === "cooked" ? "Type, Edit, Then Enter" : "Every Key Sent Instantly"}
          </SubsectionLabel>
          <TerminalWindow>
            <div className="min-h-[200px] cursor-text font-mono text-sm" onClick={focusInput}>
              {mode === "cooked" ? (
                <>
                  {/* Cooked mode: show line history and current buffer */}
                  {sentLines.map((line, idx) => (
                    <div key={idx} className="text-tertiary">
                      $ {line}
                    </div>
                  ))}
                  <div className="flex items-center">
                    <span className="text-primary">$</span>
                    <span className="text-primary ml-2">{buffer}</span>
                    <span className="cursor-blink">█</span>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={buffer}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="sr-only"
                  />
                </>
              ) : (
                <>
                  {/* Raw mode: show key-by-key display */}
                  <div className="flex min-h-[60px] flex-wrap gap-1">
                    {rawKeyHistory.map((key, idx) => (
                      <span
                        key={idx}
                        className={`border-primary border px-2 py-1 text-xs ${
                          idx === rawKeyHistory.length - 1
                            ? "bg-primary/10 text-primary border-primary"
                            : "bg-tertiary text-primary"
                        }`}
                        style={{
                          opacity: 0.5 + (idx / rawKeyHistory.length) * 0.5,
                        }}
                      >
                        {key}
                      </span>
                    ))}
                    {rawKeyHistory.length === 0 && (
                      <span className="text-quaternary text-xs">Start typing...</span>
                    )}
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value=""
                    onChange={() => {}}
                    onKeyDown={handleKeyDown}
                    className="sr-only"
                  />
                  <div className="text-quaternary mt-4 text-xs">
                    Click here and type. Each key appears instantly.
                  </div>
                </>
              )}
            </div>
          </TerminalWindow>
          <Button size="sm" variant="secondary" onClick={reset}>
            Clear
          </Button>
        </div>

        {/* What's Happening */}
        <div className="space-y-4">
          <SubsectionLabel>What's Happening</SubsectionLabel>
          <div className="space-y-4">
            {mode === "cooked" ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">Cooked Mode</span>
                  <span className="text-quaternary text-sm">(canonical)</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-secondary">1.</span>
                    <span className="text-tertiary">
                      You type characters. The kernel's{" "}
                      <span className="text-secondary">line discipline</span> buffers them.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-secondary">2.</span>
                    <span className="text-tertiary">
                      <span className="text-secondary">Backspace</span>: the line discipline removes
                      a character from the buffer.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-secondary">3.</span>
                    <span className="text-tertiary">
                      <span className="text-secondary">Enter</span> sends the entire line to the
                      program.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-secondary">4.</span>
                    <span className="text-tertiary">
                      The program sees: <code className="text-primary">"{buffer || "..."}\\n"</code>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">Raw Mode</span>
                  <span className="text-quaternary text-sm">(non-canonical)</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-secondary">1.</span>
                    <span className="text-tertiary">
                      You press a key. It's <span className="text-secondary">immediately</span>{" "}
                      sent.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-secondary">2.</span>
                    <span className="text-tertiary">
                      <span className="text-secondary">No buffering</span>
                      —the line discipline passes bytes straight through.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-secondary">3.</span>
                    <span className="text-tertiary">
                      <span className="text-secondary">Backspace</span> is just another key the
                      program receives.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-secondary">4.</span>
                    <span className="text-tertiary">
                      The program handles everything: cursor, display, editing.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Explainer */}
      <InfoPanel className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="text-primary text-sm font-medium">{stepContent.title}</div>
          <StepDotsNavigation
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </div>
        <p className="text-tertiary text-sm leading-relaxed">{stepContent.description}</p>
      </InfoPanel>

      {/* Comparison Table */}
      <div className="space-y-4">
        <h3 className="text-primary text-sm font-medium">Cooked vs Raw: Quick Comparison</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-primary border-b">
                <th className="text-quaternary py-2 text-left">Behavior</th>
                <th className="text-primary py-2 text-left">Cooked Mode</th>
                <th className="text-primary py-2 text-left">Raw Mode</th>
              </tr>
            </thead>
            <tbody className="text-tertiary">
              <tr className="border-primary/50 border-b">
                <td className="py-2">When input is sent</td>
                <td className="py-2">After pressing Enter</td>
                <td className="py-2">Immediately per key</td>
              </tr>
              <tr className="border-primary/50 border-b">
                <td className="py-2">Backspace</td>
                <td className="py-2">Deletes from buffer</td>
                <td className="py-2">Just another key</td>
              </tr>
              <tr className="border-primary/50 border-b">
                <td className="py-2">Ctrl+C</td>
                <td className="py-2">Line discipline generates SIGINT</td>
                <td className="py-2">Program receives 0x03</td>
              </tr>
              <tr className="border-primary/50 border-b">
                <td className="py-2">Arrow keys</td>
                <td className="py-2">Line recall (history)</td>
                <td className="py-2">Program handles it</td>
              </tr>
              <tr>
                <td className="py-2">Used by</td>
                <td className="text-secondary py-2">bash, zsh, cat</td>
                <td className="text-secondary py-2">vim, htop, ssh, less</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
