# Total

A small PWA for adding up board game scores at the table. Built for iPhone: add it
to your home screen and it runs full screen and offline.

**Live:** https://shaansen.github.io/total/

## How it works

1. **Players** — go round the table once and add everyone.
2. **Score** — one scoring category at a time. Name the category, then ask each
   player in turn and type their points. Every row shows that player's running
   total. **Next category →** moves on; **Finish · totals** stops whenever the
   game is done, whether that took 2 categories or 10.
3. **Sheet** — the whole grid with column totals. Tap any number to jump back and
   fix it.
4. **Ranks** — standings, gap behind the leader, ties shared properly (1, 2, 2, 4).

Whole numbers only, negatives via the ± button, blank cells count as 0. Everything
auto-saves to the browser, and ⋯ switches between highest-wins and lowest-wins.

## Development

```sh
npm install
npm run dev      # http://localhost:5173/total/
npm run build    # static output in dist/
node test-score.mjs   # checks the maths: totals, ties, ranking, input parsing
```

Stack: React + Vite + Tailwind CSS, Radix dialogs, vite-plugin-pwa for the
manifest and service worker. Pushing to `main` builds and deploys via GitHub
Actions (`.github/workflows/deploy.yml`).
