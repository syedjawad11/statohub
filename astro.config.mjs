import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const noindexRouteSegments = new Set(['normal-distribution']);

export default defineConfig({
  site: 'https://statohub.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const [firstSegment] = new URL(page).pathname.split('/').filter(Boolean);
        return !noindexRouteSegments.has(firstSegment);
      },
    }),
  ],
});
