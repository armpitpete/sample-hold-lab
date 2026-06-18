# GitHub Pages deployment v7.6

## Purpose

Build and deploy Sample Hold Lab inside GitHub.

This uses GitHub Actions to build the Vite app and publish the generated `dist/` folder to GitHub Pages.

## What changed

Added:

```text
.github/workflows/pages.yml
```

Updated:

```text
vite.config.ts
```

## Build workflow

The workflow runs on pushes to `main` and can also be started manually from the Actions tab.

It does this:

1. checks out the repo
2. sets up Node 22
3. installs dependencies with `npm install`
4. runs `npm run build`
5. uploads `dist/` as a Pages artifact
6. deploys the artifact to GitHub Pages

## Vite Pages config

`vite.config.ts` now uses:

```ts
base: './'
```

This keeps built asset paths relative, which is safer for a GitHub Pages project site.

The Vite HTML transform now injects the current active modules:

```text
src/destination-selector.ts
src/patch-summary.ts
src/audio-safety-controls.ts
```

The old `src/audio-safety.ts` shim is no longer injected into built pages.

## GitHub setting required

In the repository settings, GitHub Pages should use:

```text
Source: GitHub Actions
```

Path/source branch publishing is not needed because the workflow deploys the built artifact.

## Current audio boundary

The only audio path remains:

```text
held/slewed main CV -> oscillator pitch
```

## Still visual only

- filter cutoff
- level
- Super high companion output
- Super low companion output

## What did not change

- no filter audio
- no level audio
- no VCF / VCA
- no MIDI
- no presets
- no patch cables
- no modulation matrix
- no extra oscillator
- no effects
- no new destination
