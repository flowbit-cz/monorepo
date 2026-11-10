/** Log level. */
export type LogLevel = "debug" | "info" | "warn" | "error";

/** Extra structured context (ids, codes). Never secrets or personal data. */
export type LogContext = Record<string, unknown>;

/** Sink of formatted lines, replaceable in tests. */
export type LogSink = (level: LogLevel, line: string) => void;

const ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function serialize(value: unknown): unknown {
    return value instanceof Error ? { name: value.name, message: value.message, stack: value.stack } : value;
}

const consoleSink: LogSink = (level, line) => {
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    // The logger is the one place allowed to write info lines to stdout.
    // eslint-disable-next-line no-console
    else console.info(line);
};

/**
 * Structured JSON logger: one JSON object per line, ready for Datadog log ingestion
 * (`level`, `message`, `service`, `time` + context).
 */
export function createLogger({
    service,
    level = (process.env.LOG_LEVEL as LogLevel | undefined) ??
        (process.env.NODE_ENV === "production" ? "info" : "debug"),
    sink = consoleSink,
    now = () => new Date(),
}: {
    service: string;
    level?: LogLevel;
    sink?: LogSink;
    now?: () => Date;
}) {
    const write = (lvl: LogLevel, message: string, context?: LogContext) => {
        if (ORDER[lvl] < ORDER[level]) return;
        const entry: Record<string, unknown> = { time: now().toISOString(), level: lvl, service, message };
        for (const [key, value] of Object.entries(context ?? {})) entry[key] = serialize(value);
        sink(lvl, JSON.stringify(entry));
    };
    return {
        debug: (message: string, context?: LogContext) => write("debug", message, context),
        info: (message: string, context?: LogContext) => write("info", message, context),
        warn: (message: string, context?: LogContext) => write("warn", message, context),
        error: (message: string, context?: LogContext) => write("error", message, context),
    };
}

export type Logger = ReturnType<typeof createLogger>;
