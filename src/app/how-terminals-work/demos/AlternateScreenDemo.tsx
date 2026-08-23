"use client";

import { useState } from "react";

import { TerminalWindow } from "../ui";
import { Button, InfoPanel, StepDotsNavigation, SubsectionLabel } from "../ui";

type ExplainerStep = "what" | "why" | "how" | "apps";

const EXPLAINER_STEPS: Record<ExplainerStep, { title: string; description: string }> = {
  what: {
    title: "What Is the Alternate Screen?",
    description:
      "Terminals have two screen buffers: the normal screen (with your scrollback history) and the alternate screen (a separate canvas). Programs can switch between them. When they exit, your original screen reappears.",
  },
  why: {
    title: "Why Does This Exist?",
    description:
      "Without the alternate screen, full-screen apps like vim would draw all over your terminal history. When you quit, you'd see vim's last screen mixed with your old output. The alternate screen keeps your scrollback clean.",
  },
  how: {
    title: "How It Works",
    description:
      "Programs send an escape sequence to enter alternate screen mode: ^[[?1049h. When they exit, they send ^[[?1049l to return to the normal screen. The terminal swaps buffers, preserving your history.",
  },
  apps: {
    title: "Apps That Use It",
    description:
      "vim, less, man, htop, tmux, and most TUI apps use the alternate screen. When you quit these apps, notice how your previous terminal output reappears? That's the alternate screen at work.",
  },
};

// Sample terminal content for normal mode
const NORMAL_SCREEN_CONTENT = [
  "$ ls -la",
  "total 32",
  "drwxr-xr-x  5 user staff  160 Jan  8 10:30 .",
  "drwxr-xr-x  8 user staff  256 Jan  7 14:22 ..",
  "-rw-r--r--  1 user staff  847 Jan  8 10:30 package.json",
  "-rw-r--r--  1 user staff 1205 Jan  8 10:28 README.md",
  "drwxr-xr-x 12 user staff  384 Jan  8 10:30 src",
  "$ git status",
  "On branch main",
  "nothing to commit, working tree clean",
  "$ vim README.md",
];

// Simulated vim content for alternate screen
const ALTERNATE_SCREEN_CONTENT = [
  "# My Project",
  "",
  "This is a sample README file.",
  "",
  "## Getting Started",
  "",
  "```bash",
  "npm install",
  "npm start",
  "```",
  "",
  "~",
  "~",
  "~",
];

export function AlternateScreenDemo() {
  const [isAlternateScreen, setIsAlternateScreen] = useState(false);
  const [currentStep, setCurrentStep] = useState<ExplainerStep>("what");

  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const stepContent = EXPLAINER_STEPS[currentStep];

  const toggleScreen = () => {
    setIsAlternateScreen((prev) => !prev);
  };

  return (
    <div className="space-y-8">
      {/* Main Demo */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Terminal Simulation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={toggleScreen}>
              {isAlternateScreen ? "Exit vim (:q)" : "Open vim"}
            </Button>
            <span
              className={`px-2 py-1 text-xs ${
                isAlternateScreen ? "bg-primary/10 text-secondary" : "bg-primary/10 text-primary"
              }`}
            >
              {isAlternateScreen ? "Alternate Buffer" : "Normal Buffer"}
            </span>
          </div>

          <TerminalWindow>
            <div className="relative min-h-[300px] overflow-hidden font-mono text-sm">
              {/* Normal screen with transition */}
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  isAlternateScreen
                    ? "-translate-x-full transform opacity-0"
                    : "translate-x-0 transform opacity-100"
                }`}
              >
                {NORMAL_SCREEN_CONTENT.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith("$")
                        ? "text-primary"
                        : line.startsWith("drwx") || line.startsWith("-rw")
                          ? "text-secondary"
                          : "text-primary"
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>

              {/* Alternate screen (vim) with transition */}
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  isAlternateScreen
                    ? "translate-x-0 transform opacity-100"
                    : "translate-x-full transform opacity-0"
                }`}
              >
                {/* Vim header */}
                <div className="bg-tertiary text-secondary mb-1 px-2 text-xs">README.md [+]</div>
                {/* Vim content */}
                {ALTERNATE_SCREEN_CONTENT.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line === "~"
                        ? "text-secondary"
                        : line.startsWith("#")
                          ? "text-secondary"
                          : line.startsWith("```")
                            ? "text-primary"
                            : "text-primary"
                    }
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                {/* Vim status line */}
                <div className="bg-tertiary absolute right-0 bottom-0 left-0 flex justify-between px-2 text-xs text-white dark:text-neutral-950">
                  <span>-- INSERT --</span>
                  <span>1,1 All</span>
                </div>
              </div>
            </div>
          </TerminalWindow>
        </div>

        {/* Escape Sequences */}
        <div className="space-y-4">
          <SubsectionLabel>The Escape Sequences</SubsectionLabel>

          <div className="space-y-3">
            <div
              className={`border p-4 transition-all ${
                !isAlternateScreen ? "border-primary bg-primary/5" : "border-primary"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-primary text-sm font-bold">Enter Alternate Screen</span>
                <code className="text-secondary text-xs">^[[?1049h</code>
              </div>
              <p className="text-tertiary text-sm">
                Saves the current screen, clears display, and switches to the alternate buffer. Sent
                when opening vim, less, htop, etc.
              </p>
            </div>

            <div
              className={`border p-4 transition-all ${
                isAlternateScreen ? "border-primary bg-primary/5" : "border-primary"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-secondary text-sm font-bold">Exit Alternate Screen</span>
                <code className="text-secondary text-xs">^[[?1049l</code>
              </div>
              <p className="text-tertiary text-sm">
                Restores the saved screen buffer. Your previous terminal content reappears exactly
                as it was. Sent when quitting the app.
              </p>
            </div>
          </div>

          {/* Visual representation of buffer swap */}
          <div className="bg-tertiary border-primary space-y-3 border p-4">
            <div className="text-primary text-sm font-bold">Buffer Layout</div>
            <div className="flex items-center gap-4">
              <div
                className={`flex-1 border-2 p-3 text-center text-sm transition-all ${
                  !isAlternateScreen
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-primary text-quaternary"
                }`}
              >
                Normal Buffer
                <div className="mt-1 text-xs opacity-70">(your history)</div>
              </div>
              <div className="text-quaternary">⇄</div>
              <div
                className={`flex-1 border-2 p-3 text-center text-sm transition-all ${
                  isAlternateScreen
                    ? "border-primary bg-primary/5 text-secondary"
                    : "border-primary text-quaternary"
                }`}
              >
                Alternate Buffer
                <div className="mt-1 text-xs opacity-70">(app's canvas)</div>
              </div>
            </div>
            <p className="text-quaternary text-center text-xs">
              Only one buffer is visible at a time. The other is preserved in memory.
            </p>
          </div>
        </div>
      </div>

      {/* Explainer */}
      <InfoPanel className="space-y-4 p-4">
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

      {/* Without Alternate Screen */}
      <div className="bg-tertiary border-primary space-y-4 border p-6">
        <h3 className="text-primary text-sm font-bold">What Would Happen Without It?</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-primary text-sm font-bold">Without Alternate Screen</div>
            <div className="bg-secondary border-primary space-y-1 border p-3 font-mono text-xs">
              <div className="text-tertiary">$ ls</div>
              <div className="text-tertiary">file1.txt file2.txt</div>
              <div className="text-tertiary">$ vim README.md</div>
              <div className="text-secondary"># My Project</div>
              <div>~</div>
              <div>~</div>
              <div className="text-quaternary">-- INSERT --</div>
              <div className="text-tertiary">... (quit vim)</div>
              <div className="text-primary">← vim's output stays mixed with history!</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-primary text-sm font-bold">With Alternate Screen</div>
            <div className="bg-secondary border-primary space-y-1 border p-3 font-mono text-xs">
              <div className="text-tertiary">$ ls</div>
              <div className="text-tertiary">file1.txt file2.txt</div>
              <div className="text-tertiary">$ vim README.md</div>
              <div className="text-quaternary">(vim opens on alternate screen...)</div>
              <div className="text-quaternary">(you edit, then :q...)</div>
              <div className="text-tertiary">$ ls</div>
              <div className="text-tertiary">file1.txt file2.txt</div>
              <div className="text-primary">← Your history is intact!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
