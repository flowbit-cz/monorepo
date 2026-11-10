"use client";

/**
 * Last-resort error boundary: it replaces the root layout, so no translations or styles are available.
 * The text is intentionally bilingual. All other errors render [locale]/error.tsx.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="de">
            <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "4rem 1rem" }}>
                <h1>Etwas ist schiefgelaufen · Something went wrong</h1>
                <button type="button" onClick={() => reset()}>
                    Erneut versuchen · Try again
                </button>
            </body>
        </html>
    );
}
