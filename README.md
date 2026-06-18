# Sample Hold Lab

Sample Hold Lab is a small browser-based control-voltage learning app.

It shows how Sample & Hold, Track & Hold, slew, timing jitter, and Super S&H behaviour affect a visible control-voltage graph.

It also includes one safe audio demo:

```text
held/slewed main CV -> oscillator pitch
```

## Live app

Open the current GitHub Pages build here:

```text
https://armpitpete.github.io/sample-hold-lab/
```

## Current prototype state

Current working direction: **live teaching workbench**.

The desktop layout is designed so the user can adjust controls and watch the scope at the same time:

```text
controls | scope graph
```

The graph restarts when key settings change, so the effect is easier to see immediately.

## Current audio boundary

The only audio-connected path is:

```text
held/slewed main CV -> oscillator pitch
```

Only **Pitch** is audio-connected.

These remain visual only:

- filter cutoff
- level
- Super high companion output
- Super low companion output

## What this project teaches

The app shows how a changing voltage becomes a held or tracked control signal.

Core idea:

```text
input voltage -> trigger/gate timing -> held/tracked output -> slew -> visual destination -> safe pitch demo
```

It is designed to make the behaviour visible before using these ideas in hardware, VCV Rack, or a larger synth project.

## What this project is

This project is:

- a visual CV behaviour lab
- a teaching aid for Sample & Hold concepts
- a live graph workbench
- a limited visual destination demo
- a safe single-oscillator pitch demo
- a small Vite + TypeScript browser app

## What this project is not

This project is not:

- a full audio synth
- a VCO / VCF / VCA app
- a real synth voice
- a VCV Rack module
- a Daisy hardware project
- a hardware simulator
- a Tauri desktop app yet
- a free-patching modular environment
- a preset system
- a save/load system
- a quantiser
- a probability sequencer
- a burst sampler
- an external MIDI/CV input system
- a modulation matrix

## Current inputs

### LFO

LFO creates a continuously changing visual voltage.

### Noise

Noise creates an irregular changing visual voltage.

### Manual CV

Manual CV lets the user set a fixed visual voltage with a slider.

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

Only the main held/slewed path controls oscillator pitch.

## Current destinations

### Scope

Scope shows the input, raw held value, slewed main output, and Super S&H companion outputs.

### Pitch

Pitch is the only audio-connected destination.

When audio is running, one quiet oscillator follows the existing slewed main held CV.

### Filter cutoff

Filter cutoff shows how the held CV would open or close a filter cutoff visually.

No filter or filter audio is running.

### Level

Level shows how the held CV would change output level visually.

No amplifier or level audio is running.

## Audio safety

The app has one audio safety section.

It includes:

- Start Audio
- Panic / Stop Audio
- status readout
- safe output clamp readout
- oscillator pitch readout

Pressing **Start Audio** starts one quiet sine oscillator.

Pressing **Panic / Stop Audio** stops and disconnects the oscillator.

## Run locally

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

## GitHub Pages deployment

The repo uses GitHub Actions to build and deploy the app to GitHub Pages.

Workflow file:

```text
.github/workflows/pages.yml
```

The workflow runs on pushes to `main` and can also be started manually from the GitHub Actions tab.

It builds the Vite app and deploys the generated `dist/` folder to GitHub Pages.

Required GitHub Pages setting:

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

## Manual

The beginner manual starts here:

```text
docs/MANUAL.md
```

Manual-as-we-go rule:

- update the manual as the app changes
- explain what the user sees
- explain what the user hears
- explain what remains visual only
- avoid adding more audio features before the current behaviour is explained clearly

## Current controls

| Control | Purpose |
|---|---|
| Input source | Choose LFO, Noise, or Manual CV |
| Mode | Choose S&H, T&H, or Super S&H |
| Destination | Choose Scope, Pitch, Filter cutoff, or Level |
| Manual trigger | Fire a trigger immediately |
| Clock / gate rate | Change the automatic event speed |
| Slew amount | Smooth output movement toward the raw target |
| Timing jitter | Make automatic trigger/gate timing less exact |
| Start Audio | Start one quiet oscillator |
| Panic / Stop Audio | Stop and disconnect the oscillator |

## Do not add without planning

Do not add these without a separate planning issue:

- filter audio
- level audio
- VCF / VCA
- MIDI
- presets
- save/load
- patch cables
- modulation matrix
- extra oscillators
- effects
- new audio destinations
