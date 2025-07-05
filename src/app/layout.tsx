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
              'https://my-git-playground.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Git Master - Interactive Git Learning Platform",
  description: "Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control through hands-on practice.",
  keywords: ["Git", "version control", "learning", "interactive", "tutorial", "commands", "playground", "developer tools", "programming", "software development"],
  authors: [{ name: "Git Master Team" }],
  creator: "Git Master",
  publisher: "Git Master",
  applicationName: "Git Master",
  category: "Education",
  classification: "Educational Software",
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
    url: "https://my-git-playground.vercel.app",
    siteName: "Git Master",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://my-git-playground.vercel.app/favicon.svg",
        width: 1200,
        height: 630,
        alt: "Git Master - Interactive Git Learning Platform",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Git Master - Interactive Git Learning Platform",
    description: "Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control through hands-on practice.",
    images: ["https://my-git-playground.vercel.app/favicon.svg"],
    creator: "@gitmaster",
    site: "@gitmaster",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://my-git-playground.vercel.app",
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
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Git Master",
    "description": "Interactive Git learning platform with hands-on playground, structured lessons, and visual workflows",
    "url": "https://my-git-playground.vercel.app",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Git Master Team"
    },
    "featureList": [
      "Interactive Git playground",
      "Structured learning lessons", 
      "Git command reference",
      "Visual workflow diagrams",
      "Real-time command execution",
      "Progress tracking"
    ],
    "screenshot": "https://my-git-playground.vercel.app/favicon.svg",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "educationalLevel": "Beginner to Advanced",
    "learningResourceType": "Interactive Tutorial",
    "teaches": [
      "Git version control",
      "Git commands", 
      "Branching and merging",
      "Remote repositories",
      "Git workflows"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
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
