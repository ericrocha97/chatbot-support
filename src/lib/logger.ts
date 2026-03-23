export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  context?: Record<string, unknown>;
  level: LogLevel;
  message: string;
  sessionId?: string;
  timestamp: string;
}

export const logger = {
  info: (
    message: string,
    sessionId?: string,
    context?: Record<string, unknown>
  ) => {
    log("info", message, sessionId, context);
  },
  warn: (
    message: string,
    sessionId?: string,
    context?: Record<string, unknown>
  ) => {
    log("warn", message, sessionId, context);
  },
  error: (
    message: string,
    sessionId?: string,
    context?: Record<string, unknown>
  ) => {
    log("error", message, sessionId, context);
  },
};

function log(
  level: LogLevel,
  message: string,
  sessionId?: string,
  context?: Record<string, unknown>
) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (sessionId) {
    entry.sessionId = sessionId;
  }
  if (context) {
    entry.context = context;
  }

  const output = JSON.stringify(entry);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}
