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
  // Enhanced structured data for SEO - emphasizing interactive playground
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Git Master",
    "alternateName": "Git Master Interactive Platform",
    "description": "Interactive Git playground and command simulator. Practice Git version control in a safe environment with real-time visualization and hands-on learning tools.",
    "url": baseUrl,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Git Master",
      "description": "Interactive platform for Git version control practice and learning"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Git Master",
      "description": "Developer tools platform specializing in Git simulation and practice environments"
    },
    "applicationSubCategory": "Version Control Simulator",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "keywords": "git playground, git simulator, interactive git, version control practice, git visualization, developer tools",
    "featureList": [
      "Interactive Git command terminal",
      "Real-time repository state visualization",
      "Git workflow simulation",
      "Branch and merge visualization",
      "Command reference library",
      "Safe practice environment",
      "Visual learning diagrams"
    ],
    "screenshot": `${baseUrl}/favicon.svg`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "software developers, programming students, version control learners"
    }
  };

  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Git Master",
    "alternateName": "Git Master Platform",
    "description": "Leading interactive platform for Git education and version control learning",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.svg`,
    "foundingDate": "2024",
    "knowsAbout": [
      "Git version control",
      "Software development",
      "Developer education",
      "Interactive learning",
      "Version control systems"
    ],
    "areaServed": "Worldwide",
    "serviceType": "Educational Technology"
  };

  // Interactive playground/tool structured data
  const playgroundData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Git Master Interactive Playground",
    "description": "Interactive Git command playground and practice environment. Simulate Git operations, visualize repository states, and practice version control in a safe sandbox environment.",
    "applicationCategory": "DeveloperApplication",
    "applicationSubCategory": "Version Control Tool",
    "operatingSystem": "Web Browser",
    "url": `${baseUrl}/git-playground`,
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Git Master",
      "url": baseUrl
    },
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "featureList": [
      "Interactive Git command terminal",
      "Real-time repository visualization", 
      "Git command simulation",
      "Branch and commit tree display",
      "Safe practice environment",
      "Command history tracking",
      "Visual workflow diagrams"
    ],
    "keywords": "git playground, git simulator, git practice, version control sandbox, interactive git, git visualization",
    "audience": {
      "@type": "Audience",
      "audienceType": "developers, programmers, students learning git"
    },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(playgroundData),
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
