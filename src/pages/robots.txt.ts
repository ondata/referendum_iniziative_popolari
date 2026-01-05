import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Costruisci l'URL della sitemap dinamicamente
  let sitemapUrl = '';
  if (site) {
    const siteUrl = site.toString().replace(/\/$/, '');
    const cleanBase = baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '');
    sitemapUrl = `${siteUrl}${cleanBase}/sitemap-index.xml`;
  }

  const content = `User-agent: *
Allow: /
${sitemapUrl ? `\nSitemap: ${sitemapUrl}` : ''}`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
