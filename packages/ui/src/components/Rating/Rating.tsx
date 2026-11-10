import { cn } from "../../lib/cn";

export interface RatingProps {
    /** Hotel category, 1–5. */
    value: number;
    max?: number;
    /** Accessible text, e.g. "4 stars" (from translations). */
    label: string;
    className?: string;
}

/** Hotel star category. Screen readers get the label, the stars themselves are decorative. */
export function Rating({ value, max = 5, label, className }: RatingProps) {
    const filled = Math.max(0, Math.min(max, Math.round(value)));
    return (
        <span role="img" aria-label={label} className={cn("text-accent inline-flex", className)}>
            {Array.from({ length: max }, (_, index) => (
                <span key={index} aria-hidden="true" className={index < filled ? undefined : "opacity-25"}>
                    ★
                </span>
            ))}
        </span>
    );
}
