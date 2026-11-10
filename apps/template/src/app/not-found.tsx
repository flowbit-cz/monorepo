"use client";

import NextError from "next/error";

/** 404 for requests outside any locale (the proxy normally redirects them). */
export default function GlobalNotFound() {
    return (
        <html lang="de">
            <body>
                <NextError statusCode={404} />
            </body>
        </html>
    );
}
