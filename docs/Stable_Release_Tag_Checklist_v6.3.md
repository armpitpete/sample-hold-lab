# Stable release tag/checklist plan v6.3

## Purpose

Create a simple checklist for preparing a stable release or checkpoint tag.

This is a documentation-only checklist.

No app behaviour changed.

## Stable state to protect

The current stable boundary is:

```text
held/slewed main CV -> oscillator pitch
```

This is still the only audio path.

## Before tagging or naming the checkpoint

Use this checklist before creating a tag, release, or named checkpoint.

## 1. Local pull check

Run:

```powershell
git pull
```

Confirm:

- local branch is up to date
- no merge conflict appears
- no unexpected local changes are mixed into the checkpoint

## 2. Dependency/install check

Run only if dependencies may be missing or stale:

```powershell
npm install
```

Confirm:

- install completes
- no unexpected dependency changes are introduced
- no unrelated files are edited

## 3. Build check

Run:

```powershell
npm run build
```

Confirm:

- build completes successfully
- no TypeScript or bundler errors appear
- no app behaviour is changed as part of this checklist

## 4. Browser launch check

Run:

```powershell
npm run dev
```

Confirm:

- app opens in the browser
- page loads without a visible crash
- main controls are visible
- destination selector is visible
- audio safety controls are visible

## 5. Start Audio check

In the browser:

1. Press **Start Audio**.
2. Confirm one quiet oscillator starts.
3. Confirm the audio status shows main CV voltage and pitch in Hz.

Expected status shape:

```text
Audio running · main CV 0.00 V → 220 Hz
```

The values may change.

## 6. Panic / Stop Audio check

In the browser:

1. Press **Panic / Stop Audio**.
2. Confirm the oscillator stops.
3. Confirm the app remains usable.
4. Press **Start Audio** again.
5. Confirm audio can restart.

## 7. Repeated Start check

Press **Start Audio** more than once.

Confirm:

- oscillators do not stack
- the sound does not get louder with each press
- Panic / Stop Audio still silences the app

## 8. Pitch destination check

Set **Destination** to **Pitch**.

Confirm:

- dropdown shows **Pitch audio-connected**
- Pitch panel shows an **Audio-connected destination** badge
- Pitch helper text explains that the oscillator follows held/slewed main CV
- Start Audio still uses one oscillator only

## 9. Pitch behaviour check

With audio running:

- LFO into S&H changes pitch in stepped movement
- Noise into S&H changes pitch less predictably
- Manual CV into S&H allows controlled pitch tests
- T&H tracks while gate is open and holds when gate closes
- Slew amount smooths pitch movement

## 10. Visual-only boundary check

Confirm these remain visual only:

- filter cutoff
- level
- Super high companion output
- Super low companion output

They should not change sound.

They should not create extra notes.

They should not control separate oscillators.

## 11. Manual/checkpoint docs check

Confirm these files exist and still describe the current boundary:

- `docs/MANUAL.md`
- `docs/Stable_Release_Checkpoint_Summary_v6.1.md`
- `docs/Stable_Pitch_Demo_Checkpoint_v5.1.md`
- `docs/Stable_Pitch_Destination_Feedback_Checkpoint_v5.3.md`
- `docs/Phase_6_Next_Direction_Decision_v6.2.md`

The manual should still say:

```text
held/slewed main CV -> oscillator pitch
```

## 12. No accidental feature expansion check

Before tagging, confirm the checkpoint did not add:

- new audio routing
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
- new destinations

## Suggested tag/checkpoint name

Use a clear name such as:

```text
v6.3-stable-pitch-demo
```

or:

```text
stable-pitch-demo-v6.3
```

## Decision after checklist

If every check passes, the current state is suitable for a stable checkpoint/tag.

If any check fails, do not tag.

Open a small fix issue first.
