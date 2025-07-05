// src/app/robots.txt/route.ts
export function GET() {
  const content = `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /private/

Sitemap: https://my-git-playground.vercel.app/sitemap.xml
Host: https://my-git-playground.vercel.app
`.trim()

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
