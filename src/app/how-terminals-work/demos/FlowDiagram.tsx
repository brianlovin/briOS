"use client";

import { useEffect, useState } from "react";

import { parseAnsiLine } from "../lib/ansi";
import { Button, TerminalWindow } from "../ui";

type Phase =
  | "idle"
  | "keystroke"
  | "terminal-encode"
  | "pty-to-shell"
  | "shell-process"
  | "shell-output"
  | "pty-to-terminal"
  | "terminal-render"
  | "done";

interface Step {
  phase: Phase;
  title: string;
  description: string;
  terminalContent: string[];
  highlight: "keyboard" | "terminal" | "pty" | "shell" | null;
  dataPacket?: string;
  dataDirection?: "down" | "up";
}

const STEPS: Step[] = [
  {
    phase: "idle",
    title: "Ready",
    description: "The terminal is waiting. The cursor blinks.",
    terminalContent: ["$ ▌"],
    highlight: null,
  },
  {
    phase: "keystroke",
    title: "You type 'ls'",
    description: "Each keystroke is a separate event sent to the terminal.",
    terminalContent: ["$ ls▌"],
    highlight: "keyboard",
    dataPacket: "l s",
    dataDirection: "down",
  },
  {
    phase: "terminal-encode",
    title: "Terminal encodes keystrokes",
    description: "The terminal converts your keystrokes into bytes: 'l' → 0x6C, 's' → 0x73",
    terminalContent: ["$ ls▌"],
    highlight: "terminal",
    dataPacket: "0x6C 0x73",
    dataDirection: "down",
  },
  {
    phase: "pty-to-shell",
    title: "PTY forwards to shell",
    description: "The pseudo-terminal pipes the bytes to the shell process (like bash or zsh).",
    terminalContent: ["$ ls▌"],
    highlight: "pty",
    dataPacket: "0x6C 0x73",
    dataDirection: "down",
  },
  {
    phase: "shell-process",
    title: "Shell receives and echoes",
    description:
      "The shell reads 'ls', echoes it back so you see what you typed, and waits for Enter.",
    terminalContent: ["$ ls▌"],
    highlight: "shell",
  },
  {
    phase: "shell-output",
    title: "You press Enter → Shell runs 'ls'",
    description:
      "The shell executes 'ls', which lists files. The output is just text with escape codes for colors.",
    terminalContent: [
      "$ ls",
      "\x1b[34mDocuments\x1b[0m  \x1b[34mDownloads\x1b[0m  \x1b[32mscript.sh\x1b[0m",
      "$ ▌",
    ],
    highlight: "shell",
    dataPacket: "\\x1b[34mDocuments...",
    dataDirection: "up",
  },
  {
    phase: "pty-to-terminal",
    title: "Output flows back through PTY",
    description: "The shell's output travels back through the PTY to the terminal.",
    terminalContent: [
      "$ ls",
      "\x1b[34mDocuments\x1b[0m  \x1b[34mDownloads\x1b[0m  \x1b[32mscript.sh\x1b[0m",
      "$ ▌",
    ],
    highlight: "pty",
    dataPacket: "\\x1b[34mDocuments...",
    dataDirection: "up",
  },
  {
    phase: "terminal-render",
    title: "Terminal renders output",
    description:
      "The terminal interprets escape sequences (\\x1b[34m = blue) and draws colored text to the grid.",
    terminalContent: [
      "$ ls",
      "\x1b[34mDocuments\x1b[0m  \x1b[34mDownloads\x1b[0m  \x1b[32mscript.sh\x1b[0m",
      "$ ▌",
    ],
    highlight: "terminal",
  },
  {
    phase: "done",
    title: "Complete",
    description:
      "The full round trip: keystroke → encode → shell → execute → output → render. Repeat!",
    terminalContent: [
      "$ ls",
      "\x1b[34mDocuments\x1b[0m  \x1b[34mDownloads\x1b[0m  \x1b[32mscript.sh\x1b[0m",
      "$ ▌",
    ],
    highlight: null,
  },
];

function renderTerminalLine(line: string) {
  return parseAnsiLine(line).map((p, idx) => (
    <span key={idx} style={p.color ? { color: p.color } : undefined}>
      {p.text.includes("▌") ? (
        <>
          {p.text.replace("▌", "")}
          <span className="cursor-blink text-primary">▌</span>
        </>
      ) : (
        p.text
      )}
    </span>
  ));
}

export function FlowDiagram() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStep = STEPS[stepIndex]!;

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStepIndex(0);
  };

  useEffect(() => {
    if (!isAnimating) return;
    if (stepIndex >= STEPS.length - 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- stop playback after the last step
      setIsAnimating(false);
      return;
    }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 1500);
    return () => clearTimeout(timer);
  }, [isAnimating, stepIndex]);

  const goToStep = (index: number) => {
    setIsAnimating(false);
    setStepIndex(index);
  };

  const layerClass = (layer: "keyboard" | "terminal" | "pty" | "shell") =>
    `relative px-4 py-3 border transition-all duration-300 ${
      currentStep.highlight === layer ? "border-primary bg-primary/5" : "border-primary"
    }`;

  return (
    <div className="space-y-6">
      {/* Main visualization */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: The layer diagram */}
        <div className="space-y-3">
          <label className="text-secondary mb-3 block text-xs uppercase">Terminal Stack</label>

          {/* Keyboard/You layer */}
          <div className={layerClass("keyboard")}>
            <div className="flex items-center gap-3">
              <span className="text-quaternary">[kbd]</span>
              <div>
                <div className="text-sm font-bold">You (Keyboard)</div>
                <div className="text-quaternary text-xs">Physical keystrokes</div>
              </div>
            </div>
            {currentStep.dataPacket &&
              currentStep.dataDirection === "down" &&
              currentStep.highlight === "keyboard" && (
                <div className="absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 transform">
                  <div className="border-primary bg-secondary text-primary border px-2 py-1 font-mono text-xs">
                    {currentStep.dataPacket}
                  </div>
                </div>
              )}
          </div>

          <div className="text-quaternary flex justify-center">
            <span className={currentStep.dataDirection === "down" ? "text-primary" : ""}>↓</span>
            <span className="mx-2">/</span>
            <span className={currentStep.dataDirection === "up" ? "text-primary" : ""}>↑</span>
          </div>

          {/* Terminal layer */}
          <div className={layerClass("terminal")}>
            <div className="flex items-center gap-3">
              <span className="text-quaternary">[tty]</span>
              <div>
                <div className="text-sm font-bold">Terminal Emulator</div>
                <div className="text-quaternary text-xs">Encodes input, renders output</div>
              </div>
            </div>
            {currentStep.dataPacket && currentStep.highlight === "terminal" && (
              <div
                className={`absolute ${currentStep.dataDirection === "down" ? "-bottom-6" : "-top-6"} left-1/2 z-10 -translate-x-1/2 transform`}
              >
                <div className="border-primary bg-secondary text-primary border px-2 py-1 font-mono text-xs">
                  {currentStep.dataPacket}
                </div>
              </div>
            )}
          </div>

          <div className="text-quaternary flex justify-center">
            <span className={currentStep.dataDirection === "down" ? "text-primary" : ""}>↓</span>
            <span className="mx-2">/</span>
            <span className={currentStep.dataDirection === "up" ? "text-primary" : ""}>↑</span>
          </div>

          {/* PTY layer */}
          <div className={layerClass("pty")}>
            <div className="flex items-center gap-3">
              <span className="text-quaternary">[pty]</span>
              <div>
                <div className="text-sm font-bold">PTY (Pseudo-Terminal)</div>
                <div className="text-quaternary text-xs">Bidirectional pipe</div>
              </div>
            </div>
            {currentStep.dataPacket && currentStep.highlight === "pty" && (
              <div
                className={`absolute ${currentStep.dataDirection === "down" ? "-bottom-6" : "-top-6"} left-1/2 z-10 -translate-x-1/2 transform`}
              >
                <div className="border-primary bg-secondary text-primary border px-2 py-1 font-mono text-xs">
                  {currentStep.dataPacket}
                </div>
              </div>
            )}
          </div>

          <div className="text-quaternary flex justify-center">
            <span className={currentStep.dataDirection === "down" ? "text-primary" : ""}>↓</span>
            <span className="mx-2">/</span>
            <span className={currentStep.dataDirection === "up" ? "text-primary" : ""}>↑</span>
          </div>

          {/* Shell layer */}
          <div className={layerClass("shell")}>
            <div className="flex items-center gap-3">
              <span className="text-quaternary">[sh]</span>
              <div>
                <div className="text-sm font-bold">Shell / Program</div>
                <div className="text-quaternary text-xs">bash, zsh, or any CLI program</div>
              </div>
            </div>
            {currentStep.dataPacket &&
              currentStep.dataDirection === "up" &&
              currentStep.highlight === "shell" && (
                <div className="absolute -top-6 left-1/2 z-10 -translate-x-1/2 transform">
                  <div className="border-primary bg-secondary text-primary border px-2 py-1 font-mono text-xs">
                    {currentStep.dataPacket}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Right: What you see */}
        <div className="space-y-4">
          <label className="text-secondary mb-3 block text-xs uppercase">Output</label>
          <TerminalWindow>
            <div className="min-h-[120px] space-y-1 font-mono text-sm">
              {currentStep.terminalContent.map((line, i) => (
                <div key={i}>{renderTerminalLine(line)}</div>
              ))}
            </div>
          </TerminalWindow>

          {/* Step info */}
          <div className="space-y-1">
            <div className="text-primary text-sm font-medium">{currentStep.title}</div>
            <div className="text-secondary text-sm">{currentStep.description}</div>
          </div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {STEPS.map((step, i) => (
          <button
            key={step.phase}
            onClick={() => goToStep(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === stepIndex
                ? "bg-primary scale-125"
                : i < stepIndex
                  ? "bg-quaternary"
                  : "bg-tertiary"
            }`}
            title={step.title}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button onClick={() => goToStep(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>
          Previous
        </Button>
        <Button variant="primary" onClick={startAnimation} disabled={isAnimating}>
          {isAnimating ? "Playing..." : "Play"}
        </Button>
        <Button
          onClick={() => goToStep(Math.min(STEPS.length - 1, stepIndex + 1))}
          disabled={stepIndex === STEPS.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
