/**
 * Site header — logo mark + nav links, persistent across pages.
 * @module components/organisms/site-header
 */

import { html, define } from 'hybrids';
import '#atoms/theme-toggle/theme-toggle.js';

/** @param {string} href @param {string} path */
function isActive(href, path) {
  return href === '/' ? path === '/' : path.startsWith(href);
}

/** @param {string} href @param {string} label @param {string} path */
function navLink(href, label, path) {
  const cls = isActive(href, path) ? 'site-header__link site-header__link--active' : 'site-header__link';
  return html`<a href="${href}" class="${cls}">${label}</a>`;
}

export default define({
  tag: 'site-header',
  menuOpen: false,
  currentPath: {
    value: () => window.location.pathname,
    connect(host, _key, invalidate) {
      let last = window.location.pathname;
      const update = () => {
        const cur = window.location.pathname;
        if (last !== cur) {
          last = cur;
          host.menuOpen = false;
          invalidate();
        }
      };
      window.addEventListener('popstate', update);
      const id = setInterval(update, 300);
      return () => {
        window.removeEventListener('popstate', update);
        clearInterval(id);
      };
    },
  },
  render: {
    value: ({ menuOpen, currentPath }) => html`
      <header class="site-header">
        <div class="site-header__inner">
          <a href="/" class="site-header__logo">
            <img src="/assets/staticart_logo_mark.svg" alt="StatiCart" class="site-header__logo-img" />
          </a>
          <nav class="site-header__nav ${menuOpen ? 'site-header__nav--open' : ''}">
            ${navLink('/', 'Home', currentPath)}
            ${navLink('/page/features', 'Features', currentPath)}
            ${navLink('/page/architecture', 'Architecture', currentPath)}
            ${navLink('/page/about', 'About', currentPath)}
            <a href="https://github.com/techninja/staticart" class="site-header__link">GitHub</a>
            <theme-toggle></theme-toggle>
            <a href="https://shop.staticart.org" class="btn btn-primary btn-sm">Shop</a>
          </nav>
          <div class="site-header__mobile">
            <theme-toggle></theme-toggle>
            <button class="site-header__burger" onclick="${html.set('menuOpen', !menuOpen)}">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
    `,
    shadow: false,
  },
});
