# Sample Hold Lab

Sample Hold Lab is a small visual control-voltage learning app.

It explains Sample & Hold, Track & Hold, slew, timing jitter, and Super S&H behaviour through visible signal flow.

Current stable prototype: **v0.8**.

## What this project teaches

The app shows how a changing voltage becomes a held or tracked control signal.

Core idea:

```text
input voltage -> trigger/gate timing -> held/tracked output -> slew -> jitter -> Super S&H comparison
```

It is designed to make the behaviour visible before using these ideas in hardware, VCV Rack, or a larger synth project.

## What this project is

This project is:

- a visual CV behaviour lab
- a teaching aid for Sample & Hold concepts
- a fixed-patch prototype
- a small Vite + TypeScript browser app
- a stable reference build after v0.7

## What this project is not

This project is not:

- an audio synth
- a VCO / VCF / VCA app
- a VCV Rack module
- a Daisy hardware project
- a hardware simulator
- a Tauri desktop app yet
- a free-patching modular environment
- a preset system
- a quantiser
- a probability sequencer
- a burst sampler

## Current modes

### S&H

Sample & Hold captures one raw target when triggered, then holds it.

Manual trigger and jittered clock trigger are available.

### T&H

Track & Hold follows the input while the gate is open, then holds the last value when the gate closes.

The gate edges can be jittered visually.

### Super S&H

Super S&H is visual only in this prototype.

One trigger creates three related held/slewed visual outputs:

- main output
- Super high companion output
- Super low companion output

This shows how one trigger can produce several related control paths.

## Controls

| Control | Purpose |
|---|---|
| Mode | Choose S&H, T&H, or Super S&H |
| Manual trigger | Fire a trigger immediately |
| Clock / gate rate | Change the automatic event speed |
| Slew amount | Smooth output movement toward the raw target |
| Timing jitter | Move automatic trigger/gate timing slightly before or after the regular clock reference |

## Version summary

| Version | Purpose | Status |
|---|---|---|
| v0.1 | Fixed visual S&H patch | Complete |
| v0.2 | Clearer scope and voltage labels | Complete |
| v0.3 | Automatic clock trigger | Complete |
| v0.4 | Track & Hold mode | Complete |
| v0.5 | Slew control | Complete |
| v0.6 | Timing jitter control | Complete |
| v0.7 | Super S&H visual comparison | Complete |
| v0.8 | Stable prototype documentation and freeze | Current |

## Run locally

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Build the project:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## Local test checklist

Before closing the v0.8 stable prototype issue, check:

```text
1. npm install completes.
2. npm run dev starts the Vite server.
3. npm run build completes.
4. S&H mode still captures and holds.
5. T&H mode still tracks while gate is open and holds when gate closes.
6. Slew still smooths output movement.
7. Timing jitter still shifts automatic timing only.
8. Super S&H still shows multiple related held/slewed outputs.
9. No audio, VCO, free patching, quantising, probability, or presets have been added.
```

## Freeze rule

v0.8 freezes the first complete visual prototype.

Do not add more synth behaviour directly on top of this freeze.

Future work should be opened as separate issues and should stay clearly scoped.

Possible later phases:

- limited selectable connections
- optional VCO pitch demo
- optional VCF cutoff demo
- Tauri desktop wrapper
- proper free patching
- quantised S&H
- probability sampling
- burst sampling

These are later extensions, not part of the v0.8 stable prototype.

## Licence

MIT.
