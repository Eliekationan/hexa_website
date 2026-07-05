import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Par défaut, Next.js limite le payload des Server Actions à 1 Mo — trop
    // bas pour l'upload d'image de couverture (src/lib/blog-storage.ts limite
    // les images à 5 Mo). 6 Mo laisse une marge pour l'encodage multipart.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
