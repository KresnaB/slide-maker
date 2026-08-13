import type { Metadata } from "next";
import { Space_Grotesk, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-neo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-app-ui",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-app",
  display: "swap",
});

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
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${plusJakarta.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
