import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EnduroShield Hub",
  description:
    "EnduroShield Hub is an AI-powered multi-tenant knowledge base platform for document ingestion, search, and intelligent assistance.",
  applicationName: "EnduroShield Hub",
  keywords: [
    "EnduroShield",
    "Knowledge Base",
    "AI Search",
    "RAG",
    "Multi-Tenant SaaS",
    "AI Chatbot",
    "Document Embedding",
  ],
  authors: [{ name: "EnduroShield Team" }],
  creator: "EnduroShield",
  publisher: "EnduroShield",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "EnduroShield Hub",
    description:
      "AI-powered platform for knowledge management, document ingestion, and intelligent chat support.",
    url: "https://aiconzulting.com",
    siteName: "EnduroShield Hub",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EnduroShield Hub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "EnduroShield Hub",
    description:
      "AI-powered knowledge base and multi-tenant platform for businesses.",
    images: ["/og-image.png"],
  },

  manifest: "/site.webmanifest",

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
