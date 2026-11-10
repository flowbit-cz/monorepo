import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

const badgeVariants = cva("rounded-pill inline-flex w-fit items-center px-2.5 py-0.5 text-xs font-semibold", {
    variants: {
        tone: {
            neutral: "bg-surface-muted text-text",
            brand: "bg-brand text-brand-contrast",
            accent: "bg-accent text-accent-contrast",
            success: "bg-success text-success-contrast",
            warning: "bg-warning text-warning-contrast",
        },
    },
    defaultVariants: { tone: "neutral" },
});

export interface BadgeProps extends ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

/** Small status / label chip (board type, "Last minute", "Bestseller"). */
export function Badge({ tone, className, ...props }: BadgeProps) {
    return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
