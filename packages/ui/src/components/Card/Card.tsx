import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

/** Surface for grouped content (offer tiles, info boxes). */
export function Card({ className, ...props }: ComponentProps<"article">) {
    return (
        <article
            className={cn("bg-surface shadow-card flex flex-col overflow-hidden rounded-lg", className)}
            {...props}
        />
    );
}

/** Media area at the top of a card (keeps a fixed aspect ratio, so images don't shift layout). */
export function CardMedia({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("bg-surface-muted relative aspect-[4/3] overflow-hidden", className)} {...props} />;
}

/** Padded content area of a card. */
export function CardBody({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("flex flex-1 flex-col gap-2 p-4", className)} {...props} />;
}

/** Bottom row of a card (price, actions). */
export function CardFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("border-border flex items-center justify-between gap-3 border-t p-4", className)}
            {...props}
        />
    );
}
