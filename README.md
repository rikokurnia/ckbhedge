# CKBHedge

A web-based CKB hedging and instant-swap terminal designed for the Nervos Fiber Network.

CKBHedge helps ecosystem builders, grant recipients, and traders explore ways to protect CKB holdings during market volatility. It combines two-way swaps, manual hedging, rule-based protection, and channel liquidity management in one interface.

> **Status:** Frontend prototype with simulated transactions and market data.

![CKBHedge Trade screen](artifacts/trade-swap-desktop.png)

## Why CKBHedge?

Teams holding grants or operating funds in CKB are exposed to price changes while they wait for on-chain transactions or exchange deposits. CKBHedge is designed to offer a browser-based, non-custodial alternative using pre-funded Fiber payment channels.

The planned system targets low-latency off-chain swaps without an L1 miner fee for each in-channel swap. Channel funding and settlement would still require on-chain transactions, and execution would depend on liquidity.

## Features

| Page                       | Frontend capabilities                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Trade**                  | CKB ↔ USDC demo swaps, amount and percentage controls, direction reversal, slippage selection, quote review, and simulated results.                                            |
| **Protect** (within Trade) | Manual percentage hedges; stop-loss, trailing-stop, and simulated AI signal settings; notification or automatic execution policies; spending limits and session expiry review. |
| **Portfolio**              | Demo asset balances, allocation and protection summaries, activity details, and protection management controls.                                                                |
| **Channels**               | Demo channel status, local capacity and liquidity, setup and funding dialogs, channel closure, and activity history.                                                           |

The shared interface includes responsive navigation, accessible dialog and tab primitives, local token logos, and a subtle green aurora background with reduced-motion support.

## Getting started

### Requirements

- Node.js **26.x** (see `.nvmrc`)
- npm

### Installation

```sh
git clone https://github.com/rikokurnia/ckbhedge.git
cd ckbhedge
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home route redirects to `/trade`.

No environment variables, wallet, API keys, or local blockchain node are required for this demo.

### Available commands

| Command             | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start the development server.              |
| `npm run typecheck` | Run TypeScript checks.                     |
| `npm run build`     | Create a production build.                 |
| `npm run start`     | Serve the production build after building. |

## Project structure

```text
app/
  layout.tsx              Shared application shell
  globals.css             Design tokens and shared styling
  trade/                  Trade route
  portfolio/              Portfolio route
  channels/               Channels route
components/
  shared/                 Navigation, background, and reusable UI
  trade/                  Swap, protection, and demo chart
  portfolio/              Portfolio views and interactions
  channels/               Channel management views and dialogs
lib/demo.ts               Shared typed demo contracts and fixtures
public/tokens/            Local token assets and source attribution
artifacts/                Trade screenshots
```

**Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, Radix UI primitives, and Lucide icons. The current chart is a custom SVG visualization with responsive HTML labels.

## Deployment

Import this repository into Vercel using the **Next.js** preset and the repository root. No environment variables are required for the frontend demo. See [DEPLOYMENT.md](DEPLOYMENT.md) for settings and verification commands.
