import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SlideMaker - Generator Slideshow Konten Media Sosial",
  description: "Ubah file Markdown (.md) menjadi konten slideshow gambar estetik untuk TikTok, Instagram, Facebook, dan YouTube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&family=Space+Grotesk:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
