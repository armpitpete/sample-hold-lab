# Sample Hold Lab

Sample Hold Lab is a small visual control-voltage learning app.

It explains Sample & Hold, Track & Hold, slew, timing jitter, Super S&H behaviour, limited visual patch choices, and visual destination demos through visible signal flow.

Current stable prototype: **v2.3**.

## Current freeze

**v2.3 freezes Phase 3.**

Phase 3 is a visual destination demo layer.

Pitch, filter cutoff, and level are still visual only. The app still has no audio engine, no real VCO / VCF / VCA sound, no real synth voice, and no free patch cables.

Later phases are not being built yet.

## What this project teaches

The app shows how a changing voltage becomes a held or tracked control signal, then shows how that held control voltage could be sent to different visual destinations.

Core idea:

```text
input voltage -> trigger/gate timing -> held/tracked output -> slew -> visual destination
```

It is designed to make the behaviour visible before using these ideas in hardware, VCV Rack, or a larger synth project.

## What this project is

This project is:

- a visual CV behaviour lab
- a teaching aid for Sample & Hold concepts
- a limited patchable visual prototype
- a visual destination demo layer
- a small Vite + TypeScript browser app
- a stable reference build after Phase 3

## What this project is not

This project is not:

- an audio synth
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

This shows how one trigger can produce several related control paths.

## Current destinations

### Scope

Scope shows the input, raw held value, slewed main output, and Super S&H companion outputs.

### Pitch visual demo

Pitch shows how the held CV would move pitch visually.

No oscillator or audio is running.

### Filter cutoff visual demo

Filter cutoff shows how the held CV would open or close a filter cutoff visually.

No filter or audio is running.

### Level visual demo

Level shows how the held CV would change output level visually.

No amplifier or audio is running.

## Controls

| Control | Purpose |
|---|---|
| Input source | Choose LFO, Noise, or Manual CV |
| Mode | Choose S&H, T&H, or Super S&H |
| Destination | Choose Scope, Pitch, Filter cutoff, or Level |
| Manual trigger | Fire a trigger immediately |
| Clock / gate rate | Change the automatic event speed |
| Slew amount | Smooth output movement toward the raw target |
| Timing jitter | Move automatic trigger/gate timing slightly before or after the regular clock reference |
| Patch summary | Show the current visual patch choices |

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
| v0.8 | Phase 1 stable freeze | Frozen |
| v0.9 | Phase planning | Complete |
| v1.0 | Selectable input source | Complete |
| v1.1 | Noise input source | Complete |
| v1.2 | Manual CV source | Complete |
| v1.3 | Visual destination selector | Complete |
| v1.4 | Patch summary panel | Complete |
| v1.5 | Phase 2 stable freeze | Frozen |
| v2.0 | Improved pitch-style visual destination | Complete |
| v2.1 | Improved filter-cutoff-style visual destination | Complete |
| v2.2 | Improved level-style visual destination | Complete |
| v2.3 | Phase 3 stable freeze | Current |

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

Before closing the v2.3 stable freeze issue, check:

```text
1. npm install completes.
2. npm run dev starts the Vite server.
3. npm run build completes.
4. App loads without console-breaking errors.
5. Visible prototype label shows Software Prototype v2.3.
6. LFO still works.
7. Noise still works.
8. Manual CV still works.
9. S&H mode still captures and holds.
10. T&H mode still tracks while gate is open and holds when gate closes.
11. Super S&H still shows multiple related held/slewed outputs.
12. Scope remains available.
13. Pitch visual demo responds to held CV.
14. Filter cutoff visual demo responds to held CV.
15. Level visual demo responds to held CV.
16. Patch summary updates correctly.
17. No audio, VCO, VCF, VCA, free patching, presets, save/load, quantising, probability, burst sampling, external MIDI/CV input, or modulation matrix has been added.
```

## Freeze rule

v2.3 freezes Phase 3 as a stable visual destination demo layer.

Do not add more synth behaviour directly on top of this freeze.

Future work should be opened as separate issues and should stay clearly scoped.

Possible later phases:

- first limited audio demo
- obvious mute/off control
- simple oscillator pitch demo
- simple filter or level demo
- Tauri desktop wrapper
- proper free patching
- quantised S&H
- probability sampling
- burst sampling

These are later extensions, not part of the v2.3 stable prototype.

## Licence

MIT.
