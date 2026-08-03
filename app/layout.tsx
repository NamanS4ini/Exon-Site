import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Exon — The Programming Language",
    template: "%s | Exon",
  },
  description:
    "Exon is a dynamically-typed, tree-walk interpreted programming language written in Java. Featuring variables, functions, closures, classes, and inheritance.",
  keywords: ["Exon", "programming language", "interpreter", "Java", "compiler", "documentation"],
  authors: [{ name: "Naman Saini" }],
  openGraph: {
    type: "website",
    title: "Exon — The Programming Language",
    description:
      "A dynamically-typed, tree-walk interpreted programming language with functions, closures, classes, and inheritance.",
    siteName: "Exon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exon — The Programming Language",
    description: "A dynamically-typed, tree-walk interpreted programming language.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      style={{ height: "100%" }}
    >
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
