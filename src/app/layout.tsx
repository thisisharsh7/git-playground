import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { SvgBackground } from "@/components/svg-background";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Get the base URL for metadata
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
              process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
              'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Git Master - Interactive Git Learning Platform",
  description: "Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control through hands-on practice.",
  keywords: ["Git", "version control", "learning", "interactive", "tutorial", "commands", "playground"],
  authors: [{ name: "Git Master Team" }],
  creator: "Git Master",
  publisher: "Git Master",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Git Master - Interactive Git Learning Platform",
    description: "Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control through hands-on practice.",
    url: "/",
    siteName: "Git Master",
    type: "website",
    images: [
      {
        url: "/favicon.svg",
        width: 32,
        height: 32,
        alt: "Git Master Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Git Master - Interactive Git Learning Platform",
    description: "Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control through hands-on practice.",
    images: ["/favicon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100`}
      >
        <ThemeProvider
          defaultTheme="light"
          storageKey="git-master-theme"
        >
          <SvgBackground />
          <Navigation />
          <main className="relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
