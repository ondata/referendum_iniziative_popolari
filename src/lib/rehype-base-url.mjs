import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to rewrite internal links to include BASE_URL
 * Converts /dati to /referendum_iniziative_popolari/dati in production
 */
export function rehypeBaseUrl(baseUrl) {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // Process all anchor tags
      if (node.tagName === 'a' && node.properties?.href) {
        let href = node.properties.href;

        // Check if href is a string, starts with /, and is not an external URL
        if (
          typeof href === 'string' &&
          href.startsWith('/') &&
          !href.startsWith('//') &&
          !href.match(/^https?:/)
        ) {
          // Only add base URL if it's not already there
          if (!href.startsWith(baseUrl)) {
            node.properties.href = baseUrl + href;
          }
        }
      }
    });
  };
}
