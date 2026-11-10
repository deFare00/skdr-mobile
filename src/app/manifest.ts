import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SKDR Indonesia - Sistem Kewaspadaan Dini dan Respons",
    short_name: "SKDR Mobile",
    description: "Platform kewaspadaan dini dan respons: memantau sinyal EBS, Form Penyelidikan Epidemiologi, dan indikator 7-1-7 Kementerian Kesehatan Republik Indonesia",
    start_url: "/",
    display: "standalone",
    background_color: "#006d67",
    theme_color: "#006d67",
    orientation: "portrait",
    categories: ["medical", "health", "productivity", "government"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

