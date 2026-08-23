"use client";

import { useState } from "react";

import { Button, NumberedStepNavigation } from "../ui";

type Term = "terminal" | "shell" | "terminal-emulator" | "pty" | "bash" | "zsh" | "console" | "cli";

interface TermDefinition {
  name: string;
  shortName?: string;
  category: "hardware" | "software" | "shell" | "interface";
  definition: string;
  examples: string[];
  alsoKnownAs?: string[];
}

const TERMS: Record<Term, TermDefinition> = {
  terminal: {
    name: "Terminal",
    category: "hardware",
    definition:
      "Originally a physical device with a screen and keyboard that connected to a mainframe computer. Today, the word usually refers to a terminal emulator.",
    examples: ["VT100", "VT220", "IBM 3270"],
    alsoKnownAs: ["TTY", "Teletype"],
  },
  "terminal-emulator": {
    name: "Terminal Emulator",
    category: "software",
    definition:
      "A program that emulates a physical terminal. It draws the character grid, handles input/output, and connects to a shell. This is what you actually run on your computer.",
    examples: [
      "iTerm2",
      "Terminal.app",
      "Windows Terminal",
      "Alacritty",
      "kitty",
      "Warp",
      "Ghostty",
      "WezTerm",
    ],
  },
  shell: {
    name: "Shell",
    category: "software",
    definition:
      "A program that interprets commands. The shell reads what you type, executes programs, and handles things like pipes, redirects, and scripting. The terminal emulator is just the window; the shell is the program running inside it.",
    examples: ["sh", "bash", "zsh", "fish", "ksh", "tcsh", "PowerShell", "nushell"],
  },
  pty: {
    name: "PTY (Pseudo-Terminal)",
    shortName: "PTY",
    category: "software",
    definition:
      "A kernel feature that creates a fake terminal device. It has two ends: the master (connected to your terminal emulator) and the slave (connected to the shell). This is the pipe that connects your terminal to the shell.",
    examples: ["/dev/pts/0", "/dev/ttys000"],
    alsoKnownAs: ["Pseudoterminal", "Pseudo-TTY"],
  },
  bash: {
    name: "Bash",
    category: "shell",
    definition:
      'The "Bourne Again Shell"—the default shell on most Linux systems. Known for its scripting capabilities and POSIX compliance. Uses .bashrc and .bash_profile for configuration.',
    examples: ["#!/bin/bash", "source ~/.bashrc"],
  },
  zsh: {
    name: "Zsh",
    category: "shell",
    definition:
      'The "Z Shell"—the default shell on macOS since Catalina. Has better tab completion, theming (Oh My Zsh), and interactive features than bash. Mostly compatible with bash syntax.',
    examples: ["#!/bin/zsh", "source ~/.zshrc"],
  },
  console: {
    name: "Console",
    category: "interface",
    definition:
      'Historically, the physical terminal directly attached to a computer. In modern usage, often used interchangeably with "terminal" or to mean a text-based interface.',
    examples: ["Linux virtual console (Ctrl+Alt+F1)", "Browser developer console"],
    alsoKnownAs: ["System console"],
  },
  cli: {
    name: "CLI (Command-Line Interface)",
    shortName: "CLI",
    category: "interface",
    definition:
      "A text-based interface where you interact by typing commands. The opposite of a GUI. Both the shell and programs you run in the terminal are CLIs.",
    examples: ["git", "npm", "docker", "curl"],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  hardware: "text-secondary",
  software: "text-secondary",
  shell: "text-primary",
  interface: "text-secondary",
};

const CATEGORY_LABELS: Record<string, string> = {
  hardware: "Hardware",
  software: "Software",
  shell: "Shell",
  interface: "Interface Type",
};

// Architecture diagram showing the relationship between components
function ArchitectureDiagram({ highlightedTerm }: { highlightedTerm: Term | null }) {
  const isHighlighted = (terms: Term[]) => {
    if (!highlightedTerm) return false;
    return terms.includes(highlightedTerm);
  };

  return (
    <div className="space-y-6">
      <div className="text-primary text-sm font-medium">How They Fit Together</div>

      {/* Nested boxes showing containment */}
      <div className="font-mono text-sm">
        {/* Nested layers */}
        <div
          className={`border p-4 transition-all ${
            isHighlighted(["terminal-emulator", "terminal"])
              ? "border-primary bg-primary/5"
              : "border-primary/40"
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-secondary font-bold">Terminal Emulator</span>
            <span className="text-tertiary text-xs">iTerm2, Ghostty, kitty</span>
          </div>

          <div
            className={`border p-4 transition-all ${
              isHighlighted(["pty"]) ? "border-secondary bg-primary/5" : "border-secondary/40"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-secondary font-bold">PTY</span>
              <span className="text-tertiary text-xs">pseudo-terminal in kernel</span>
            </div>

            <div
              className={`border p-4 transition-all ${
                isHighlighted(["shell", "bash", "zsh"])
                  ? "border-primary bg-primary/5"
                  : "border-primary/40"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-primary font-bold">Shell</span>
                <span className="text-tertiary text-xs">zsh, bash, fish</span>
              </div>

              <div
                className={`border p-3 transition-all ${
                  isHighlighted(["cli"]) ? "border-primary bg-primary/5" : "border-primary/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-secondary font-bold">CLI Programs</span>
                  <span className="text-tertiary text-xs">git, npm, vim</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data flow annotation */}
        <div className="border-primary text-tertiary mt-4 border-t pt-4 text-xs">
          <span className="text-primary">Data flows both ways:</span> keystrokes travel inward,
          output travels outward. Each layer transforms the data.
        </div>
      </div>
    </div>
  );
}

// Shell family tree and comparison
function ShellLandscape() {
  const [selectedShell, setSelectedShell] = useState<string>("zsh");

  const shells = {
    sh: {
      name: "sh (Bourne Shell)",
      year: "1979",
      creator: "Stephen Bourne at Bell Labs",
      description:
        "The original Unix shell. Established scripting conventions still used today. The standard for portable scripts.",
      config: "/etc/profile, ~/.profile",
      defaultOn: "POSIX systems (as /bin/sh)",
      color: "text-quaternary",
    },
    bash: {
      name: "Bash (Bourne Again Shell)",
      year: "1989",
      creator: "Brian Fox for GNU",
      description:
        "Backwards compatible with sh, adding command history, job control, and better scripting. The most common shell on Linux.",
      config: "~/.bashrc, ~/.bash_profile",
      defaultOn: "Most Linux distros",
      color: "text-secondary",
    },
    zsh: {
      name: "Zsh (Z Shell)",
      year: "1990",
      creator: "Paul Falstad",
      description:
        "Combines features from bash, ksh, and tcsh. Known for powerful tab completion, spelling correction, and theming via Oh My Zsh.",
      config: "~/.zshrc, ~/.zprofile",
      defaultOn: "macOS (since 2019)",
      color: "text-secondary",
    },
    fish: {
      name: "Fish (Friendly Interactive Shell)",
      year: "2005",
      creator: "Axel Liljencrantz",
      description:
        "Prioritizes user-friendliness over POSIX compatibility. Built-in syntax highlighting, autosuggestions, and web-based config.",
      config: "~/.config/fish/config.fish",
      defaultOn: "None (opt-in)",
      color: "text-primary",
    },
    ksh: {
      name: "Ksh (Korn Shell)",
      year: "1983",
      creator: "David Korn at Bell Labs",
      description:
        "Combines sh compatibility with C shell features. Popular in enterprise Unix environments. Has associative arrays and better loop syntax.",
      config: "~/.kshrc",
      defaultOn: "Some commercial Unix",
      color: "text-secondary",
    },
    tcsh: {
      name: "Tcsh (TENEX C Shell)",
      year: "1981",
      creator: "Ken Greer",
      description:
        "Enhanced C shell with command-line editing and completion. C-like scripting syntax. Was the default on older BSDs and early macOS.",
      config: "~/.tcshrc, ~/.cshrc",
      defaultOn: "FreeBSD (historically)",
      color: "text-primary",
    },
    nushell: {
      name: "Nushell",
      year: "2019",
      creator: "Jonathan Turner et al.",
      description:
        "Modern shell treating data as structured tables, not text. Pipelines pass typed data. Not POSIX-compatible but very powerful for data manipulation.",
      config: "~/.config/nushell/config.nu",
      defaultOn: "None (opt-in)",
      color: "text-secondary",
    },
  };

  const shellKeys = Object.keys(shells) as Array<keyof typeof shells>;
  const selected = shells[selectedShell as keyof typeof shells];

  return (
    <div className="space-y-4">
      <div className="text-primary text-sm font-medium">The Shell Family Tree</div>

      <div className="flex flex-wrap gap-2">
        {shellKeys.map((key) => (
          <button
            key={key}
            onClick={() => setSelectedShell(key)}
            className={`border px-3 py-1.5 text-sm transition-colors ${
              selectedShell === key
                ? "border-primary bg-primary/10 text-primary"
                : "border-primary text-tertiary hover:text-primary"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-3">
          <div>
            <span className={`font-bold ${selected.color}`}>{selected.name}</span>
            <span className="text-quaternary ml-2 text-sm">({selected.year})</span>
          </div>
          <p className="text-tertiary text-sm leading-relaxed">{selected.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-quaternary mb-1 text-xs uppercase">Config</div>
              <div className="text-secondary font-mono text-xs">{selected.config}</div>
            </div>
            <div>
              <div className="text-quaternary mb-1 text-xs uppercase">Default on</div>
              <div className="text-primary text-xs">{selected.defaultOn}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Terminal emulator landscape
function TerminalLandscape() {
  const [selectedTerminal, setSelectedTerminal] = useState<string>("iterm2");

  const terminals = {
    vt100: {
      name: "VT100 (1978)",
      type: "Hardware",
      description:
        "The DEC terminal that defined the standard. First ANSI-compliant terminal. Most modern terminal emulators trace their roots here.",
      features: ["ANSI escape codes", "80×24 display", "Scrolling regions"],
      color: "text-secondary",
    },
    xterm: {
      name: "xterm (1984)",
      type: "Classic",
      description:
        "The original X Window System terminal emulator. Added mouse tracking and 256 colors. Still the reference implementation.",
      features: ["VT102 emulation", "Mouse tracking", "256 colors"],
      color: "text-quaternary",
    },
    iterm2: {
      name: "iTerm2",
      type: "Feature-rich",
      description:
        "The most popular macOS terminal. Split panes, search, triggers, Python scripting API. Native tmux integration.",
      features: ["Split panes", "Tmux integration", "Autocomplete", "Triggers"],
      color: "text-primary",
    },
    alacritty: {
      name: "Alacritty",
      type: "Minimal/Fast",
      description:
        "GPU-accelerated, written in Rust. Focused on speed and simplicity. No tabs, no splits—use tmux instead.",
      features: ["GPU rendering", "Cross-platform", "Vi mode", "Fast"],
      color: "text-secondary",
    },
    kitty: {
      name: "kitty",
      type: "Feature-rich",
      description:
        'GPU-based with its own image protocol. Extensible via "kittens". Defined the kitty keyboard protocol now adopted widely.',
      features: ["GPU rendering", "Image support", "Kittens", "Tabs/splits"],
      color: "text-secondary",
    },
    warp: {
      name: "Warp",
      type: "Modern/AI",
      description:
        "Reimagines the terminal with blocks, AI assistance, and team features. Input at bottom, modern text editing.",
      features: ["AI assistance", "Blocks", "Team sharing", "Modern UI"],
      color: "text-secondary",
    },
    ghostty: {
      name: "Ghostty",
      type: "Modern/Fast",
      description:
        "By Mitchell Hashimoto (Vagrant, Terraform). Native GPU rendering, kitty graphics, sensible defaults. Open-sourced in late 2024.",
      features: ["Native rendering", "Kitty graphics", "Fast", "Clean defaults"],
      color: "text-primary",
    },
  };

  const terminalKeys = Object.keys(terminals) as Array<keyof typeof terminals>;
  const selected = terminals[selectedTerminal as keyof typeof terminals];

  return (
    <div className="space-y-4">
      <div className="text-primary text-sm font-medium">Terminal Emulators</div>

      <div className="flex flex-wrap gap-2">
        {terminalKeys.map((key) => (
          <button
            key={key}
            onClick={() => setSelectedTerminal(key)}
            className={`border px-3 py-1.5 text-sm transition-colors ${
              selectedTerminal === key
                ? "border-primary bg-primary/10 text-primary"
                : "border-primary text-tertiary hover:text-primary"
            }`}
          >
            {key === "vt100" ? "VT100" : key === "iterm2" ? "iTerm2" : key}
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-3">
          <div>
            <span className={`font-bold ${selected.color}`}>{selected.name}</span>
            <span className="text-quaternary ml-2 text-sm">• {selected.type}</span>
          </div>
          <p className="text-tertiary text-sm leading-relaxed">{selected.description}</p>
          <div>
            <div className="text-quaternary mb-2 text-xs uppercase">Key features</div>
            <div className="flex flex-wrap gap-2">
              {selected.features.map((feature) => (
                <span
                  key={feature}
                  className="bg-secondary border-primary text-primary border px-2 py-1 text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Interactive demo showing what happens when you type
function CommandFlowDemo() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      label: "You type",
      content: "ls -la",
      description: "You press keys on your keyboard",
      highlight: "input",
    },
    {
      label: "Terminal receives",
      content: "l, s, space, -, l, a",
      description: "Terminal emulator receives keystrokes and displays them",
      highlight: "terminal",
    },
    {
      label: "Shell receives",
      content: "ls -la\\n",
      description: "When you press Enter, the shell receives the full line",
      highlight: "shell",
    },
    {
      label: "Shell parses",
      content: "command: ls, args: [-l, -a]",
      description: "Shell interprets the command and arguments",
      highlight: "shell",
    },
    {
      label: "Shell executes",
      content: "/bin/ls -l -a",
      description: "Shell finds and runs the ls program",
      highlight: "program",
    },
    {
      label: "Output flows back",
      content: "drwxr-xr-x  5 user ...",
      description: "Program output goes through PTY to terminal",
      highlight: "output",
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="space-y-4">
      <div className="text-primary text-sm font-medium">Follow a Command</div>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Previous
        </Button>
        <NumberedStepNavigation
          totalSteps={steps.length}
          currentStep={step}
          onStepChange={setStep}
        />
        <Button
          size="sm"
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
        >
          Next
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-secondary text-sm font-bold">{currentStep?.label}</span>
        </div>
        <div className="text-primary font-mono">{currentStep?.content}</div>
        <div className="text-tertiary text-sm">{currentStep?.description}</div>
      </div>
    </div>
  );
}

export function VocabularyDemo() {
  const [activeTerm, setActiveTerm] = useState<Term>("terminal");
  const termData = activeTerm ? TERMS[activeTerm] : null;

  const termOrder: Term[] = [
    "terminal",
    "terminal-emulator",
    "shell",
    "pty",
    "bash",
    "zsh",
    "console",
    "cli",
  ];

  return (
    <div className="space-y-8">
      {/* Glossary */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Term list */}
        <div className="lg:w-1/2">
          <div className="min-h-[320px] space-y-1 font-mono text-sm">
            {termOrder.map((term) => {
              const data = TERMS[term];
              const isActive = activeTerm === term;
              return (
                <div
                  key={term}
                  onMouseEnter={() => setActiveTerm(term)}
                  className={`flex w-full cursor-default items-center gap-3 px-3 py-2 text-left transition-all ${
                    isActive
                      ? "bg-primary/10 border-primary border-l-2"
                      : "border-l-2 border-transparent"
                  }`}
                >
                  <span className={`w-16 text-xs uppercase ${CATEGORY_COLORS[data.category]}`}>
                    {CATEGORY_LABELS[data.category]?.split(" ")[0]}
                  </span>
                  <span className="text-primary">{data.shortName || data.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Term details */}
        <div className="lg:w-1/2">
          {termData && (
            <div className="space-y-4">
              <div>
                <div className={`text-xs uppercase ${CATEGORY_COLORS[termData.category]}`}>
                  {CATEGORY_LABELS[termData.category]}
                </div>
                <div className="text-primary mt-2 text-base font-bold">{termData.name}</div>
                {termData.alsoKnownAs && (
                  <div className="text-tertiary text-xs">
                    AKA: {termData.alsoKnownAs.join(", ")}
                  </div>
                )}
              </div>

              <p className="text-tertiary text-sm leading-relaxed">{termData.definition}</p>

              <div className="space-y-2">
                <div className="text-tertiary text-xs uppercase">Examples</div>
                <div className="flex flex-wrap gap-2">
                  {termData.examples.map((ex) => (
                    <span
                      key={ex}
                      className={`bg-secondary border-primary border px-2 py-1 font-mono text-xs ${CATEGORY_COLORS[termData.category]}`}
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Architecture Diagram */}
      <ArchitectureDiagram highlightedTerm={activeTerm} />

      {/* Shell Landscape */}
      <ShellLandscape />

      {/* Terminal Emulator Landscape */}
      <TerminalLandscape />

      {/* Command Flow Demo */}
      <CommandFlowDemo />

      {/* Common Confusions */}
      <div className="space-y-4">
        <h3 className="text-primary text-sm font-medium">Common Confusions</h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="text-primary text-sm font-bold">"I opened my terminal"</div>
            <p className="text-tertiary text-sm">
              You probably mean you opened a{" "}
              <span className="text-secondary">terminal emulator</span> (like iTerm2), which started
              a <span className="text-primary">shell</span> (like zsh) inside it.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-primary text-sm font-bold">
              "My terminal can't find the command"
            </div>
            <p className="text-tertiary text-sm">
              It's actually your <span className="text-primary">shell</span> that searches for
              commands in your PATH. The terminal just displays what the shell outputs.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-primary text-sm font-bold">"bash vs zsh—which should I use?"</div>
            <p className="text-tertiary text-sm">
              For interactive use, <span className="text-secondary">zsh</span> has better features.
              For scripts, <span className="text-secondary">bash</span> is more portable. Most
              commands work identically in both.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-primary text-sm font-bold">
              "Terminal settings vs shell config"
            </div>
            <p className="text-tertiary text-sm">
              <span className="text-secondary">Terminal settings</span> control appearance (fonts,
              colors, window size). <span className="text-primary">Shell config</span> (.zshrc)
              controls aliases, PATH, and prompt.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-primary text-sm font-bold">
              "How does Up arrow recall previous commands?"
            </div>
            <p className="text-tertiary text-sm">
              That's your <span className="text-primary">shell</span>, not your terminal. The shell
              keeps a history file (like <span className="text-secondary">~/.zsh_history</span>) and
              sends recalled commands back to the terminal for display.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-primary text-sm font-bold">
              "Why restart terminal after editing .zshrc?"
            </div>
            <p className="text-tertiary text-sm">
              Your shell reads <span className="text-secondary">.zshrc</span> once at startup.
              Existing shells already loaded their config. Opening a new terminal starts a fresh
              shell that reads your updated file. (Or run{" "}
              <span className="text-primary">source ~/.zshrc</span> to reload without restarting.)
            </p>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="space-y-4">
        <h3 className="text-primary text-sm font-medium">Quick Reference</h3>

        <div className="space-y-2 font-mono text-sm">
          <div className="text-tertiary"># Which shell am I using?</div>
          <div className="text-primary">echo $SHELL</div>
          <div className="text-tertiary mt-3"># What terminal am I in?</div>
          <div className="text-primary">echo $TERM_PROGRAM</div>
          <div className="text-tertiary mt-3"># What's my PTY device?</div>
          <div className="text-primary">tty</div>
          <div className="text-tertiary mt-3"># List available shells</div>
          <div className="text-primary">cat /etc/shells</div>
          <div className="text-tertiary mt-3"># Change default shell to zsh</div>
          <div className="text-primary">chsh -s /bin/zsh</div>
        </div>
      </div>
    </div>
  );
}
