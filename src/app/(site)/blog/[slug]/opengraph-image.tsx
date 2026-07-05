import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";
import { getPublishedPostBySlug } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  return [{ id: "og", alt: post ? post.title : siteConfig.name, ...size, contentType }];
}

export default async function BlogPostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  const title = post?.title ?? siteConfig.name;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#05060a",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(92,79,224,0.35) 0%, rgba(34,211,238,0.15) 45%, transparent 75%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg width="56" height="56" viewBox="0 0 32 32">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5c4fe0" />
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
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#f4f6fb" }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#22d3ee",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Blog
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 56,
          fontWeight: 700,
          color: "#f4f6fb",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
    </div>,
    { ...size },
  );
}
