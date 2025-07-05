import { Metadata } from 'next'
import { generatePageMetadata, pageConfigs } from '@/lib/seo-config'

// For layout files, we'll use static metadata and handle dynamic metadata in the page component
export const metadata: Metadata = generatePageMetadata(pageConfigs.playground)

export default function GitPlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
