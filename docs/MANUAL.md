# Sample Hold Lab Manual

Beginner guide for Sample Hold Lab.

This manual describes the current prototype state: **v2.9**.

The current manual pass is **v3.3**.

## Current decision

Phase 4 stops at **v2.8**.

**v2.9** records the stop decision.

Future work should move into the manual before more audio features.

That means this guide explains the current app before the project adds more sound.

## Current stable audio boundary

There is one audio path:

```text
held/slewed main CV -> oscillator pitch
```

That means the main held control voltage can change the pitch of one quiet oscillator.

Nothing else is connected to audio yet.

## Read this first

Sample Hold Lab is mainly a visual learning app.

It shows control voltage behaviour on screen.

Only one small part currently makes sound.

Use this simple rule:

```text
visual = shown on screen only
audio = changes the sound you hear
```

At the moment:

- the main held/slewed CV can change oscillator pitch
- filter cutoff is visual only
- level is visual only
- Super high is visual only
- Super low is visual only

## Quick start: first 5 minutes

Use this path the first time you open the app.

It keeps the patch simple.

Audio is optional.

1. Set **Input source** to **LFO**.
2. Set **Mode** to **S&H**.
3. Set **Destination** to **Scope**.
4. Watch the moving input trace.
5. Press **Manual trigger**.
6. Notice that the held value changes when the trigger happens.
7. Change **Slew amount**.
8. Notice that low slew moves quickly and high slew glides more slowly.
9. Optional: press **Start Audio**.
10. Listen to the oscillator pitch follow the held/slewed main CV.
11. Press **Panic / Stop Audio** when finished.

During this quick start, only pitch is connected to audio.

These parts remain visual only:

- filter cutoff
- level
- Super high companion output
- Super low companion output

If the sound is annoying, too much, or not needed, press **Panic / Stop Audio**.

The visual part of the app can still be used without audio.

## Mode cheat sheet

Use this section when you want to know which mode to try next.

The only audio path is still:

```text
held/slewed main CV -> oscillator pitch
```

Filter cutoff, level, Super high, and Super low remain visual only.

| Mode | What it does | What to watch on the Scope | If audio is running | Try it when... |
|---|---|---|---|---|
| S&H | Captures one input value when a trigger happens, then holds it. | Watch the input keep moving while the held value changes in steps. | Pitch changes in steps from one held value to the next. | You want the clearest first example of Sample & Hold. |
| T&H | Follows the input while the gate is open, then holds when the gate closes. | Watch the output move while tracking, then freeze while holding. | Pitch moves while tracking, then stays fixed while holding. | You want to compare following with holding. |
| Super S&H | Shows one main held output plus related Super high and Super low companion outputs. | Watch the main, Super high, and Super low outputs move as related paths. | Only the main output controls oscillator pitch. | You want to see related visual control paths from one sampled value. |

### Mode boundary

S&H, T&H, and Super S&H all help explain held control voltage.

They do not add new audio destinations.

In Super S&H, the companion outputs are visual only:

- Super high companion output
- Super low companion output

They do not make separate notes.

They do not control separate oscillators.

## Destination cheat sheet

Use this section when you want to know which destination to choose.

The destination selector changes what the app shows.

It does not mean every destination makes sound.

The only audio path is still:

```text
held/slewed main CV -> oscillator pitch
```

| Destination | What it shows | Audio or visual? | What to watch | If audio is running | Try it when... |
|---|---|---|---|---|---|
| Scope | The input, held value, slewed output, timing, and companion paths. | Visual only. | Watch how the voltage changes over time. | The scope itself makes no sound, but the main held/slewed CV can still control pitch. | You want to understand the patch before thinking about sound. |
| Pitch | How held CV can move pitch. | Audio-connected through the main held/slewed CV. | Watch pitch move with the held/slewed output. | The oscillator pitch follows the held/slewed main CV. | You want to hear the basic Sample & Hold pitch demo. |
| Filter cutoff | How held CV could open or close a filter. | Visual only. | Watch the cutoff-style movement. | It does not make the oscillator brighter or darker. | You want to understand cutoff control before filter audio exists. |
| Level | How held CV could change loudness. | Visual only. | Watch the level-style movement. | It does not make the oscillator louder or quieter. | You want to understand level control before VCA audio exists. |

### Destination boundary

Only **Pitch** is audio-connected.

These remain visual only:

- Scope traces
- filter cutoff
- level
- Super high companion output
- Super low companion output

Filter cutoff is not a VCF yet.

Level is not a VCA yet.

Super high and Super low do not make separate notes.

## 1. What Sample Hold Lab is

Sample Hold Lab is a small learning app for control voltage.

It shows what happens when a changing voltage is:

1. sampled
2. held
3. tracked
4. slewed
5. shown on a scope
6. sent to simple visual destinations
7. used to control one safe oscillator pitch demo

The app is not a full synth.

It is not trying to be VCV Rack.

It is not trying to be a VCO / VCF / VCA voice.

The purpose is narrower:

> Help a beginner see what Sample & Hold, Track & Hold, slew, jitter, and related held outputs do.

## 2. What a control voltage is

A control voltage is a signal that controls another part of a synth.

It is not usually the sound itself.

It is more like a moving instruction.

Examples:

- low voltage can mean low pitch
- high voltage can mean high pitch
- low voltage can mean closed filter
- high voltage can mean open filter
- low voltage can mean quiet level
- high voltage can mean louder level

In this app, the control voltage is shown between:

```text
-5 V and +5 V
```

The app lets you see the voltage moving before expecting you to hear everything as a full synth patch.

## 3. What Sample & Hold does

Sample & Hold means:

```text
look at the input -> capture the value -> hold that value
```

The input voltage keeps moving.

The held output does not keep moving all the time.

It changes only when a trigger happens.

A trigger is a short event that tells the Sample & Hold to capture a new value.

In Sample Hold Lab, triggers can come from:

- the automatic clock
- the manual trigger button

### What you should see

In S&H mode:

- the input trace keeps moving
- a trigger happens
- the current input value is captured
- the raw held value jumps to that captured value
- the held output stays there until the next trigger

### What you may hear

If audio is running, the oscillator pitch follows the held/slewed main CV.

That can sound like stepped pitch changes.

This is still only the single pitch audio demo.

## 4. What Track & Hold does

Track & Hold means:

```text
follow while gate is open -> hold when gate closes
```

A gate is different from a trigger.

A trigger is a short capture event.

A gate stays open for a length of time.

In T&H mode, the output follows the input while the gate is open.

When the gate closes, the output holds the last value.

### What you should see

In T&H mode:

- the gate opens
- the output tracks the input
- the gate closes
- the output freezes at the last tracked value
- the output waits there until the next gate opens

### What you may hear

If audio is running, pitch can move while the gate is open.

When the gate closes, the pitch holds.

Again, only pitch is connected to audio.

## 5. What Super S&H shows

Super S&H is a visual expansion of Sample & Hold.

It shows one main held path and two related companion paths.

The three visible paths are:

- main held/slewed output
- Super high companion output
- Super low companion output

These outputs are related.

They are shown together so you can see that one sampled value can create more than one related control path.

### Important audio limit

Only the main held/slewed output controls oscillator pitch.

These remain visual only:

- Super high companion output
- Super low companion output

Do not expect Super high or Super low to make separate sounds yet.

Do not expect them to control separate oscillators yet.

## 6. What the Scope shows

The Scope is the main teaching view.

It shows the control voltage behaviour over time.

Depending on the selected mode, it can show:

- input voltage
- trigger or gate timing
- raw held value
- slewed main output
- Super high companion output
- Super low companion output

### Input voltage

This is the voltage being sampled or tracked.

It may come from:

- LFO
- Noise
- Manual CV

### Raw held value

This is the value captured by S&H, or the value held after T&H stops tracking.

It can jump sharply.

### Slewed main output

Slew smooths movement toward the raw held value.

Low slew means faster movement.

High slew means slower movement.

This slewed main output is the current audio pitch source.

### Timing markers

Timing markers help you see when captures or gates happen.

Jitter can move the timing slightly so it looks less perfectly mechanical.

Jitter changes timing only.

It does not directly add random voltage.

## 7. What the visual destinations mean

The destination selector shows what the held CV is being used to demonstrate.

The current destinations are:

- Scope
- Pitch
- Filter cutoff
- Level

A destination can be visual only or audio-connected.

At the moment, only pitch has an audio connection.

### Scope

Scope shows the voltage traces.

It is visual only.

It helps you understand the behaviour before thinking about sound.

### Pitch

Pitch shows how held CV can control pitch.

Pitch is also connected to the audio demo.

When audio is running, the same held/slewed main CV changes the oscillator pitch.

Current audio path:

```text
held/slewed main CV -> oscillator pitch
```

### Filter cutoff

Filter cutoff shows how held CV could open or close a filter.

This is visual only.

There is no filter audio yet.

There is no VCF yet.

Changing the filter cutoff destination does not make the oscillator brighter or darker.

### Level

Level shows how held CV could control loudness.

This is visual only.

There is no level audio yet.

There is no VCA yet.

Changing the level destination does not make the oscillator louder or quieter.

## 8. What the audio demo does

The audio demo is a small safe sound test.

It is there to help you hear one control-voltage idea.

It does not turn the app into a full synth.

### What Start Audio does

Start Audio starts one quiet oscillator.

The oscillator does not start automatically.

You must press Start Audio first.

This keeps the app safer and less surprising.

### What controls the sound

Only this path controls sound:

```text
held/slewed main CV -> oscillator pitch
```

That means:

- LFO can be sampled or tracked, then affect pitch
- Noise can be sampled or tracked, then affect pitch
- Manual CV can be sampled or tracked, then affect pitch
- S&H can create stepped pitch changes
- T&H can create tracking-then-holding pitch behaviour
- Super S&H still uses only the main output for pitch

### What Panic / Stop Audio does

Panic / Stop Audio stops and disconnects the oscillator.

Use it when:

- you want silence immediately
- the sound is annoying
- the browser audio state feels stuck
- you want to reset the audio demo safely

The app should still be usable visually after Panic / Stop Audio.

### Safety limits

The audio demo is intentionally limited.

It uses:

- one oscillator
- low output level
- clamped output
- no autoplay
- user-started audio only

## 9. What remains visual only

These parts do not make or change sound yet:

- Scope traces
- filter cutoff destination
- level destination
- Super high companion output
- Super low companion output
- timing markers
- patch summary panel

### Visual-only does not mean broken

Visual-only means the app is teaching the idea on screen first.

For example:

- Filter cutoff shows what cutoff control would look like.
- Level shows what level control would look like.
- Super high and Super low show related control paths.

They are not audio destinations yet.

This is deliberate.

## 10. What not to expect yet

Do not expect these features in the current app:

- filter audio
- level audio
- VCF behaviour
- VCA behaviour
- effects
- MIDI
- presets
- save/load
- patch cables
- modulation matrix
- multiple oscillators
- multiple audio destinations
- full synth voice behaviour
- VCV Rack behaviour
- hardware simulation

The current app is a teaching lab with one safe audio pitch demo.

## Control summary

| Control | What it does | Audio or visual? |
|---|---|---|
| Input source | Chooses LFO, Noise, or Manual CV | Visual source; can feed pitch through held CV |
| Mode | Chooses S&H, T&H, or Super S&H | Visual behaviour; main output can feed pitch |
| Destination | Chooses Scope, Pitch, Filter cutoff, or Level | Pitch has audio; others are visual only |
| Manual trigger | Captures a value immediately in S&H mode | Can cause pitch change if audio is running |
| Clock / gate rate | Changes automatic trigger or gate speed | Can change pitch timing if audio is running |
| Slew amount | Smooths movement toward the raw held value | Affects pitch glide if audio is running |
| Jitter | Moves event timing slightly | Timing only |
| Start Audio | Starts one quiet oscillator | Audio |
| Panic / Stop Audio | Stops and disconnects the oscillator | Audio safety |

## Plain behaviour examples

### Example 1: LFO into S&H

The LFO moves smoothly.

S&H samples it at trigger moments.

The held value changes in steps.

If audio is running, the oscillator pitch changes in steps.

### Example 2: Noise into S&H

Noise moves irregularly.

S&H captures irregular values.

The held output jumps less predictably.

If audio is running, pitch changes less predictably.

### Example 3: Manual CV into S&H

Manual CV lets you choose the input voltage yourself.

S&H captures the value when triggered.

If audio is running, the oscillator pitch follows the held/slewed version of that captured value.

### Example 4: T&H mode

The output follows while the gate is open.

The output holds when the gate closes.

If audio is running, pitch follows while tracking and stays fixed while holding.

### Example 5: Super S&H mode

The app shows main, Super high, and Super low outputs.

Only the main output controls oscillator pitch.

The Super high and Super low outputs are visual companions only.

## Manual-as-we-go rule

Before adding more audio features, improve this manual.

Each future feature should explain:

- what changed
- what the user sees
- what the user hears
- what remains visual only
- what is still not included

This keeps the project understandable before it becomes larger.
