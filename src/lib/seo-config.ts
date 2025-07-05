import { Metadata } from 'next'

export const baseUrl = 'https://my-git-playground.vercel.app'

// Brand-focused SEO configuration
export const brandConfig = {
  name: 'Git Master',
  tagline: 'Interactive Git Learning Platform',
  description: 'Master Git version control through hands-on practice',
  domain: 'Git Master Platform',
  company: 'Git Master',
  author: 'Git Master Team',
  social: {
    twitter: '@gitmaster',
    github: 'git-master',
  }
}

// Common SEO keywords - emphasizing brand and functionality over hosting
export const commonKeywords = [
  // Brand keywords first
  'git master',
  'git master platform',
  'git learning platform',
  'interactive git tutorial',
  
  // Core functionality
  'git',
  'version control',
  'git tutorial',
  'git commands',
  'git playground',
  'learn git',
  'git visualization',
  'git workflow',
  'developer tools',
  'programming',
  'software development',
  'git branching',
  'git merge',
  'git rebase',
  'interactive learning',
  'coding education',
  'web development',
  'source control',
  'repository management',
  'collaborative development',
  
  // Educational focus
  'git education',
  'git training',
  'git course',
  'git bootcamp',
  'learn version control'
]

// Base metadata configuration with brand emphasis
export const baseMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
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
  verification: {
    google: "309dfde5f79964cc",
  },
  authors: [{ name: brandConfig.author }],
  creator: brandConfig.company,
  publisher: brandConfig.company,
  applicationName: brandConfig.name,
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
}

// Generate page-specific metadata with brand emphasis
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  path = '',
  ogImage,
}: {
  title: string
  description: string
  keywords?: string[]
  path?: string
  ogImage?: string
}): Metadata {
  // Emphasize brand in title structure
  const fullTitle = `${title} - ${brandConfig.name} | ${brandConfig.tagline}`
  const url = `${baseUrl}${path}`
  const imageUrl = ogImage || `${baseUrl}/favicon.svg`
  
  // Brand-focused description
  const brandedDescription = `${description} | ${brandConfig.name} - The leading platform for interactive Git learning and version control education.`
  
  return {
    ...baseMetadata,
    title: fullTitle,
    description: brandedDescription,
    keywords: [...commonKeywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: brandedDescription,
      url,
      siteName: brandConfig.name,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${brandConfig.name}`,
          type: "image/svg+xml",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: brandedDescription,
      images: [imageUrl],
      creator: brandConfig.social.twitter,
      site: brandConfig.social.twitter,
    },
  }
}

// Page-specific SEO configurations with brand emphasis
export const pageConfigs = {
  home: {
    title: "Interactive Git Learning Platform",
    description: "Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control through hands-on practice",
    keywords: [
      "git master platform",
      "interactive git tutorial",
      "git learning platform",
      "version control education",
      "git playground online",
      "learn git online",
      "git visualization tool",
      "git master course"
    ],
    path: "",
  },
  playground: {
    title: "Git Playground - Interactive Learning",
    description: "Practice Git commands in a safe, interactive environment. Execute real Git commands, visualize repository states, and learn through hands-on experience",
    keywords: [
      "git playground",
      "interactive git practice",
      "git command practice",
      "git terminal online",
      "git simulator",
      "practice git commands",
      "git learning environment",
      "git master playground"
    ],
    path: "/git-playground",
  },
  playgroundTab: {
    title: "Interactive Git Terminal",
    description: "Execute real Git commands in our interactive terminal. Practice Git operations with immediate visual feedback and learn version control hands-on",
    keywords: [
      "git terminal",
      "interactive git commands",
      "git command line",
      "practice git terminal",
      "git cli practice",
      "git master terminal"
    ],
    path: "/git-playground?tab=playground",
  },
  lessons: {
    title: "Git Lessons - Structured Learning",
    description: "Learn Git through structured lessons covering basics to advanced topics. Progressive learning path from Git fundamentals to complex workflows",
    keywords: [
      "git lessons",
      "git tutorial",
      "learn git step by step",
      "git course",
      "git education",
      "git training",
      "structured git learning",
      "git master lessons"
    ],
    path: "/git-playground?tab=lessons",
  },
  commands: {
    title: "Git Commands Reference",
    description: "Complete Git commands reference with examples, usage patterns, and detailed explanations. Search and filter 20+ essential Git commands",
    keywords: [
      "git commands",
      "git reference",
      "git cheat sheet",
      "git command examples",
      "git documentation",
      "git help",
      "git command guide",
      "git master reference"
    ],
    path: "/git-playground?tab=commands",
  },
  visualization: {
    title: "Git Workflow Visualization",
    description: "Understand Git workflows through interactive diagrams and visualizations. Learn branching strategies, merge vs rebase, and Git's three-tree architecture",
    keywords: [
      "git visualization",
      "git workflow diagrams",
      "git branching visualization",
      "git merge visualization",
      "git rebase visualization",
      "git flow diagram",
      "git master visualization"
    ],
    path: "/git-playground?tab=visualization",
  },
}

// Command-specific SEO configurations
export const commandConfigs = {
  add: {
    title: "Git Add Command - Stage Changes",
    description: "Learn the git add command to stage changes for commit. Understand staging area, file patterns, and interactive staging with practical examples",
    keywords: ["git add", "staging area", "stage files", "git add examples", "git master add"],
  },
  commit: {
    title: "Git Commit Command - Save Changes",
    description: "Master the git commit command to save changes to repository history. Learn commit messages, amending commits, and best practices",
    keywords: ["git commit", "commit message", "save changes", "git commit examples", "git master commit"],
  },
  push: {
    title: "Git Push Command - Upload Changes",
    description: "Understand git push to upload local commits to remote repositories. Learn about remote branches, force push, and push strategies",
    keywords: ["git push", "remote repository", "upload changes", "git push examples", "git master push"],
  },
  pull: {
    title: "Git Pull Command - Download Changes",
    description: "Learn git pull to download and merge changes from remote repositories. Understand fetch vs pull and conflict resolution",
    keywords: ["git pull", "download changes", "merge remote", "git pull examples", "git master pull"],
  },
  branch: {
    title: "Git Branch Command - Manage Branches",
    description: "Master git branch command for creating, listing, and managing branches. Learn branching strategies and branch workflows",
    keywords: ["git branch", "create branch", "branch management", "git branch examples", "git master branch"],
  },
  merge: {
    title: "Git Merge Command - Combine Branches",
    description: "Understand git merge to combine branches and integrate changes. Learn merge strategies, conflict resolution, and merge best practices",
    keywords: ["git merge", "combine branches", "merge conflicts", "git merge examples", "git master merge"],
  },
}
