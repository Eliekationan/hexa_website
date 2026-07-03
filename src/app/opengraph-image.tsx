import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "#05060a",
        backgroundImage:
          "radial-gradient(circle at 50% 45%, rgba(109,94,252,0.35) 0%, rgba(34,211,238,0.15) 45%, transparent 75%)",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6d5efc" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <path
          d="M16 1.5 29.4 9v14L16 30.5 2.6 23V9Z"
          fill="none"
          stroke="url(#g)"
          strokeWidth="2"
        />
        <path d="M16 9 22 12.5v7L16 23l-6-3.5v-7Z" fill="url(#g)" opacity="0.9" />
      </svg>
      <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#f4f6fb" }}>
        {siteConfig.name}
      </div>
      <div style={{ display: "flex", fontSize: 28, color: "#97a0b8" }}>
        {siteConfig.tagline}
      </div>
    </div>,
    { ...size },
  );
}
