import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FieldProps {
    id: string;
    label: string;
    /** Help text under the control. */
    hint?: string;
    /** Error message. It replaces the hint and marks the control invalid. */
    error?: string;
    className?: string;
    children: ReactNode;
}

/** Ids of the hint/error elements, so the control can reference them via aria-describedby. */
export function fieldDescribedBy(id: string, { hint, error }: Pick<FieldProps, "hint" | "error">): string | undefined {
    if (error) return `${id}-error`;
    if (hint) return `${id}-hint`;
    return undefined;
}

/** Shared control styles of form inputs. */
export const controlClasses = (invalid: boolean) =>
    cn(
        "bg-surface text-text placeholder:text-text-muted disabled:bg-surface-muted h-11 w-full rounded-md border px-3 text-base",
        invalid ? "border-danger" : "border-border hover:border-border-strong",
    );

/** Label + control + hint/error, wired up for screen readers. */
export function Field({ id, label, hint, error, className, children }: FieldProps) {
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <label htmlFor={id} className="text-text text-sm font-semibold">
                {label}
            </label>
            {children}
            {error ? (
                <p id={`${id}-error`} className="text-danger text-sm" role="alert">
                    {error}
                </p>
            ) : (
                hint && (
                    <p id={`${id}-hint`} className="text-text-muted text-sm">
                        {hint}
                    </p>
                )
            )}
        </div>
    );
}
