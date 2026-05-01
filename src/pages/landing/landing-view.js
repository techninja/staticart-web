/**
 * Landing page — hero, features, quickstart, architecture, CTAs.
 * @module pages/landing
 */

import { html, define, router } from 'hybrids';
import ContentPageView from '#pages/content/content-page-view.js';
import '#molecules/arch-diagram/index.js';

export default define({
  tag: 'landing-view',
  [router.connect]: { url: '/', stack: [ContentPageView] },
  render: {
    value: () => html`
      <div class="landing">
        <section class="hero">
          <img src="/assets/staticart_logo.svg" alt="StatiCart" class="hero__logo" />
          <h1 class="sr-only">StatiCart</h1>
          <p class="hero__tagline">
            Free and open source, cheaply hosted, Stripe-powered,
            full-featured, limited-scope e-commerce platform.
          </p>
          <div class="hero__cta">
            <a href="https://github.com/techninja/staticart" class="btn btn-primary">
              Get Started
            </a>
            <a href="https://shop.staticart.org" class="btn btn-secondary">Live Demo</a>
          </div>
        </section>

        <section class="features">
          <h2>Why StatiCart?</h2>
          <div class="features__grid">
            <div class="feature">
              <h3>99% Static</h3>
              <p>Your storefront is static HTML, CSS, and JS on a CDN. No server rendering.</p>
            </div>
            <div class="feature">
              <h3>Stripe Checkout</h3>
              <p>Secure payments handled by Stripe. Your server never touches card data.</p>
            </div>
            <div class="feature">
              <h3>Pennies to Host</h3>
              <p>Static CDN + a few Lambda calls per order. Most stores cost under $1/month.</p>
            </div>
            <div class="feature">
              <h3>No Build Step</h3>
              <p>ES modules served directly. No webpack, no bundler, no compile step.</p>
            </div>
            <div class="feature">
              <h3>Override Everything</h3>
              <p>Swap any component via import map. Override styles with CSS custom properties.</p>
            </div>
            <div class="feature">
              <h3>i18n Ready</h3>
              <p>4-layer translation cascade. Platform UI + your product terms, independently.</p>
            </div>
          </div>
        </section>

        <section class="quickstart">
          <h2>Up and Running in 60 Seconds</h2>
          <pre><code>mkdir my-store && cd my-store
npm init -y
npm install @techninja/staticart
npm install -D @techninja/clearstack
npx clearstack init -y --static
npm install
npm run dev</code></pre>
        </section>

        <section class="arch">
          <h2>Architecture</h2>
          <p class="arch__desc">
            A thin API layer (5 Lambda functions) handles checkout, webhooks, and stock.
            Everything else is static. Stock changes trigger a rebuild that updates the CDN.
          </p>
          <div class="arch__diagram">
            <arch-diagram></arch-diagram>
          </div>
        </section>

        <section class="cta-footer">
          <h2>Ready to build?</h2>
          <p>StatiCart is MIT licensed and free forever.</p>
          <div class="hero__cta">
            <a href="https://github.com/techninja/staticart" class="btn btn-primary">
              View on GitHub
            </a>
            <a href="https://www.npmjs.com/package/@techninja/staticart" class="btn btn-secondary">
              npm
            </a>
          </div>
        </section>
      </div>
    `,
    shadow: false,
  },
});
