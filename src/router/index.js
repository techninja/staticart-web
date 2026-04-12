/**
 * App router — header + page stack + footer.
 * @module router
 */

import { html, define, router } from 'hybrids';
import '#organisms/site-header/site-header.js';
import '#organisms/site-footer/site-footer.js';
import LandingView from '#pages/landing/landing-view.js';

export default define({
  tag: 'app-router',
  stack: router(LandingView, { url: '/' }),
  render: {
    value: ({ stack }) => html`
      <div class="app-router">
        <site-header></site-header>
        <main class="app-main">${stack}</main>
        <site-footer></site-footer>
      </div>
    `,
    shadow: false,
  },
});
