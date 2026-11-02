# Shared foundation handoff

- Shared layout: `app/layout.tsx`; navbar: `components/shared/navbar.tsx`; singleton background: `components/shared/background.tsx`.
- Shared imports: `Button`, `Card`, `Badge`, `TokenLogo`, `TokenRow`, `Tabs`, `Dialog` from `@/components/shared/ui`.
- Contracts and fixtures: `Balance`, `ChannelStatus`, `ProtectionRule`, `Activity`, `TokenSymbol`, `balances`, `channel`, `protectionRules`, `activity`, `DEMO_RATE`, `formatAmount` from `@/lib/demo`.
- Tokens, component styles and responsive shell: `app/globals.css`. Tailwind v4 available.
- Agent 1 owns shared files, dependencies, `app/trade/page.tsx`, `components/trade/**`.
- Agent 2 may replace `app/portfolio/page.tsx` and owns `components/portfolio/**`.
- Agent 3 may replace `app/channels/page.tsx` and owns `components/channels/**`.
- Portfolio and Channels currently contain starter views only. Their full implementation is outside Agent 1 scope.
- All interactions must remain explicitly demo only. No signing, RPC, or real funds. USDC integration is unverified.
- Trade has local component state only; fixtures are initial demo snapshots, not a synchronized store.
- Logo assets: the supplied CKB mark and the USDC mark from Trust Wallet's asset registry (see public/tokens/SOURCES.md). Text fallback on load failure.
