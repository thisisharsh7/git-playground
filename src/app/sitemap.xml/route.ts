// src/app/sitemap.xml/route.ts
export function GET() {
  const baseUrl = 'https://my-git-playground.vercel.app'
  const lastMod = new Date('2025-07-05').toISOString()

  const urls = [
    '',
    '/git-playground',
    '/git-playground?tab=playground',
    '/git-playground?tab=lessons',
    '/git-playground?tab=commands',
    '/git-playground?tab=visualization',
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
    <url>
      <loc>${baseUrl}${url}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${url === '' ? '1.0' : '0.8'}</priority>
    </url>`
    )
    .join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
