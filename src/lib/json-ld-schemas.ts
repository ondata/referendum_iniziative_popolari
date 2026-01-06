/**
 * JSON-LD Schema generators for SEO
 */

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
}

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: {
    '@type': string;
    name: string;
  };
  datePublished: string;
  image?: string;
  url: string;
}

export interface BreadcrumbListSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

export interface SearchActionSchema {
  '@context': string;
  '@type': string;
  target: {
    '@type': string;
    urlTemplate: string;
  };
  'query-input': string;
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(baseUrl: string): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'onData',
    url: baseUrl,
    description:
      'Piattaforma di monitoraggio e analisi dei referendum e delle iniziative popolari italiane',
  };
}

/**
 * Generate Article schema for initiatives
 */
export function generateArticleSchema(
  initiative: {
    titolo: string;
    descrizioneBreve?: string;
    dataApertura: string;
  },
  baseUrl: string,
  initiativeId: number
): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: initiative.titolo,
    description:
      initiative.descrizioneBreve || initiative.titolo || 'Descrizione non disponibile',
    author: {
      '@type': 'Organization',
      name: 'Ministero della Giustizia',
    },
    datePublished: initiative.dataApertura,
    url: `${baseUrl}initiative/${initiativeId}/`,
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbListSchema(
  baseUrl: string,
  breadcrumbs: Array<{ name: string; url: string }>
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate SearchAction schema for sitelinks search box
 */
export function generateSearchActionSchema(baseUrl: string): SearchActionSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}?query={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  };
}
