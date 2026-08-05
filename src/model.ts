export type HoldMode = 'sample-hold' | 'track-hold' | 'companion-hold';

export const REFERENCE_FREQUENCY_HZ = 220;
export const REFERENCE_VOLTAGE = 0;

export const clamp = (value:number,min=-5,max=5)=>Math.min(max,Math.max(min,value));

export function slew(current:number,target:number,amount:number):number {
  if (amount <= 0) return target;
  const rate = Math.max(0.002, 1 - amount) * 0.22;
  return current + (target-current)*rate;
}

export function sampleHold(previous:number,input:number,triggered:boolean):number {
  return triggered ? input : previous;
}

export function trackHold(previous:number,input:number,gateOpen:boolean):number {
  return gateOpen ? input : previous;
}

export function companionValues(main:number,spread:number){
  return { main: clamp(main), high: clamp(main+spread), low: clamp(main-spread) };
}

export function jitteredInterval(baseMs:number,jitter:number,random=0.5):number {
  const offset=(random*2-1)*Math.max(0,Math.min(.35,jitter));
  return Math.max(40,baseMs*(1+offset));
}

export function cvToFrequency(cv:number):number {
  return REFERENCE_FREQUENCY_HZ * Math.pow(2, cv - REFERENCE_VOLTAGE);
}
