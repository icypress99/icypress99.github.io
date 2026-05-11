import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "icypress — Developer & Software Architect",
  description:
    "Developer | Blockchain Enthusiast | Software Architect. Building systems at the intersection of low-level engineering and web.",
  keywords: ["developer", "software architect", "blockchain", "C++", "Qt", "Rust", "web"],
  openGraph: {
    title: "icypress — Developer & Software Architect",
    description: "Building systems at the intersection of low-level engineering and web.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] antialiased overflow-x-hidden">
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
