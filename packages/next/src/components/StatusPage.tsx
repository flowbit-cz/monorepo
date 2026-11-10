import type { ReactNode } from "react";

/** Props of {@link StatusPage}. All texts come from the app's translations. */
export interface StatusPageProps {
    /** Big code shown above the title ("404", "500"). */
    code?: string;
    title: string;
    description?: string;
    /** Actions (back home, retry…). */
    children?: ReactNode;
}

/** Layout of error / not-found pages. */
export function StatusPage({ code, title, description, children }: StatusPageProps) {
    return (
        <section
            className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center"
            aria-labelledby="status-title"
        >
            {code && (
                <p className="text-brand text-6xl font-bold" aria-hidden="true">
                    {code}
                </p>
            )}
            <h1 id="status-title" className="text-3xl font-semibold">
                {title}
            </h1>
            {description && <p className="text-text-muted">{description}</p>}
            {children && <div className="mt-4 flex flex-wrap justify-center gap-3">{children}</div>}
        </section>
    );
}
