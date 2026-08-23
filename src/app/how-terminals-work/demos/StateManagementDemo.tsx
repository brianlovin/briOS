"use client";

import { useCallback, useRef, useState } from "react";

import { TerminalWindow } from "../ui";
import { FeatureBox, StepDotsNavigation } from "../ui";

// Simulating different modes like Claude Code's accept edits / plan mode toggle
type Mode = "accept" | "plan" | "chat";

interface ModeConfig {
  name: string;
  indicator: string;
  colorClass: string;
  colorName: string;
}

const MODES: Record<Mode, ModeConfig> = {
  accept: {
    name: "accept edits on",
    indicator: ">>",
    colorClass: "text-secondary",
    colorName: "MAGENTA",
  },
  plan: {
    name: "plan mode",
    indicator: "??",
    colorClass: "text-secondary",
    colorName: "YELLOW",
  },
  chat: {
    name: "chat mode",
    indicator: "~~",
    colorClass: "text-secondary",
    colorName: "CYAN",
  },
};

const MODE_ORDER: Mode[] = ["accept", "plan", "chat"];

type ExplainerStep = "overview" | "memory" | "rendering" | "input-handling" | "persistence";

interface StepContent {
  title: string;
  description: string;
}

const EXPLAINER_STEPS: Record<ExplainerStep, StepContent> = {
  overview: {
    title: "State in Terminal Apps",
    description:
      "Terminal apps maintain state in memory just like GUI apps. The difference is how they display it: by printing characters to specific positions. When state changes, they redraw the relevant parts of the screen.",
  },
  memory: {
    title: "Where State Lives",
    description:
      "The app keeps variables in memory: currentMode, inputBuffer, history, etc. These are just regular program variables. The terminal itself doesn't store your app's state—it only displays whatever characters you send it.",
  },
  rendering: {
    title: "Rendering State Changes",
    description:
      "When the mode changes, the app: 1) Updates the variable in memory, 2) Moves the cursor to where the indicator is displayed, 3) Clears that region, 4) Prints the new indicator with appropriate colors. The user sees a seamless transition.",
  },
  "input-handling": {
    title: "Input Triggers State Changes",
    description:
      "Key combinations like Shift+Tab are just byte sequences. The app receives these bytes, recognizes the pattern, updates internal state, and re-renders. The terminal doesn't know anything about 'modes'—it just passes bytes through.",
  },
  persistence: {
    title: "Persistence & Sessions",
    description:
      "Terminal apps can save state to files (config, history) but lose in-memory state when they exit. Some apps use the terminal's alternate screen buffer—when they exit, the original screen content is restored, as if the app was never there.",
  },
};

export function StateManagementDemo() {
  const [currentMode, setCurrentMode] = useState<Mode>("accept");
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<{ mode: Mode; text: string }[]>([]);
  const [currentStep, setCurrentStep] = useState<ExplainerStep>("overview");
  const [showStateInspector, setShowStateInspector] = useState(false);
  const [lastKeySequence, setLastKeySequence] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cycleMode = useCallback(() => {
    const currentIndex = MODE_ORDER.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % MODE_ORDER.length;
    setCurrentMode(MODE_ORDER[nextIndex]!);
    setLastKeySequence("Shift+Tab → cycle mode");
    setTimeout(() => setLastKeySequence(null), 1500);
  }, [currentMode]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        cycleMode();
      } else if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        setHistory((prev) => [...prev, { mode: currentMode, text: inputValue }].slice(-5));
        setInputValue("");
        setLastKeySequence("Enter → submit");
        setTimeout(() => setLastKeySequence(null), 1500);
      }
    },
    [cycleMode, currentMode, inputValue],
  );

  const modeConfig = MODES[currentMode];
  const steps = Object.keys(EXPLAINER_STEPS) as ExplainerStep[];
  const stepContent = EXPLAINER_STEPS[currentStep];

  return (
    <div className="space-y-8">
      {/* Interactive Demo */}
      <div className="space-y-4">
        <TerminalWindow>
          <div
            className="min-h-[280px] cursor-text font-mono text-sm"
            onClick={() => inputRef.current?.focus()}
          >
            {/* History */}
            {history.length > 0 && (
              <div className="mb-4 space-y-2 opacity-60">
                {history.map((entry, i) => (
                  <div key={i} className="flex gap-2">
                    <span className={`${MODES[entry.mode].colorClass}`}>
                      {MODES[entry.mode].indicator}
                    </span>
                    <span className="text-quaternary">{entry.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Current prompt line */}
            <div className="flex items-start gap-2">
              <span className="text-quaternary">&gt;</span>
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-primary w-full bg-transparent outline-none"
                  placeholder="Type something and press Enter..."
                />
              </div>
            </div>

            {/* Mode indicator line - this is what we're explaining */}
            <div className="mt-2 flex items-center gap-2">
              <span className={`${modeConfig.colorClass} transition-colors duration-200`}>
                {modeConfig.indicator}
              </span>
              <span className={`${modeConfig.colorClass} transition-colors duration-200`}>
                {modeConfig.name}
              </span>
              <span className="text-quaternary">(shift+tab to cycle)</span>
            </div>
            {lastKeySequence && (
              <div className="text-quaternary mt-2 text-xs">{lastKeySequence}</div>
            )}
          </div>
        </TerminalWindow>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            onClick={cycleMode}
            className="border-primary hover:border-primary border px-3 py-1.5 transition-colors"
          >
            Cycle Mode (Shift+Tab)
          </button>
          <button
            onClick={() => setShowStateInspector(!showStateInspector)}
            className={`border px-3 py-1.5 transition-colors ${
              showStateInspector
                ? "bg-primary/10 border-primary text-primary"
                : "border-primary hover:border-primary"
            }`}
          >
            {showStateInspector ? "Hide" : "Show"} State Inspector
          </button>
        </div>

        {/* State Inspector */}
        {showStateInspector && (
          <div className="border-primary space-y-4 border p-4">
            <div className="text-primary text-sm font-medium">
              State Inspector (What the App Remembers)
            </div>
            <div className="grid grid-cols-1 gap-4 font-mono text-xs lg:grid-cols-2">
              <div className="space-y-2">
                <div className="text-quaternary">// Current state variables</div>
                <div>
                  <span className="text-secondary">currentMode</span>:{" "}
                  <span className={`${modeConfig.colorClass}`}>"{currentMode}"</span>
                </div>
                <div>
                  <span className="text-secondary">inputBuffer</span>:{" "}
                  <span className="text-primary">"{inputValue}"</span>
                </div>
                <div>
                  <span className="text-secondary">historyLength</span>:{" "}
                  <span className="text-secondary">{history.length}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-quaternary">// Render output for mode indicator</div>
                <div className="text-primary">
                  <span className="text-secondary">moveCursor</span>(3, 1);
                </div>
                <div className="text-primary">
                  <span className="text-secondary">setColor</span>(
                  <span className={`${modeConfig.colorClass}`}>{modeConfig.colorName}</span>
                  );
                </div>
                <div className="text-primary">
                  <span className="text-secondary">print</span>("
                  {modeConfig.indicator} {modeConfig.name}");
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How it works explanation */}
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="text-primary text-sm font-medium">{stepContent.title}</div>
            <StepDotsNavigation
              steps={steps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
          </div>
          <div className="space-y-4">
            <p className="text-tertiary text-sm leading-relaxed">{stepContent.description}</p>

            {currentStep === "memory" && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-quaternary">// App's internal state (in memory)</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-secondary">struct</span> AppState {"{"}
                  </div>
                  <div className="ml-4">
                    <span className="text-secondary">mode</span>: Mode,
                  </div>
                  <div className="ml-4">
                    <span className="text-secondary">input_buffer</span>: String,
                  </div>
                  <div className="ml-4">
                    <span className="text-secondary">history</span>: Vec&lt;Entry&gt;,
                  </div>
                  <div className="ml-4">
                    <span className="text-secondary">cursor_pos</span>: (u16, u16),
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>
            )}

            {currentStep === "rendering" && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-quaternary">// On mode change:</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-secondary">1.</span>{" "}
                    <span className="text-secondary">state.mode</span> = new_mode;
                  </div>
                  <div>
                    <span className="text-secondary">2.</span>{" "}
                    <span className="text-primary">print!("\x1b[3;1H")</span>;{" "}
                    <span className="text-quaternary">// move to line 3</span>
                  </div>
                  <div>
                    <span className="text-secondary">3.</span>{" "}
                    <span className="text-primary">print!("\x1b[2K")</span>;{" "}
                    <span className="text-quaternary">// clear line</span>
                  </div>
                  <div>
                    <span className="text-secondary">4.</span>{" "}
                    <span className="text-primary">print!("\x1b[35m")</span>;{" "}
                    <span className="text-quaternary">// set color</span>
                  </div>
                  <div>
                    <span className="text-secondary">5. </span>{" "}
                    <span className="text-primary">print!("{">> accept edits on"}")</span>;
                  </div>
                </div>
              </div>
            )}

            {currentStep === "input-handling" && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-quaternary">// Shift+Tab byte sequence</div>
                <div className="space-y-1">
                  <div>
                    Bytes received: <span className="text-secondary">1b 5b 5a</span>
                  </div>
                  <div>
                    Sequence: <span className="text-secondary">ESC [ Z</span> (CSI Z = Shift+Tab)
                  </div>
                  <div className="text-quaternary mt-2">// App's key handler:</div>
                  <div>
                    <span className="text-secondary">match</span> key {"{"}
                  </div>
                  <div className="ml-4">
                    ShiftTab =&gt; <span className="text-secondary">cycle_mode()</span>,
                  </div>
                  <div className="ml-4">
                    Enter =&gt; <span className="text-secondary">submit_input()</span>,
                  </div>
                  <div className="ml-4">
                    _ =&gt; <span className="text-secondary">append_to_buffer(key)</span>,
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>
            )}

            {currentStep === "persistence" && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-quaternary">// State persistence options</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-primary">~/.config/app/settings.json</span>{" "}
                    <span className="text-quaternary">— user preferences</span>
                  </div>
                  <div>
                    <span className="text-primary">~/.local/state/app/history</span>{" "}
                    <span className="text-quaternary">— command history</span>
                  </div>
                  <div>
                    <span className="text-primary">/tmp/app.sock</span>{" "}
                    <span className="text-quaternary">— inter-process state</span>
                  </div>
                  <div className="text-quaternary mt-2">// But current mode? Just in memory.</div>
                  <div className="text-quaternary">// When you restart, it resets to default.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* The data flow breakdown */}
      <div className="space-y-6">
        <h3 className="text-primary text-sm font-medium">The State Update Cycle</h3>

        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row">
          <FeatureBox number={1} title="Input" className="flex-1">
            <div className="text-quaternary text-sm">User presses Shift+Tab</div>
            <div className="text-secondary mt-2 font-mono text-xs">ESC [ Z</div>
          </FeatureBox>
          <div className="text-quaternary hidden text-2xl md:block"></div>
          <FeatureBox number={2} title="Process" className="flex-1">
            <div className="text-quaternary text-sm">App recognizes sequence</div>
            <div className="text-secondary mt-2 font-mono text-xs">mode = nextMode()</div>
          </FeatureBox>
          <div className="text-quaternary hidden text-2xl md:block"></div>
          <FeatureBox number={3} title="Render" className="flex-1">
            <div className="text-quaternary text-sm">Redraw mode indicator</div>
            <div className="text-primary mt-2 font-mono text-xs">print(indicator)</div>
          </FeatureBox>
        </div>

        <div className="text-quaternary text-sm">
          The terminal never "knows" about modes. It just displays whatever characters the app
          sends. All the intelligence—tracking state, responding to input, deciding what to
          draw—lives in the app.
        </div>
      </div>
    </div>
  );
}
