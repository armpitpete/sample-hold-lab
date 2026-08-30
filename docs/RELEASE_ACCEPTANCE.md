# Sample & Hold Lab 3.0.0 — Release Acceptance

Candidate name:

> Sample & Hold Lab 3.0.0 — Completed Teaching Laboratory

Baseline before reconciliation:

```text
d59d3a7a8d7a292cdc46e33c9eae874b378e92b2
```

## Automated gate

| Check | Requirement | Evidence location |
| --- | --- | --- |
| dependency install | PASS on final PR head | PR #63 workflow |
| TypeScript | PASS on final PR head | `npm run check` |
| deterministic tests | PASS on final PR head | `npm run check` |
| production build | PASS on final PR head | `npm run check` |

PR #63 demonstrated the gate successfully after pinning the validation environment to Node `24.20.0` / npm `11.19.0`: dependency installation passed, all eight deterministic tests passed, TypeScript passed and the Vite production build passed.

The release rule remains exact-head: after any later PR commit, the new final head must independently pass the workflow. Evidence for the final run should be recorded in the PR conversation rather than changing this file again solely to insert a run number.

The reconciliation changes project-state/release documentation plus CI runtime maintenance only. They do not change application behaviour, DSP, audio routing or application dependencies.

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
