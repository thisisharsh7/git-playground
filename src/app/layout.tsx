import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { SvgBackground } from "@/components/svg-background";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { generatePageMetadata, pageConfigs, baseUrl } from "@/lib/seo-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Disable automatic preload to prevent warning
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", 
  preload: false, // Disable automatic preload to prevent warning
});

// Enhanced metadata with comprehensive SEO
export const metadata: Metadata = generatePageMetadata(pageConfigs.home);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // One honest site-level entity.
  //
  // Removed in Phase 5:
  //  - aggregateRating (4.8 from 150 ratings) — invented; there is no rating
  //    system, no reviews and no users anywhere in this codebase.
  //  - the Organization block — "Git Master" is not a real organization, and
  //    its foundingDate/areaServed/serviceType were all invented. Its logo
  //    pointed at a favicon, which Google rejects, so it could never have
  //    produced a rich result.
  //  - a second, duplicate SoftwareApplication describing the same product as
  //    a different @type with no linkage between them.
  //  - creator/publisher Organizations, screenshot (a favicon), softwareVersion
  //    (1.0.0 while package.json says 0.1.0), and dateModified (evaluated at
  //    build time, so it perpetually claimed "modified today").
  //
  // datePublished is the repository's real first commit.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Git Master",
    "description": "Interactive Git playground and command simulator. Practice Git commands in a safe environment that never touches a real repository.",
    "url": baseUrl,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "datePublished": "2025-07-04",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    // Only what the product actually does. The previous list claimed "branch
    // and merge visualization" with no merge implemented, and "real-time
    // repository state visualization" for a hardcoded diagram.
    "featureList": [
      "Interactive Git command terminal",
      "Repository state display",
      "Structured Git lessons with quizzes",
      "Git command reference",
      "Git workflow diagrams"
    ],
    "usageInfo": "Practice Git commands in a simulated environment without affecting real repositories"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        {/* Enhanced structured data for brand emphasis */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Brand emphasis meta tags */}
        <meta name="application-name" content="Git Master" />
        <meta name="apple-mobile-web-app-title" content="Git Master" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
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
