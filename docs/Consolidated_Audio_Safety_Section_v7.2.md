# Consolidated audio safety section v7.2

## Purpose

Remove duplicate Start Audio / Panic Stop sections and keep one clear audio safety area.

This is a UI consolidation and safety-readout cleanup.

## Problem

The app could show two separate audio sections:

- a newer Start / Panic Stop section near the top
- an older Audio Demo / Safety section lower down

That made the page feel duplicated and made it unclear which Start Audio button to use.

## Change

The app now keeps one audio safety section.

The one remaining section includes:

- Start Audio
- Panic / Stop Audio
- Status
- Safe output clamp
- Oscillator pitch

The script also removes legacy lower audio demo sections if they are still present in the page.

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

## Good enough

The page has one clear Start Audio / Panic Stop area, with the useful safety information from the old section kept in the same panel.
