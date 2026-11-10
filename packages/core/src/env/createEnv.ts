import { z } from "zod";

/** Zod object shape describing a set of env variables. */
type Shape = Record<string, z.ZodType>;

/** Options of {@link createEnv}. */
export interface CreateEnvOptions<TServer extends Shape, TClient extends Shape> {
    /** Server-only variables. Reading them in the browser throws. */
    server: TServer;
    /** Browser-visible variables. Every key must start with `NEXT_PUBLIC_`. */
    client: TClient;
    /**
     * Values to validate. In Next.js, list every client variable explicitly
     * (`NEXT_PUBLIC_X: process.env.NEXT_PUBLIC_X`) so the bundler can inline it.
     */
    runtimeEnv: Record<string, string | undefined>;
    /** Skip validation (e.g. `SKIP_ENV_VALIDATION=1` during a Docker build without secrets). */
    skipValidation?: boolean;
    /** `true` in the browser. Defaults to "no `window` global". */
    isServer?: boolean;
}

/** Thrown when env variables are missing or invalid, so the app fails fast at startup. */
export class InvalidEnvError extends Error {
    constructor(public readonly issues: z.core.$ZodIssue[]) {
        super(
            `Invalid environment variables:\n${issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")}`,
        );
        this.name = "InvalidEnvError";
    }
}

/**
 * Validates env variables with zod and returns a typed, read-only object.
 * The browser validates only the client variables. Touching a server variable there throws,
 * so secrets can't leak into the bundle by accident.
 */
export function createEnv<TServer extends Shape, TClient extends Shape>(
    options: CreateEnvOptions<TServer, TClient>,
): Readonly<z.infer<z.ZodObject<TServer>> & z.infer<z.ZodObject<TClient>>> {
    const { server, client, runtimeEnv, skipValidation = false } = options;
    const isServer = options.isServer ?? !("window" in globalThis);

    for (const key of Object.keys(client)) {
        if (!key.startsWith("NEXT_PUBLIC_")) {
            throw new Error(`Client env variable "${key}" must be prefixed with NEXT_PUBLIC_.`);
        }
    }

    if (skipValidation) return runtimeEnv as never;

    const schema = isServer ? z.object({ ...server, ...client }) : z.object(client);
    const parsed = schema.safeParse(runtimeEnv);
    if (!parsed.success) throw new InvalidEnvError(parsed.error.issues);

    return new Proxy(parsed.data as Record<string, unknown>, {
        get(target, prop) {
            if (typeof prop !== "string") return undefined;
            if (!isServer && prop in server) {
                throw new Error(`Server env variable "${prop}" was accessed on the client.`);
            }
            return target[prop];
        },
    }) as never;
}
