import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "../Spinner/Spinner";

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    {
        variants: {
            variant: {
                primary: "bg-brand text-brand-contrast hover:bg-brand-dark",
                accent: "bg-accent text-accent-contrast hover:bg-accent-dark",
                secondary: "border-brand bg-surface text-brand hover:bg-surface-muted border",
                ghost: "text-brand hover:bg-surface-muted",
                danger: "bg-danger text-danger-contrast hover:opacity-90",
            },
            size: {
                sm: "h-9 px-3 text-sm",
                md: "h-11 px-5 text-base",
                lg: "h-13 px-7 text-lg",
            },
            fullWidth: { true: "w-full" },
        },
        defaultVariants: { variant: "primary", size: "md" },
    },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    /** Shows a spinner and disables the button (e.g. while a form submits). */
    loading?: boolean;
}

/** Primary action element. Use `buttonVariants()` to style links as buttons. */
export function Button({
    variant,
    size,
    fullWidth,
    loading = false,
    disabled,
    className,
    children,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(buttonVariants({ variant, size, fullWidth }), className)}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading && <Spinner size="sm" className="text-current" label="" />}
            {children}
        </button>
    );
}
