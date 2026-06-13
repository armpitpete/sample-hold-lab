# Sample Hold Lab

Sample Hold Lab is a small visual control-voltage learning app.

It explains Sample & Hold, Track & Hold, slew, timing jitter, Super S&H behaviour, limited visual patch choices, visual destination demos, and a frozen first audio demo through visible signal flow.

Current prototype: **v2.8**.

Current stable visual freeze: **v2.3**.

## Current build

**v2.8 freezes the first working audio demo boundary.**

The first audio demo is now treated as stable enough to stop and document before any more sound features are added.

There is one audio path:

```text
held/slewed main CV -> oscillator pitch
```

The Audio Demo / Safety panel can start one quiet oscillator and stop it with Panic / Stop Audio.

The oscillator pitch is controlled by the existing slewed held CV value. LFO, Noise, and Manual CV can all drive the held-CV-to-pitch demo through the existing S&H, T&H, and Super S&H behaviour.

The pitch range remains clamped safely:

- low: 110 Hz
- centre: 220 Hz
- high: 440 Hz

This build does not add filter audio, level audio, VCF, VCA, effects, MIDI, presets, save/load, free patch cables, a modulation matrix, multiple oscillators, multiple audio destinations, or a full synth voice.

## Phase 4 plan

Phase 4 adds sound only in small, safe steps.

Safe order:

1. Add audio safety controls first. Complete in v2.5.
2. Add one oscillator only. Complete in v2.6.
3. Map held CV to pitch only. Complete in v2.7.
4. Check and freeze the first audio demo boundary. Current in v2.8.
5. Stop before filter or level audio demos.

Phase 4 should demonstrate held CV. It should not turn Sample Hold Lab into a full synth.

## What this project teaches

The app shows how a changing voltage becomes a held or tracked control signal, then shows how that held control voltage could be sent to different visual destinations.

Core idea:

```text
input voltage -> trigger/gate timing -> held/tracked output -> slew -> visual destination -> safe pitch demo
```

It is designed to make the behaviour visible before using these ideas in hardware, VCV Rack, or a larger synth project.

## What this project is

This project is:

- a visual CV behaviour lab
- a teaching aid for Sample & Hold concepts
- a limited patchable visual prototype
- a visual destination demo layer
- a frozen first audio demo
- a safe single-oscillator pitch demo
- a small Vite + TypeScript browser app
- a Phase 4 boundary freeze after the v2.7 held-CV-to-pitch build

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

### Pitch visual demo

Pitch shows how the held CV moves pitch visually.

The audio oscillator also follows the existing slewed main held CV while audio is running.

### Filter cutoff visual demo

Filter cutoff shows how the held CV would open or close a filter cutoff visually.

No filter or filter audio is running.

### Level visual demo

Level shows how the held CV would change output level visually.

No amplifier or level audio is running.

## Audio Demo / Safety panel

The safety panel is the controlled audio area for Phase 4.

It includes:

- Start Audio button
- Panic / Stop Audio button
- status text: Audio off, Audio running, Audio stopped, or Audio unavailable
- safe output clamp readout
- live oscillator pitch readout

Pressing Start Audio starts one quiet sine oscillator.

The oscillator pitch follows the existing slewed main held CV value while audio is running.

Pressing Panic / Stop Audio stops and disconnects the oscillator.

Only oscillator pitch is audio-controlled.

These remain visual only:

- filter cutoff
- level
- Super high companion output
- Super low companion output

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
| Start Audio | Start one quiet oscillator whose pitch follows held CV |
| Panic / Stop Audio | Stop and disconnect the oscillator |

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
| v2.3 | Phase 3 stable freeze | Frozen |
| v2.4 | Plan Phase 4 limited audio demo | Complete |
| v2.5 | Add audio safety controls only | Complete |
| v2.6 | Add one simple oscillator only | Complete |
| v2.7 | Map held CV to oscillator pitch only | Complete |
| v2.8 | Audio demo behaviour check and boundary freeze | Current |

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

Before closing the v2.8 boundary freeze issue, check:

```text
1. npm install completes.
2. npm run dev starts the Vite server.
3. npm run build completes.
4. App loads without console-breaking errors.
5. Visible prototype label shows Software Prototype v2.8.
6. Start Audio starts one quiet oscillator.
7. Panic / Stop Audio silences it immediately.
8. LFO can drive held-CV-to-pitch.
9. Noise can drive held-CV-to-pitch.
10. Manual CV can drive held-CV-to-pitch.
11. S&H changes pitch on held values.
12. T&H changes pitch while tracking and holds pitch while holding.
13. Super S&H still keeps one main pitch path only.
14. Oscillator pitch readout updates.
15. Output level stays low and clamped.
16. No autoplay.
17. Audio starts only after user action.
18. Filter cutoff remains visual only.
19. Level remains visual only.
20. Super high and Super low companion outputs remain visual only.
21. No filter audio, level audio, MIDI, presets, save/load, free patch cables, modulation matrix, multiple oscillators, multiple audio destinations, or synth voice architecture has been added.
```

## Freeze rule

v2.3 freezes Phase 3 as a stable visual destination demo layer.

v2.4 plans Phase 4 boundaries.

v2.5 adds the safety controls only.

v2.6 adds one fixed quiet oscillator only.

v2.7 maps held CV to oscillator pitch only.

v2.8 freezes the first working audio demo boundary.

Do not add filter audio or level audio directly on top of this boundary freeze.

Future work should be opened as separate issues and should stay clearly scoped.

Possible later Phase 4 issues:

- decide whether to stop Phase 4 here
- plan next audio destination carefully before adding it
- only then consider filter audio or level audio as separate issues

These are later extensions, not part of the v2.8 boundary freeze.

## Licence

MIT.
