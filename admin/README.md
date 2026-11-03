# HARF · Panel de administración

Cloudflare Worker (free plan) that serves a password-protected panel to:
- see the Stripe balance and the last 30 days of orders;
- create, list, activate and deactivate discount codes (Stripe promotion codes).

Deploy: Cloudflare → Workers & Pages → Create → Import a repository → `zaid5195/harf`,
root directory `admin`. Then add three **Secret** variables in the Worker settings:
`STRIPE_KEY` (restricted key: Coupons write, Promotion codes write, Checkout Sessions read,
Balance read), `ADMIN_PASSWORD`, `SESSION_SECRET` (long random string).

No secret is stored in this repository.
