# Copilot instructions for Sample Hold Lab

## Project purpose

Sample Hold Lab is a small visual control-voltage learning app.

It explains Sample & Hold, Track & Hold, slew, jitter, and later Super S&H behaviour through visible signal flow.

It is not a full synth, VCV clone, audio plugin, hardware simulator, or Daisy project.

## Build rule

Build patchability in stages.

1. Fixed internal patch
2. Visible signal flow
3. Limited selectable connections
4. Free patching later

Do not begin with full modular patch-cable freedom.

## Current architecture rule

Every virtual module should be simple and explicit:

- inputs
- outputs
- current value
- visible panel
- simple update behaviour

Start with visual CV behaviour only.

## Current fixed patch

The first working patch is:

```text
LFO -> Sample & Hold CV input
Manual Trigger -> Sample & Hold trigger input
Sample & Hold output -> Scope
```

## Scope control

Implement only the current GitHub issue.

Do not add these unless the issue explicitly asks for them:

- audio engine
- VCO sound
- VCF sound
- VCA sound
- Tauri wrapper
- VCV Rack code
- Daisy hardware code
- presets
- export
- full patch-cable routing
- quantising
- probability
- burst sampling
- shift-register mode
- CV recorder

## UI rule

The app must make behaviour visible without needing a technical explanation.

Good visual wording is preferred over dense synthesis jargon.

For v0.1, a user should understand this rule by looking at the screen:

```text
changing voltage -> trigger -> captured value -> held output
```

## Reporting rule

After each change, report:

- files changed
- behaviour added
- how to run it
- what was deliberately not added
- any risks or uncertainties
