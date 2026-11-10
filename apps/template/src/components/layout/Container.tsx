import { cn } from "@dertour/ui";
import type { ComponentProps } from "react";

/** Centered page width with side padding. */
export function Container({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
