import { toErrorMessage, track } from "@/lib/axiom";

type LogContext = Record<string, unknown>;

function format(level: string, message: string, context: LogContext): string {
  const contextStr = Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : "";
  return `[${level.toUpperCase()}] ${message}${contextStr}`;
}

function errorFields(error: unknown): LogContext {
  if (error === undefined) return {};
  if (error instanceof Error) {
    return { error_name: error.name, error_message: error.message, stack: error.stack };
  }
  return { error_message: toErrorMessage(error) };
}

/**
 * Structured logger:
 * - info → console only
 * - warn / error → console + Axiom `log` event (level, message, context)
 */
class Logger {
  constructor(private readonly context: LogContext = {}) {}

  child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context });
  }

  info(message: string, context?: LogContext): void {
    console.info(format("info", message, { ...this.context, ...context }));
  }

  warn(message: string, context?: LogContext): void {
    const merged = { ...this.context, ...context };
    console.warn(format("warn", message, merged));
    track("log", { ...merged, level: "warn", message });
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    const merged = { ...this.context, ...context, ...errorFields(error) };
    console.error(format("error", message, merged), ...(error instanceof Error ? [error] : []));
    track("log", { ...merged, level: "error", message });
  }
}

export const logger = new Logger();
