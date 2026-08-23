export const HOW_TERMINALS_WORK_TITLE = "How Terminals Work";
export const HOW_TERMINALS_WORK_INTRO = "An interactive guide to understanding terminals";

export const HOW_TERMINALS_WORK_SECTIONS = [
  {
    id: "grid",
    number: 1,
    title: "The Grid Model",
    insight:
      "A terminal is just a grid of same-sized cells—like a screen with huge pixels that can display the alphabet.",
  },
  {
    id: "cell",
    number: 2,
    title: "What's in a Cell?",
    insight: "Each cell holds one character plus styling info (color, bold, underline). That's it.",
  },
  {
    id: "escape",
    number: 3,
    title: "Escape Sequences",
    insight:
      'Special character sequences control the terminal—move cursor, change colors, clear screen. That\'s why you sometimes see weird characters like "^[[31m".',
  },
  {
    id: "input",
    number: 4,
    title: "Input Goes Both Ways",
    insight:
      "When you press a key, the terminal sends bytes to the program. Arrow keys and mouse clicks become escape sequences too.",
  },
  {
    id: "signals",
    number: 5,
    title: "Signals",
    insight:
      "Ctrl+C doesn't type a character—it triggers a signal. Your terminal sends a byte (0x03), but the kernel's line discipline intercepts it and generates SIGINT before the program ever sees it.",
  },
  {
    id: "input-modes",
    number: 6,
    title: "Raw vs Cooked Mode",
    insight:
      "In cooked mode, you type a full line and press Enter. In raw mode, every keystroke goes straight to the program. That's why vim responds instantly while your shell waits for Enter.",
  },
  {
    id: "flow",
    number: 7,
    title: "The Round Trip",
    insight:
      "Every keystroke travels down through the terminal stack to the program, then output flows back up to render on screen.",
  },
  {
    id: "advanced-tui",
    number: 8,
    title: "Building Complex TUIs",
    insight:
      "Advanced terminal apps like htop or vim divide the screen into regions—each with its own focus, content, and resize behavior. It's like building a GUI, but with characters instead of pixels.",
  },
  {
    id: "alternate-screen",
    number: 9,
    title: "The Alternate Screen Buffer",
    insight:
      "When you open vim, your terminal history disappears. When you quit, it reappears. That's because terminals have two screens—the normal one (with your scrollback) and an alternate one apps use as a canvas.",
  },
  {
    id: "icons",
    number: 10,
    title: "Terminal Icons",
    insight:
      "Those file icons in your terminal? They're just Unicode characters from special fonts called Nerd Fonts—thousands of icons mapped to the Private Use Area.",
  },
  {
    id: "state",
    number: 11,
    title: "State Management",
    insight:
      "When you press Shift+Tab to cycle modes in Claude Code, the terminal doesn't remember anything—your app tracks state in memory and redraws the UI whenever it changes.",
  },
  {
    id: "selection",
    number: 12,
    title: "Text Selection & Cursor Positioning",
    insight:
      "You can't click to move your cursor because the terminal handles text selection separately from the app's cursor. Option+Click works by simulating arrow keypresses—it's a hack, not native behavior.",
  },
  {
    id: "capability-discovery",
    number: 13,
    title: "Capability Discovery",
    insight:
      "Before a program can use mouse tracking or 256 colors, it has to ask: what can this terminal do? The TERM variable and escape sequence queries let programs discover—and enable—terminal features.",
  },
  {
    id: "vocabulary",
    number: 14,
    title: "Terminal Vocabulary",
    insight:
      "Terminal, shell, console, CLI—these words get thrown around interchangeably, but they mean different things. Understanding the distinction helps you know which tool to configure when something isn't working.",
  },
] as const;

export type HowTerminalsWorkSection = (typeof HOW_TERMINALS_WORK_SECTIONS)[number];
