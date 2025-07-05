import { Metadata } from 'next'

export const baseUrl = 'https://my-git-playground.vercel.app'

// Common SEO keywords
export const commonKeywords = [
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
  'collaborative development'
]

// Base metadata configuration
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
}

// Generate page-specific metadata
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
  const fullTitle = `${title} | Git Master`
  const url = `${baseUrl}${path}`
  const imageUrl = ogImage || `${baseUrl}/favicon.svg`
  
  return {
    ...baseMetadata,
    title: fullTitle,
    description,
    keywords: [...commonKeywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Git Master",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/svg+xml",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: "@gitmaster",
      site: "@gitmaster",
    },
  }
}

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: "Interactive Git Learning Platform",
    description: "Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control through hands-on practice.",
    keywords: [
      "git learning platform",
      "interactive git tutorial",
      "git master",
      "version control education",
      "git playground online",
      "learn git online",
      "git visualization tool"
    ],
    path: "",
  },
  playground: {
    title: "Git Playground - Interactive Learning",
    description: "Practice Git commands in a safe, interactive environment. Execute real Git commands, visualize repository states, and learn through hands-on experience.",
    keywords: [
      "git playground",
      "interactive git practice",
      "git command practice",
      "git terminal online",
      "git simulator",
      "practice git commands",
      "git learning environment"
    ],
    path: "/git-playground",
  },
  playgroundTab: {
    title: "Interactive Git Terminal",
    description: "Execute real Git commands in our interactive terminal. Practice Git operations with immediate visual feedback and learn version control hands-on.",
    keywords: [
      "git terminal",
      "interactive git commands",
      "git command line",
      "practice git terminal",
      "git cli practice"
    ],
    path: "/git-playground?tab=playground",
  },
  lessons: {
    title: "Git Lessons - Structured Learning",
    description: "Learn Git through structured lessons covering basics to advanced topics. Progressive learning path from Git fundamentals to complex workflows.",
    keywords: [
      "git lessons",
      "git tutorial",
      "learn git step by step",
      "git course",
      "git education",
      "git training",
      "structured git learning"
    ],
    path: "/git-playground?tab=lessons",
  },
  commands: {
    title: "Git Commands Reference",
    description: "Complete Git commands reference with examples, usage patterns, and detailed explanations. Search and filter 20+ essential Git commands.",
    keywords: [
      "git commands",
      "git reference",
      "git cheat sheet",
      "git command examples",
      "git documentation",
      "git help",
      "git command guide"
    ],
    path: "/git-playground?tab=commands",
  },
  visualization: {
    title: "Git Workflow Visualization",
    description: "Understand Git workflows through interactive diagrams and visualizations. Learn branching strategies, merge vs rebase, and Git's three-tree architecture.",
    keywords: [
      "git visualization",
      "git workflow diagrams",
      "git branching visualization",
      "git merge visualization",
      "git rebase visualization",
      "git flow diagram"
    ],
    path: "/git-playground?tab=visualization",
  },
}

// Command-specific SEO configurations
export const commandConfigs = {
  add: {
    title: "Git Add Command - Stage Changes",
    description: "Learn the git add command to stage changes for commit. Understand staging area, file patterns, and interactive staging with practical examples.",
    keywords: ["git add", "staging area", "stage files", "git add examples"],
  },
  commit: {
    title: "Git Commit Command - Save Changes",
    description: "Master the git commit command to save changes to repository history. Learn commit messages, amending commits, and best practices.",
    keywords: ["git commit", "commit message", "save changes", "git commit examples"],
  },
  push: {
    title: "Git Push Command - Upload Changes",
    description: "Understand git push to upload local commits to remote repositories. Learn about remote branches, force push, and push strategies.",
    keywords: ["git push", "remote repository", "upload changes", "git push examples"],
  },
  pull: {
    title: "Git Pull Command - Download Changes",
    description: "Learn git pull to download and merge changes from remote repositories. Understand fetch vs pull and conflict resolution.",
    keywords: ["git pull", "download changes", "merge remote", "git pull examples"],
  },
  branch: {
    title: "Git Branch Command - Manage Branches",
    description: "Master git branch command for creating, listing, and managing branches. Learn branching strategies and branch workflows.",
    keywords: ["git branch", "create branch", "branch management", "git branch examples"],
  },
  merge: {
    title: "Git Merge Command - Combine Branches",
    description: "Understand git merge to combine branches and integrate changes. Learn merge strategies, conflict resolution, and merge best practices.",
    keywords: ["git merge", "combine branches", "merge conflicts", "git merge examples"],
  },
}
