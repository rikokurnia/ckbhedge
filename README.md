# CKBHedge frontend

Next.js App Router, TypeScript, Tailwind v4, Lucide and Radix primitives.

```sh
npm install
npm run dev
npm run typecheck
npm run build
```

Visit `/trade`. `/` redirects to Trade. `/portfolio` and `/channels` are foundation starter pages for separate owners. See HANDOFF.md for imports, ownership and contracts.

All data is synthetic. Wallets, swaps and protection authorizations are demo interactions. No RPC, signing, market feed, session key, or background rule executor is connected. Balances and saved rules reset on navigation/reload. USDC integration is not verified.

The singleton background adapts the green light-fold look of React Bits Dark Veil with slow CSS animation and a static gradient fallback; it does not import the WebGL shader. Reduced motion disables animation. Assets are stored in public/tokens, with sources alongside them.
