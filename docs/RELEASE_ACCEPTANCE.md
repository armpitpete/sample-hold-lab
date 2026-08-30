# Sample & Hold Lab 3.0.0 — Release Acceptance

Candidate name:

> Sample & Hold Lab 3.0.0 — Completed Teaching Laboratory

Baseline before reconciliation:

```text
d59d3a7a8d7a292cdc46e33c9eae874b378e92b2
```

## Automated gate

| Check | Status | Evidence |
| --- | --- | --- |
| dependency install | PASS on PR #62 | workflow run `30997755967`, job `Test, type-check and build` |
| TypeScript | PASS on PR #62 | `npm run check` |
| deterministic tests | PASS on PR #62 | `npm run check` |
| production build | PASS on PR #62 | `npm run check` |
| fresh reconciliation-head validation | PENDING | must pass on the reconciliation PR |

The reconciliation branch changes documentation only. The fresh PR run is still required because the release gate is exact-head, not inherited from an older build.

## Public-build smoke gate

- [ ] page loads without a blocking error
- [ ] Learn mode visible
- [ ] Explore mode visible
- [ ] six guided experiments reachable
- [ ] scope/timeline visible
- [ ] audio controls visible

## Physical audio and interaction gate

These checks require a real browser/audio session and cannot be inferred from automated model tests.

- [ ] Start Audio produces the intended quiet teaching audio
- [ ] Panic / stop silences every oscillator
- [ ] Start Audio works again after Panic / stop
- [ ] repeated Start Audio does not create unintended stacked voices
- [ ] Sample & Hold captures then holds
- [ ] Track & Hold follows while the gate is open and freezes when closed
- [ ] Companion Hold exposes low, centre and high related outputs
- [ ] +1 V exactly doubles frequency
- [ ] -1 V exactly halves frequency
- [ ] C3 reference works
- [ ] A3 reference works
- [ ] C4 reference works
- [ ] A4 reference works
- [ ] semitone quantization off follows continuous CV
- [ ] semitone quantization on uses 1/12 V steps
- [ ] pause works
- [ ] resume works
- [ ] single-step works while paused
- [ ] normal/quarter/tenth-speed observation works
- [ ] cursor A works
- [ ] cursor B works
- [ ] cursor separation/readouts remain understandable

## External beginner gate

One person unfamiliar with the project must complete the learning route with minimal coaching.

Record whether they can explain, in their own words:

- Sample & Hold
- Track & Hold
- Companion Hold
- 1 V/octave
- quantization
- what the scope/timeline is showing
- what is a teaching feature versus a general synthesiser feature

Record every point of confusion verbatim or as a short neutral observation. Do not coach around a confusing interface and then mark it as a pass.

## Decision

- automated exact-head PASS + physical PASS + external beginner PASS → release candidate accepted
- automated FAIL → correct code/test/build failure
- physical audio FAIL → correct runtime/audio behaviour
- comprehension FAIL → correct teaching/interface clarity before adding features

No new Sample & Hold Lab feature lane opens before this gate is complete.
