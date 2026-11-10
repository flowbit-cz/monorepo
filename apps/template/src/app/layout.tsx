import type { Metadata } from "next";
import type { ReactNode } from "react";
import { appData } from "@/config/appData";
import "@/styles/global.css";

export const metadata: Metadata = { metadataBase: new URL(appData.siteUrl) };

/** The real root layout with <html> is app/[locale]/layout.tsx (it knows the language). */
export default function RootLayout({ children }: { children: ReactNode }) {
    return children;
}
