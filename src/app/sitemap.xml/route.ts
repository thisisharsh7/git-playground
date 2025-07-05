import { NextResponse } from 'next/server';

export async function GET() {
  const urls = [
    {
      loc: 'https://my-git-playground.vercel.app',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      loc: 'https://my-git-playground.vercel.app/git-playground',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: 'https://my-git-playground.vercel.app/git-playground?tab=playground',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: 'https://my-git-playground.vercel.app/git-playground?tab=lessons',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: 'https://my-git-playground.vercel.app/git-playground?tab=commands',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: 'https://my-git-playground.vercel.app/git-playground?tab=visualization',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        ({ loc, lastmod, changefreq, priority }) => `
      <url>
        <loc>${loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
      </url>`
      )
      .join('')}
  </urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
