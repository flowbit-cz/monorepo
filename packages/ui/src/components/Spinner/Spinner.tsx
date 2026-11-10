import { cn } from "../../lib/cn";

const SIZES = { sm: "size-4 border-2", md: "size-6 border-2", lg: "size-10 border-4" } as const;

export interface SpinnerProps {
    size?: keyof typeof SIZES;
    /** Accessible label. An empty string hides the spinner from screen readers (e.g. inside a busy button). */
    label?: string;
    className?: string;
}

/** Loading indicator. */
export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
    return (
        <span
            role={label ? "status" : undefined}
            aria-label={label || undefined}
            aria-hidden={label ? undefined : true}
            className={cn(
                "text-brand inline-block animate-spin rounded-full border-current border-t-transparent",
                SIZES[size],
                className,
            )}
        />
    );
}
