import katex from 'katex';

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Plain text with inline $…$ math, rendered to HTML at build time. */
export function inlineTex(text: string): string {
  return text
    .split(/(\$[^$]+\$)/g)
    .map((part) =>
      part.startsWith('$') && part.endsWith('$') && part.length > 2
        ? katex.renderToString(part.slice(1, -1), { throwOnError: false })
        : escapeHtml(part),
    )
    .join('');
}
