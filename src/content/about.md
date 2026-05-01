---
title: About StatiCart
---

## The Idea

Most e-commerce platforms are massive. Shopify, WooCommerce, Magento — they're built for every possible use case, which means they're complex, expensive, or both. If you just want to sell some things online without a monthly bill, your options are limited.

StatiCart asks: *what if 99% of your store was just static files on a CDN?*

Browsing products, searching, filtering, managing a cart — none of that needs a server. The only moments that require server-side code are checkout (creating a Stripe session), payment confirmation (webhook), and stock queries. That's five Lambda functions. Everything else is HTML, CSS, and JavaScript served from a CDN.

The result: a full-featured store that costs pennies to host.

## The Stack

StatiCart is built on two open source projects:

**[Clearstack](https://clearstacks.org)** — a no-build web component specification. ES modules served directly, no bundler, no compile step. Hybrids.js for components and state. Import maps for dependency resolution. Every file you write is the file the browser loads.

**[Stripe](https://stripe.com)** — handles all payment processing. StatiCart never touches card data. Stripe Checkout provides the payment form, Stripe webhooks confirm orders.

Infrastructure runs on AWS (Lambda + DynamoDB + S3/CloudFront) or Cloudflare Pages + Workers. The API layer is deployed via AWS SAM.

## Open Source

StatiCart is MIT licensed. The source is on [GitHub](https://github.com/techninja/staticart). The package is on [npm](https://www.npmjs.com/package/@techninja/staticart).

Contributions welcome — especially translations, shipping adapters, and import scripts for migrating from other platforms.

## Who Made This

StatiCart was built by [techninja](https://github.com/techninja) as a practical answer to "how cheaply can you run a real online store?" The answer turned out to be: almost free.

Built by [James Todd](https://github.com/techninja) — open source developer, API architect, and privacy advocate. Building tools that respect your data.
