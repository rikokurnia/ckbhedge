# Token logo sources

- **CKB:** `ckb-logo.png`, supplied by the project owner from `random/ckb-logo.png`. The shared `TokenLogo` component uses this exact local asset across Trade, Portfolio, and Channels. CSS contains the image's existing outer padding without modifying the source file.
- **USDC:** https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png

TokenLogo falls back to the ticker if loading fails.
