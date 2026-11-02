# Deploying CKBHedge to Vercel

Import **rikokurnia/ckbhedge** in Vercel and use:

| Setting               | Value                                          |
| --------------------- | ---------------------------------------------- |
| Framework preset      | Next.js                                        |
| Root directory        | Repository root (`.`)                          |
| Node.js               | 26.x (declared in `package.json` and `.nvmrc`) |
| Install command       | `npm ci`                                       |
| Build command         | `npm run build`                                |
| Output directory      | Next.js default; leave the override disabled   |
| Environment variables | None required                                  |

The GitHub repository already contains the application at its root. Do not enter the local parent workspace path as Vercel's root directory.

Vercel supports Next.js without a custom `vercel.json`, static-export configuration, or catch-all rewrite. Keep the default routing so direct visits to `/trade`, `/portfolio`, and `/channels` work and `/` redirects to Trade.

## Local verification

```sh
nvm use
npm ci
npm test
npm run typecheck
npm run build
npm run start -- --port 3100
```

Open `http://localhost:3100` and each application route. Use a production build for this check, rather than `next dev`.

After Vercel creates a preview, verify the three routes, local token images, swap review, and channel dialogs on that preview URL. Local verification cannot establish whether a remote deployment succeeded.

## Runtime recovery

Saved channel data is validated before rendering. Invalid or obsolete saved data falls back to the initial demo state, and blocked browser storage does not prevent the page from loading. Clipboard permission failures display a message instead of leaving a rejected promise.

Route and root-layout error screens provide recovery actions, and unknown routes have a dedicated 404 page. These reduce the impact of unexpected failures; they do not guarantee that every possible runtime error is prevented.

GitHub Actions checks installation, storage regression tests, TypeScript, and the production build on pushes to `main` and pull requests.

The deployment remains a frontend demo. It does not require or establish wallet, RPC, RFQ, AI, or funds-movement integrations.

References: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
