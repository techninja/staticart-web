/**
 * Content page — renders markdown from /content/<slug>.md with frontmatter.
 * @module pages/content
 */

import { html, define, router } from 'hybrids';
import { parseFrontmatter } from '#utils/parseFrontmatter.js';
import { renderMarkdown } from '#utils/renderMarkdown.js';

/** @param {string} slug @returns {Promise<{meta: any, html: string}|null>} */
async function loadPage(slug) {
  try {
    const res = await fetch(`/content/${slug}.md`);
    if (!res.ok) return null;
    const raw = await res.text();
    const { meta, content } = parseFrontmatter(raw);
    return { meta, html: renderMarkdown(content) };
  } catch {
    return null;
  }
}

export default define({
  tag: 'content-page-view',
  [router.connect]: { url: '/page/:slug', multiple: true, stack: [] },
  slug: '',
  page: {
    value: /** @type {any} */ (undefined),
    connect(host, _key, invalidate) {
      if (host.slug)
        loadPage(host.slug).then((p) => {
          host.page = p;
          invalidate();
        });
    },
    observe(host, val, prev) {
      if (prev !== undefined && val === undefined && host.slug) {
        loadPage(host.slug).then((p) => {
          host.page = p;
        });
      }
    },
  },
  render: {
    value: ({ page }) => {
      if (page === undefined) return html`<p>Loading…</p>`;
      if (!page) return html`<div class="content-page"><h1>Page not found</h1></div>`;
      return html`
        <div class="content-page">
          <a href="/" class="content-page__back">← Home</a>
          ${page.meta.title ? html`<h1>${page.meta.title}</h1>` : html``}
          <div class="content-page__body prose" innerHTML="${page.html}"></div>
        </div>
      `;
    },
    shadow: false,
  },
});
