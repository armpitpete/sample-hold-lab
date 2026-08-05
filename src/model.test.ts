import { describe, expect, it } from 'vitest';
import { clamp, companionValues, cvToFrequency, frequencyToNoteName, jitteredInterval, quantizeCv, sampleHold, slew, trackHold } from './model';

describe('control-voltage model', () => {
  it('samples only on a trigger', () => {
    expect(sampleHold(1,4,false)).toBe(1);
    expect(sampleHold(1,4,true)).toBe(4);
  });
  it('tracks only while the gate is open', () => {
    expect(trackHold(1,3,false)).toBe(1);
    expect(trackHold(1,3,true)).toBe(3);
  });
  it('zero slew reaches the target and positive slew does not overshoot', () => {
    expect(slew(0,5,0)).toBe(5);
    expect(slew(0,5,.5)).toBeGreaterThan(0);
    expect(slew(0,5,.5)).toBeLessThan(5);
  });
  it('keeps companion outputs related and clamped', () => {
    expect(companionValues(1,1)).toEqual({main:1,high:2,low:0});
    expect(companionValues(5,2).high).toBe(5);
  });
  it('bounds jitter and visible CV safely', () => {
    expect(jitteredInterval(1000,.1,0)).toBe(900);
    expect(jitteredInterval(1000,.1,1)).toBe(1100);
    expect(clamp(8)).toBe(5);
  });
  it('uses exact 1 V per octave from selectable references', () => {
    expect(cvToFrequency(0,220)).toBe(220);
    expect(cvToFrequency(1,220)).toBe(440);
    expect(cvToFrequency(-1,220)).toBe(110);
    expect(cvToFrequency(1,261.625565)).toBeCloseTo(523.25113,5);
  });
  it('quantizes to twelve semitone steps per volt', () => {
    expect(quantizeCv(.04,true)).toBe(0);
    expect(quantizeCv(.08,true)).toBeCloseTo(1/12);
    expect(quantizeCv(.08,false)).toBe(.08);
  });
  it('names musical pitches', () => {
    expect(frequencyToNoteName(220)).toBe('A3');
    expect(frequencyToNoteName(440)).toBe('A4');
    expect(frequencyToNoteName(261.625565)).toBe('C4');
  });
});
