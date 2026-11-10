import { designTokens } from "@dertour/tokens";
import { ImageResponse } from "next/og";
import { appData } from "@/config/appData";

export const alt = appData.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph image (pages with their own image override it in metadata). */
export default function OpengraphImage() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: designTokens.color.brand.DEFAULT,
                color: designTokens.color.accent.DEFAULT,
                fontSize: 128,
                fontWeight: 900,
            }}
        >
            {appData.name}
        </div>,
        size,
    );
}
