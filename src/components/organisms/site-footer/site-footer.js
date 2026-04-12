/**
 * Site footer — links and copyright.
 * @module components/organisms/site-footer
 */

import { html, define } from 'hybrids';

export default define({
  tag: 'site-footer',
  render: {
    value: () => html`
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__brand">
            <img src="/assets/staticart_logo_mark.svg" alt="" class="site-footer__mark" />
            <p>Free and open source e-commerce.</p>
          </div>
          <div class="site-footer__links">
            <div class="site-footer__col">
              <span class="site-footer__heading">Project</span>
              <a href="/page/features">Features</a>
              <a href="/page/architecture">Architecture</a>
              <a href="https://shop.staticart.org">Demo Shop</a>
            </div>
            <div class="site-footer__col">
              <span class="site-footer__heading">Resources</span>
              <a href="https://github.com/techninja/staticart">GitHub</a>
              <a href="https://www.npmjs.com/package/@techninja/staticart">npm</a>
              <a href="/page/about">About</a>
            </div>
          </div>
        </div>
        <div class="site-footer__bottom">
          <p>© ${new Date().getFullYear()} StatiCart · MIT License</p>
        </div>
      </footer>
    `,
    shadow: false,
  },
});
