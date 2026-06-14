# Sample Hold Lab Manual

Beginner guide for Sample Hold Lab.

This manual describes the current app state: **v5.2**.

The current manual pass is **v5.2**.

## Current status

The app and manual match this boundary:

```text
held/slewed main CV -> oscillator pitch
```

That means the existing held/slewed main control voltage can change the pitch of one quiet oscillator.

This is the only audio path.

In v5.2, the Pitch destination is clearly marked as the only audio-connected destination.

These remain visual only:

- filter cutoff
- level
- Super high companion output
- Super low companion output

The app is still not a full synth voice.

## Automatic manual-update rule

The manual must be updated automatically as part of every user-facing app change.

Use this rule:

- if app behaviour changes, update this manual in the same pass
- if audio behaviour changes, update the audio / visual boundary wording
- if a control becomes functional, update the quick reference, recipes, and glossary where needed
- do not ask separately whether to update the manual
- only skip the manual for purely internal changes that do not affect what the user sees, hears, or does

## Current audio and visual boundary

Sample Hold Lab is mainly a visual learning app.

It shows control voltage behaviour on screen.

One small part currently makes sound.

The only audio path is:

```text
held/slewed main CV -> oscillator pitch
```

Use this simple rule:

```text
visual = shown on screen only
audio = changes the sound you hear
```

At the moment:

- the main held/slewed CV can change oscillator pitch
- Start Audio starts one quiet oscillator
- Panic / Stop Audio stops and disconnects the oscillator safely
- Slew amount can smooth pitch movement
- the audio status shows main CV voltage and pitch in Hz while audio is running
- Pitch is the only audio-connected destination
- Scope is visual only
- filter cutoff is visual only
- level is visual only
- Super high is visual only
- Super low is visual only

## Quick start: first 5 minutes

Use this path the first time you open the app.

1. Set **Input source** to **LFO**.
2. Set **Mode** to **S&H**.
3. Set **Destination** to **Scope**.
4. Watch the moving input trace.
5. Press **Manual trigger**.
6. Notice that the held value changes when the trigger happens.
7. Change **Slew amount**.
8. Notice that low slew moves quickly and high slew glides more slowly.
9. Optional: set **Destination** to **Pitch**.
10. Optional: press **Start Audio**.
11. Listen to the oscillator pitch follow the held/slewed main CV.
12. Watch the audio status show the main CV voltage and pitch in Hz.
13. Press **Panic / Stop Audio** when finished.

During this quick start, only Pitch is connected to audio.

The visual part of the app can still be used without audio.

## Quick reference

### Input source cheat sheet

The input source is what the app samples or tracks.

Input sources are control voltage sources. They do not make sound by themselves.

| Input source | What it does | What to watch on the Scope | If audio is running | Try it when... |
|---|---|---|---|---|
| LFO | Creates a smooth repeating voltage movement. | Watch the input move up and down in a regular shape. | Pitch changes in a more regular pattern after the voltage is sampled or tracked. | You want the clearest first source. |
| Noise | Creates an irregular changing voltage. | Watch the input move less predictably. | Pitch changes less predictably after the voltage is sampled or tracked. | You want stepped random-style movement. |
| Manual CV | Lets you choose the input voltage yourself. | Watch the input follow the manual value you set. | Pitch follows the held/slewed version of the manual value after it is captured or tracked. | You want slow, controlled testing. |

The source does not go straight to the oscillator.

The current sound path is:

```text
input source -> S&H/T&H/Super S&H -> slew -> main held CV -> oscillator pitch
```

Only the final main held/slewed CV controls oscillator pitch.

### Mode cheat sheet

The mode decides how the app captures, follows, or displays the input voltage.

| Mode | What it does | What to watch on the Scope | If audio is running | Try it when... |
|---|---|---|---|---|
| S&H | Captures one input value when a trigger happens, then holds it. | Watch the input keep moving while the held value changes in steps. | Pitch changes in steps from one held value to the next. | You want the clearest first example of Sample & Hold. |
| T&H | Follows the input while the gate is open, then holds when the gate closes. | Watch the output move while tracking, then freeze while holding. | Pitch moves while tracking, then stays fixed while holding. | You want to compare following with holding. |
| Super S&H | Shows one main held output plus related Super high and Super low companion outputs. | Watch the main, Super high, and Super low outputs move as related paths. | Only the main output controls oscillator pitch. | You want to see related visual control paths from one sampled value. |

S&H, T&H, and Super S&H do not add new audio destinations.

In Super S&H, the companion outputs are visual only:

- Super high companion output
- Super low companion output

They do not make separate notes.

They do not control separate oscillators.

### Destination cheat sheet

The destination selector changes what the app shows.

It does not mean every destination makes sound.

| Destination | What it shows | Audio or visual? | What to watch | If audio is running | Try it when... |
|---|---|---|---|---|---|
| Scope | The input, held value, slewed output, timing, and companion paths. | Visual only. | Watch how the voltage changes over time. | The scope itself makes no sound, but the main held/slewed CV can still control pitch. | You want to understand the patch before thinking about sound. |
| Pitch | Shows pitch movement and marks the destination as audio-connected. | Audio-connected through the main held/slewed CV. | Watch the Pitch badge, Pitch CV value, and audio status. | The oscillator pitch follows the held/slewed main CV. | You want to hear the basic Sample & Hold pitch demo. |
| Filter cutoff | Shows how held CV could open or close a filter. | Visual only. | Watch the cutoff-style movement. | It does not make the oscillator brighter or darker. | You want to understand cutoff control before filter audio exists. |
| Level | Shows how held CV could change loudness. | Visual only. | Watch the level-style movement. | It does not make the oscillator louder or quieter. | You want to understand level control before VCA audio exists. |

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

## First patch recipes

Use these recipes before changing random controls.

Only Pitch is connected to audio.

The only audio path is still:

```text
held/slewed main CV -> oscillator pitch
```

Filter cutoff, level, Super high, and Super low remain visual only.

### Recipe 1: LFO into S&H, visual only

Settings:

- **Input source:** LFO
- **Mode:** S&H
- **Destination:** Scope
- **Audio:** off

Do this:

1. Watch the input trace move smoothly.
2. Press **Manual trigger**.
3. Watch the held value jump to a new level.
4. Change **Slew amount**.
5. Watch the slewed output move faster or slower toward the held value.

Listen for:

- nothing; this recipe is visual only

### Recipe 2: LFO into S&H, pitch audio demo

Settings:

- **Input source:** LFO
- **Mode:** S&H
- **Destination:** Pitch
- **Audio:** Start Audio pressed

Do this:

1. Select **Pitch**.
2. Notice that Pitch is marked as audio-connected.
3. Press **Start Audio**.
4. Press **Manual trigger** a few times.
5. Change **Slew amount**.
6. Watch the held/slewed main CV move.
7. Listen for the oscillator pitch following that held/slewed main CV.
8. Watch the audio status show the main CV voltage and pitch in Hz.
9. Press **Panic / Stop Audio** when finished.

Listen for:

- the oscillator pitch changing in steps
- smoother pitch movement when slew is higher

Still visual only:

- filter cutoff
- level
- Super high companion output
- Super low companion output

### Recipe 3: Noise into S&H, visual only

Settings:

- **Input source:** Noise
- **Mode:** S&H
- **Destination:** Scope
- **Audio:** off

Do this:

1. Watch the noisy input move irregularly.
2. Press **Manual trigger**.
3. Watch the held value jump to less predictable levels.
4. Change **Slew amount**.
5. Watch the slewed output smooth the jumps.

Listen for:

- nothing; this recipe is visual only

### Recipe 4: Manual CV into S&H, controlled test

Settings:

- **Input source:** Manual CV
- **Mode:** S&H
- **Destination:** Scope or Pitch
- **Audio:** optional

Do this:

1. Move the manual CV control to a low value.
2. Press **Manual trigger**.
3. Move the manual CV control to a higher value.
4. Press **Manual trigger** again.
5. Change **Slew amount** and watch how the output moves between values.

Listen for:

- if audio is running, pitch follows the held/slewed version of the captured manual value
- if audio is off, use the Scope only

### Recipe 5: T&H comparison patch

Settings:

- **Input source:** LFO
- **Mode:** T&H
- **Destination:** Scope or Pitch
- **Audio:** optional

Do this:

1. Watch the output follow while the gate is open.
2. Watch the output freeze when the gate closes.
3. Change the gate or clock rate if available.
4. Change **Slew amount** and watch how movement changes.
5. Press **Panic / Stop Audio** when finished if audio is running.

Listen for:

- if audio is running, pitch moves while tracking and holds when the gate closes
- if audio is off, use the Scope only

## Common beginner confusions

### Why does Filter cutoff not change the sound?

Filter cutoff is visual only right now.

It shows how a held CV could open or close a filter.

There is no filter audio yet.

There is no VCF yet.

So choosing **Filter cutoff** does not make the oscillator brighter or darker.

### Why does Level not change the sound?

Level is visual only right now.

It shows how a held CV could control loudness.

There is no level audio yet.

There is no VCA yet.

So choosing **Level** does not make the oscillator louder or quieter.

### Why do Super high and Super low not make separate notes?

Super high and Super low are companion outputs.

They show related visual control paths.

They do not make separate sounds yet.

They do not control separate oscillators.

Only the main held/slewed output controls oscillator pitch.

### Why does Scope not make sound?

Scope is a visual teaching view.

It shows what the voltage is doing over time.

The Scope itself does not make sound.

### Why is Pitch different?

Pitch is the only audio-connected destination.

When Start Audio is running, the oscillator follows the held/slewed main CV.

The Pitch destination now makes this explicit with an audio-connected badge and clearer status text.

### Why is Start Audio optional?

The app can teach the control-voltage behaviour without sound.

Start Audio is optional because the main lesson is visible on the screen.

Press **Start Audio** only when you want to hear the pitch demo.

### Why is Panic / Stop Audio safe to use?

Panic / Stop Audio stops and disconnects the oscillator.

It is there so you can silence the app quickly.

Using it does not break the visual patch.

You can keep using the scope, controls, and visual destinations after stopping audio.

### What remains visual only?

These parts still do not make or change sound:

- filter cutoff
- level
- Super high companion output
- Super low companion output
- Scope traces
- timing markers
- patch summary panel

This is deliberate.

More audio should not be added unless the manual is updated in the same pass.

## Main guide

### 1. What Sample Hold Lab is

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

### 2. What a control voltage is

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

The app lets you see the voltage moving before expecting every control to change sound.

### 3. What Sample & Hold does

Sample & Hold means:

```text
look at the input -> capture the value -> hold that value
```

The input voltage keeps moving.

The held output changes only when a trigger happens.

A trigger is a short event that tells the Sample & Hold to capture a new value.

In S&H mode:

- the input trace keeps moving
- a trigger happens
- the current input value is captured
- the raw held value jumps to that captured value
- the held output stays there until the next trigger

If audio is running, the oscillator pitch follows the held/slewed main CV.

That can sound like stepped pitch changes.

### 4. What Track & Hold does

Track & Hold means:

```text
follow while gate is open -> hold when gate closes
```

A gate is different from a trigger.

A trigger is a short capture event.

A gate stays open for a length of time.

In T&H mode:

- the gate opens
- the output tracks the input
- the gate closes
- the output freezes at the last tracked value
- the output waits there until the next gate opens

If audio is running, pitch can move while the gate is open.

When the gate closes, the pitch holds.

### 5. What Super S&H shows

Super S&H is a visual expansion of Sample & Hold.

It shows one main held path and two related companion paths:

- main held/slewed output
- Super high companion output
- Super low companion output

Only the main held/slewed output controls oscillator pitch.

Super high and Super low remain visual only.

### 6. What the Scope shows

The Scope is the main teaching view.

It shows the control voltage behaviour over time.

Depending on the selected mode, it can show:

- input voltage
- trigger or gate timing
- raw held value
- slewed main output
- Super high companion output
- Super low companion output

The Scope helps you see the patch before expecting sound from it.

### 7. What slew does

Slew smooths movement toward the raw held value.

Low slew means faster movement.

High slew means slower movement.

This slewed main output is the current audio pitch source.

When audio is running, changing slew can change how sharply or smoothly pitch moves.

### 8. What jitter does

Jitter moves event timing slightly.

It makes timing less perfectly mechanical.

Jitter changes timing only.

It does not directly add random voltage.

### 9. What the audio demo does

The audio demo is a small safe sound test.

It lets you hear one control-voltage idea:

```text
held/slewed main CV -> oscillator pitch
```

Start Audio starts one quiet oscillator.

The oscillator does not start automatically.

While audio is running, the oscillator pitch follows the held/slewed main CV.

The audio status shows the current main CV voltage and the resulting oscillator pitch in Hz.

Changing Slew amount can make the pitch movement sharper or smoother.

Panic / Stop Audio stops and disconnects the oscillator.

### 10. What not to expect yet

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
| Start Audio | Starts one quiet oscillator and shows main CV / Hz status | Audio |
| Panic / Stop Audio | Stops and disconnects the oscillator | Audio safety |

## Plain behaviour examples

### LFO into S&H

The LFO moves smoothly.

S&H samples it at trigger moments.

The held value changes in steps.

If audio is running, the oscillator pitch changes in steps.

### Noise into S&H

Noise moves irregularly.

S&H captures irregular values.

The held output jumps less predictably.

If audio is running, pitch changes less predictably.

### Manual CV into S&H

Manual CV lets you choose the input voltage yourself.

S&H captures the value when triggered.

If audio is running, the oscillator pitch follows the held/slewed version of that captured value.

### T&H mode

The output follows while the gate is open.

The output holds when the gate closes.

If audio is running, pitch follows while tracking and stays fixed while holding.

### Super S&H mode

The app shows main, Super high, and Super low outputs.

Only the main output controls oscillator pitch.

The Super high and Super low outputs are visual companions only.

## Mini glossary

| Term | Meaning in this app |
|---|---|
| control voltage / CV | A changing value used to control something else. In this app, it is shown on screen and can control oscillator pitch only through the main held/slewed CV path. |
| input source | The starting voltage that S&H, T&H, or Super S&H uses. Current sources are LFO, Noise, and Manual CV. |
| trigger | A short event that tells S&H to capture the current input value. |
| gate | A longer on/off signal. In T&H, the output tracks while the gate is open and holds when it closes. |
| sample | To look at the input voltage at one moment and capture that value. |
| hold | To keep a captured value steady until the next capture or gate change. |
| track | To follow the input voltage while the gate is open. |
| slew | Smoothing between values instead of jumping instantly. |
| jitter | Small timing variation. In this app, jitter moves timing slightly; it does not directly add random voltage. |
| scope | The visual display that shows voltage behaviour over time. |
| oscillator | A sound source. In this app, there is one quiet oscillator for the pitch demo. |
| pitch | How high or low the oscillator sounds. This is the only audio-connected destination right now. |
| filter cutoff | A visual destination showing how CV could open or close a filter. It is not audio-connected yet. |
| level | A visual destination showing how CV could control loudness. It is not audio-connected yet. |
| VCF | Voltage-controlled filter. There is no working audio VCF in the app yet. |
| VCA | Voltage-controlled amplifier. There is no working audio VCA in the app yet. |
| visual only | Shown on screen, but not changing the sound. |
| audio-connected | Connected to something you can hear. Right now, only Pitch is audio-connected. |

## Manual-as-we-go rule

Do not let the app and manual drift apart again.

Every future user-facing app change should update this manual in the same pass.

Each future feature should explain:

- what changed
- what the user sees
- what the user hears
- what remains visual only
- what is still not included

This keeps the project understandable before it becomes larger.
