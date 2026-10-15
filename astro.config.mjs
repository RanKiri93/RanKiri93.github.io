// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://rankiri93.github.io',
  // Old Hugo URLs, so existing links keep working.
  redirects: {
    '/teaching': '/courses',
    '/publications': '/research',
    '/publications/subhomogeneous-operator-systems': '/research',
  },
  i18n: {
    locales: ['he', 'en'],
    defaultLocale: 'he',
    // Hebrew lives at the root (/courses/), English under /en/.
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // unified (remark/rehype) rather than the default Sätteri processor, for
    // LaTeX via remark-math + KaTeX. MDX inherits this processor.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
  vite: {
    // The PDF reader imports PDF.js lazily. Pre-bundle it at dev-server start,
    // or Vite finds it on the first open, re-optimizes, and that import 504s.
    optimizeDeps: { include: ['pdfjs-dist'] },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'he', locales: { he: 'he-IL', en: 'en-US' } },
    }),
  ],
});
