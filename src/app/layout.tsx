import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const script = Great_Vibes({
  variable: "--font-script-family",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Wedding Invitation Studio",
  description: "Beautiful heart-scratch wedding invitations, made for each couple.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${script.variable} antialiased`}
    >
      <body className="min-h-dvh overflow-x-hidden">{children}</body>
    </html>
  );
}
