---
title: Architecture
---

## The Stack

StatiCart is three layers:

**Static Site (CDN)** — product pages, cart (localStorage), SPA powered by Hybrids.js. Served from S3+CloudFront or Cloudflare Pages. No server needed for browsing, searching, or managing your cart.

**Thin API (Lambda)** — five endpoints, each a single-purpose Lambda function behind API Gateway:

- `POST /checkout` — validates stock, creates Stripe Checkout Session
- `POST /webhook` — Stripe webhook receiver, decrements stock, records order, triggers rebuild
- `GET /stock/:sku` — real-time stock check before checkout
- `GET /orders` — order history lookup by email
- `GET /session/:id` — Stripe session details for post-checkout user identification

**Database (DynamoDB)** — single table design. Products keyed by SKU with stock counts. Orders keyed by order ID with email GSI for history lookup. Conditional writes prevent overselling.

![StatiCart architecture diagram](/assets/architecture.svg)

## How a Purchase Works

1. Customer browses the static catalog, adds items to cart (localStorage)
2. "Checkout" POSTs cart items to `/api/checkout`
3. API validates stock against DynamoDB (conditional check)
4. API creates a Stripe Checkout Session with line items, shipping, and tax
5. Customer completes payment on Stripe's hosted checkout page
6. Stripe sends `checkout.session.completed` webhook to `/api/webhook`
7. Webhook handler (idempotent) decrements stock in DynamoDB, records the order
8. Webhook triggers a GitHub Actions rebuild
9. Build script reads DynamoDB, generates fresh `products.json`, deploys to CDN
10. Static site now shows updated stock counts

The entire server-side path is steps 3-9. Everything else is static.

## Platform Stacking

StatiCart is built on [Clearstack](https://clearstacks.org), a no-build web component specification. Clearstack provides the project scaffold, spec compliance checks, and development conventions. StatiCart adds e-commerce on top.

When you create a store, you get a Clearstack project with StatiCart vendored in:

```
my-store/
├── src/
│   ├── vendor/staticart/    # Platform components (managed, gitignored)
│   ├── components/          # Your overrides (project-owned)
│   ├── styles/tokens.css    # Your brand (project-owned)
│   └── data/products.json   # Your catalog (project-owned)
├── api/                     # Lambda handlers (customizable)
├── staticart.config.json    # Your store config (project-owned)
└── package.json
```

The platform owns the vendor directory. You own everything else. Updates re-vendor without touching your customizations.

## Limitations

StatiCart is deliberately limited in scope:

- **No admin dashboard** — manage products via JSON files and CLI scripts
- **No user accounts** — order history is email-based, no passwords
- **No real-time inventory** — stock updates require a site rebuild (typically < 60 seconds)
- **No CMS** — product data is static JSON, content pages are markdown files
- **Single currency per store** — set in config, applied globally

These aren't bugs — they're the boundaries that keep hosting costs near zero and complexity manageable. If you need a full CMS with user accounts and real-time inventory, StatiCart isn't the right tool. If you need a store that costs pennies to run and deploys from a git push, it is.
