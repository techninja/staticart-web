---
title: Features
---

## Static-First Architecture

Your storefront is plain HTML, CSS, and ES modules served from a CDN. No server-side rendering, no build step, no framework runtime. The browser loads your store exactly as you wrote it.

The only server-side code is 5 thin Lambda functions that handle checkout, webhooks, stock queries, order history, and session lookup. Everything else is static.

## Stripe-Powered Checkout

Payments are handled entirely by Stripe Checkout. Your server creates a session, Stripe handles the payment form, and a webhook confirms the order. Your infrastructure never touches card data.

Supports automatic tax calculation, flat/tiered/custom shipping, and multiple currencies — all configured in a single JSON file.

## Pennies to Host

- **Static site:** S3 + CloudFront or Cloudflare Pages — free tier covers most stores
- **API:** Lambda invocations only on checkout — a few cents per order
- **Database:** DynamoDB on-demand — pay per request, free tier covers low volume
- **Total:** Most stores cost under $1/month until you're doing real volume

## No Build Step

Built on [Clearstack](https://clearstacks.org) — a no-build web component specification using [Hybrids.js](https://hybrids.js.org). ES modules served directly to the browser. Import maps resolve dependencies. No webpack, no Vite, no compile step.

Every file you write is the file the browser loads. Debug in devtools, see your actual source.

## Platform Stacking

StatiCart ships as an npm package. Install it, run `clearstack init`, and you have a complete store scaffolded with:

- All UI components vendored to `src/vendor/staticart/`
- A config file for branding, shipping, tax, and custom product fields
- API handlers ready for Lambda deployment
- Build scripts for production

Override any component by remapping it in the import map. Override styles with CSS custom properties. Override translations with locale files. Full control without forking.

## i18n

4-layer translation cascade:

- **Package defaults** — English UI chrome (buttons, labels, status text)
- **Package locale files** — translated UI chrome (Spanish included)
- **Project overrides** — your English terms (category names, custom labels)
- **Project locale overrides** — your translated terms

The platform translates "Add to Cart." You translate "Vintage Comics."

## Custom Product Fields

Declare custom metadata fields in your config:

```json
{
  "productFields": {
    "isbn": { "type": "string", "label": "ISBN" },
    "grade": { "type": "string", "label": "Condition" },
    "adult": { "type": "boolean", "label": "Adult Content" }
  }
}
```

Fields flow through automatically — the product detail page renders them, the build script includes them, no model changes needed.

## Flexible Shipping

Three models out of the box:

- **Flat rate** — single fixed amount
- **Tiered** — rate tiers by cart subtotal, with product classes (book vs tube) and regional pricing (US/Canada/International)
- **Custom** — provide your own shipping module for bespoke logic (dropshipping APIs, weight-based, etc.)
