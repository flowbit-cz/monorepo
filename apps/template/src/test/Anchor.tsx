import type { ComponentProps } from "react";

/** Stand-in for the i18n Link in tests that mock "@/i18n/navigation". */
export default function Anchor({
    href,
    ...props
}: Omit<ComponentProps<"a">, "href"> & { href: string | { pathname: string } }) {
    return <a href={typeof href === "string" ? href : href.pathname} {...props} />;
}
