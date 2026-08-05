import { describe, expect, it } from 'vitest';
import { clamp, companionValues, cvToFrequency, jitteredInterval, sampleHold, slew, trackHold } from './model';

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
  it('uses exact 1 V per octave pitch tracking from 0 V = 220 Hz', () => {
    expect(cvToFrequency(0)).toBe(220);
    expect(cvToFrequency(1)).toBe(440);
    expect(cvToFrequency(2)).toBe(880);
    expect(cvToFrequency(-1)).toBe(110);
    expect(cvToFrequency(-2)).toBe(55);
  });
});
