import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import { ExperienceMotion } from "@/components/motion/experience-motion";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Miette Noire — A little darker. A little extraordinary.",
  description:
    "Discover the art of a darker indulgence. An original collection of chocolate cakes, thoughtfully composed and made to be shared.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}<ExperienceMotion /></body>
    </html>
  );
}
