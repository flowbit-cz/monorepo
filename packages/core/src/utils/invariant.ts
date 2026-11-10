/** Thrown by {@link invariant}. */
export class InvariantError extends Error {
    override name = "InvariantError";
}

/** Asserts a condition that must hold. TypeScript narrows the type after the call. */
export function invariant(condition: unknown, message: string): asserts condition {
    if (!condition) throw new InvariantError(message);
}

/** Exhaustiveness check for switch statements over unions. */
export function assertNever(value: never): never {
    throw new InvariantError(`Unexpected value: ${JSON.stringify(value)}`);
}
