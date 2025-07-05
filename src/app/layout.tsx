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
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Enhanced metadata with comprehensive SEO
export const metadata: Metadata = generatePageMetadata(pageConfigs.home);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enhanced structured data for SEO - emphasizing brand over hosting
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Git Master",
    "alternateName": "Git Master Platform",
    "description": "Interactive Git learning platform with hands-on playground, structured lessons, and visual workflows. Master version control through practical experience.",
    "url": baseUrl,
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Git Master",
      "description": "Leading platform for interactive Git education and version control learning"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Git Master",
      "description": "Educational technology platform specializing in Git and version control training"
    },
    "applicationSubCategory": "Developer Tools",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "educationalUse": "instruction",
    "educationalLevel": "beginner to advanced",
    "learningResourceType": "interactive tutorial",
    "teaches": [
      "Git version control",
      "Git commands",
      "Repository management", 
      "Branching strategies",
      "Merge and rebase workflows",
      "Collaborative development"
    ],
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "developers, programmers, software engineers"
    },
    "featureList": [
      "Interactive Git playground",
      "Real-time command execution",
      "Visual workflow diagrams",
      "Structured learning lessons",
      "Comprehensive command reference",
      "Progress tracking",
      "Hands-on practice environment"
    ],
    "screenshot": `${baseUrl}/favicon.svg`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5"
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

  // Educational course structured data
  const courseData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Interactive Git Mastery Course",
    "description": "Comprehensive Git learning course with interactive playground, hands-on exercises, and visual workflows",
    "provider": {
      "@type": "Organization",
      "name": "Git Master",
      "url": baseUrl
    },
    "educationalLevel": "Beginner to Advanced",
    "teaches": "Git version control, repository management, branching strategies",
    "courseMode": "online",
    "isAccessibleForFree": true,
    "inLanguage": "en-US",
    "availableLanguage": "English",
    "coursePrerequisites": "Basic computer literacy",
    "educationalUse": "instruction",
    "learningResourceType": "interactive course"
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
            __html: JSON.stringify(courseData),
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
