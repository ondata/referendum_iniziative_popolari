import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to validate that all images have meaningful alt text
 * Warns during build if images are missing or have empty alt text
 */
export function rehypeValidateAlt() {
  return (tree, file) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        const alt = node.properties?.alt;

        // Check if alt is missing or empty
        if (!alt || (typeof alt === 'string' && alt.trim().length === 0)) {
          const src = node.properties?.src || 'unknown';
          file.message(
            `Image missing alt text: ${src}. Please add a descriptive alt attribute for accessibility.`,
            node
          );
        }

        // Warn if alt text is too short (less than 10 characters)
        if (typeof alt === 'string' && alt.length > 0 && alt.length < 10) {
          const src = node.properties?.src || 'unknown';
          file.message(
            `Image alt text too short (${alt.length} chars): ${src}. Consider adding more descriptive text for screen readers.`,
            node
          );
        }
      }
    });
  };
}
