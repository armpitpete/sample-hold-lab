import './styles.css';
import { companionValues, cvToFrequency, jitteredInterval, sampleHold, slew, trackHold, type HoldMode } from './model';

type Source='lfo'|'noise'|'manual';
type Point={input:number;raw:number;slewed:number;high:number;low:number;event:boolean;gate:boolean};
type Lesson={title:string;instruction:string;source:Source;mode:HoldMode;rate:number;slew:number;jitter:number;spread:number};
type Voice={osc:OscillatorNode;gain:GainNode;pan:StereoPannerNode|null};

const lessons:Lesson[]=[
  {title:'Freeze a moving voltage',instruction:'Watch the input move. Each trigger captures one point and holds it.',source:'lfo',mode:'sample-hold',rate:1,slew:0,jitter:0,spread:1},
  {title:'Hear steps become pitch',instruction:'Start audio. The held voltage now becomes a safe oscillator pitch.',source:'noise',mode:'sample-hold',rate:2,slew:0,jitter:0,spread:1},
  {title:'Turn steps into glides',instruction:'Increase slew and watch the output travel toward each new target.',source:'noise',mode:'sample-hold',rate:1.5,slew:.72,jitter:0,spread:1},
  {title:'Compare tracking with sampling',instruction:'Track & Hold follows while the gate is open, then freezes.',source:'lfo',mode:'track-hold',rate:.75,slew:.15,jitter:0,spread:1},
  {title:'Make timing imperfect',instruction:'Jitter moves automatic events away from the ideal clock marks.',source:'noise',mode:'sample-hold',rate:2,jitter:.25,slew:.2,spread:1},
  {title:'Hear three related companions',instruction:'Start audio. Companion Hold now plays the low, centre and high control paths together.',source:'noise',mode:'companion-hold',rate:1,slew:.35,jitter:.08,spread:1.2}
];

const app=document.querySelector<HTMLDivElement>('#app');
if(!app) throw new Error('App root not found');
app.innerHTML=`
<header class="topbar">
  <div><p class="eyebrow">Interactive CV learning laboratory</p><h1>Sample &amp; Hold Lab</h1></div>
  <div class="mode-tabs"><button id="learnTab" class="active">Learn</button><button id="exploreTab">Explore</button></div>
</header>
<p class="mission">Understand how changing voltages become sampled, held, tracked and slewed control signals.</p>
<section id="lessonPanel" class="lesson-panel"><div><span id="lessonCount"></span><h2 id="lessonTitle"></h2><p id="lessonInstruction"></p></div><div class="lesson-actions"><button id="previousLesson">Previous</button><button id="nextLesson">Next experiment</button></div></section>
<section class="lab-grid">
  <aside class="controls" aria-label="Signal controls">
    <h2>Signal</h2>
    <label>Input source<select id="source"><option value="lfo">LFO</option><option value="noise">Noise</option><option value="manual">Manual CV</option></select></label>
    <label id="manualRow" hidden>Manual voltage<input id="manual" type="range" min="-5" max="5" step=".1" value="0"><output id="manualOut">0.0 V</output></label>
    <fieldset><legend>Hold behaviour</legend><label><input type="radio" name="mode" value="sample-hold" checked> Sample &amp; Hold</label><label><input type="radio" name="mode" value="track-hold"> Track &amp; Hold</label><label><input type="radio" name="mode" value="companion-hold"> Companion Hold</label></fieldset>
    <label>Clock / gate rate<input id="rate" type="range" min=".25" max="4" step=".25" value="1"><output id="rateOut">1.00 Hz</output></label>
    <label>Slew<input id="slew" type="range" min="0" max="1" step=".01" value=".35"><output id="slewOut">35%</output></label>
    <label>Timing jitter<input id="jitter" type="range" min="0" max=".35" step=".01" value=".1"><output id="jitterOut">10%</output></label>
    <label>Companion spread<input id="spread" type="range" min=".2" max="2" step=".1" value="1"><output id="spreadOut">1.0 V</output></label>
    <button id="trigger" class="primary">Trigger now</button>
    <button id="reset">Reset view</button>
  </aside>
  <main class="workbench">
    <section class="scope-card">
      <div class="scope-heading"><div><p class="eyebrow">Shared event timeline</p><h2>What the voltage is doing</h2></div><div class="live-values"><span>Input <b id="inputValue">0.00 V</b></span><span>Held <b id="heldValue">0.00 V</b></span><span>Output <b id="outputValue">0.00 V</b></span></div></div>
      <canvas id="scope" width="1100" height="430" aria-label="Clock, input, sampled target and slewed output timeline"></canvas>
      <div class="legend"><span class="input">Input</span><span class="raw">Captured target</span><span class="output">Slewed output</span><span class="companions">Companions</span><span class="event">Trigger / gate edge</span></div>
    </section>
    <section class="explanation"><p class="eyebrow">What just happened?</p><h2 id="eventTitle">Waiting for the first event</h2><p id="eventText">The input is moving. A trigger will capture its current voltage.</p></section>
    <section class="hear"><div><p class="eyebrow">Hear the same control signal</p><h2>Safe pitch mapping</h2><p id="audioExplanation">Sample &amp; Hold and Track &amp; Hold use one centre voice. Companion Hold uses low, centre and high voices.</p></div><div><output id="audioStatus">Audio stopped</output><output id="pitch">Centre 220 Hz</output><output id="companionPitch">Companions silent outside Companion Hold</output><button id="audioStart">Start audio</button><button id="audioStop">Panic / stop</button></div></section>
  </main>
</section>`;

const $=<T extends Element>(selector:string)=>{const el=document.querySelector<T>(selector);if(!el)throw new Error(`Missing ${selector}`);return el};
const canvas=$<HTMLCanvasElement>('#scope');
const ctx=canvas.getContext('2d');
if(!ctx) throw new Error('Canvas unavailable');
const source=$<HTMLSelectElement>('#source'),manual=$<HTMLInputElement>('#manual'),manualRow=$<HTMLElement>('#manualRow');
const rate=$<HTMLInputElement>('#rate'),slewInput=$<HTMLInputElement>('#slew'),jitter=$<HTMLInputElement>('#jitter'),spread=$<HTMLInputElement>('#spread');
let mode:HoldMode='sample-hold',inputSource:Source='lfo',raw=0,smoothed=0,gate=false,nextEvent=0,last=0,lessonIndex=0,noise=0;
let audio:AudioContext|null=null,master:GainNode|null=null,voices:Voice[]=[];
const history:Point[]=[];

function inputAt(t:number){if(inputSource==='manual')return Number(manual.value);if(inputSource==='noise'){noise+=(Math.random()*10-5-noise)*.16;return noise}return Math.sin(t/820)*3.8+Math.sin(t/2300)*.45}
function explain(kind:string,input:number){const title=$<HTMLElement>('#eventTitle'),text=$<HTMLElement>('#eventText');if(mode==='track-hold'){title.textContent=gate?'Gate opened: tracking':'Gate closed: holding';text.textContent=gate?`The output is now following the input. Current value: ${input.toFixed(2)} V.`:`The gate closed, so ${raw.toFixed(2)} V remains held.`}else if(mode==='companion-hold'){const c=companionValues(raw,Number(spread.value));title.textContent=kind==='manual'?'Manual trigger created three companions':'Clock trigger created three companions';text.textContent=`Low ${c.low.toFixed(2)} V, centre ${raw.toFixed(2)} V and high ${c.high.toFixed(2)} V are now related by the spread control.`}else{title.textContent=kind==='manual'?'Manual trigger captured the input':'Clock trigger captured the input';text.textContent=`The trigger captured ${raw.toFixed(2)} V. It remains the target until the next trigger${Number(slewInput.value)>0?', while slew moves the output toward it.':'.'}`}}
function fire(t:number,kind='clock'){const input=inputAt(t);if(mode==='track-hold'){gate=!gate;if(!gate)raw=input}else raw=sampleHold(raw,input,true);explain(kind,input)}
function schedule(t:number){const base=1000/Number(rate.value);nextEvent=t+jitteredInterval(base,Number(jitter.value),Math.random())}
function setVoiceMix(){if(!audio||voices.length!==3)return;const now=audio.currentTime;const companion=mode==='companion-hold';voices[0].gain.gain.setTargetAtTime(companion?.018:0,now,.02);voices[1].gain.gain.setTargetAtTime(.025,now,.02);voices[2].gain.gain.setTargetAtTime(companion?.018:0,now,.02);$<HTMLOutputElement>('#audioStatus').value=companion?'Audio running: three voices':'Audio running: centre voice'}
function frame(t:number){if(!last){last=t;schedule(t)}const input=inputAt(t);let event=false;if(t>=nextEvent){fire(t);event=true;schedule(t)}if(mode==='track-hold')raw=trackHold(raw,input,gate);smoothed=slew(smoothed,raw,Number(slewInput.value));const companions=companionValues(smoothed,Number(spread.value));history.push({input,raw,slewed:smoothed,high:companions.high,low:companions.low,event,gate});if(history.length>220)history.shift();render();updateReadouts(input,companions.low,companions.high);if(audio&&voices.length===3){const now=audio.currentTime;voices[0].osc.frequency.setTargetAtTime(cvToFrequency(companions.low),now,.03);voices[1].osc.frequency.setTargetAtTime(cvToFrequency(smoothed),now,.03);voices[2].osc.frequency.setTargetAtTime(cvToFrequency(companions.high),now,.03)}last=t;requestAnimationFrame(frame)}
function updateReadouts(input:number,low:number,high:number){$<HTMLElement>('#inputValue').textContent=`${input.toFixed(2)} V`;$<HTMLElement>('#heldValue').textContent=`${raw.toFixed(2)} V`;$<HTMLElement>('#outputValue').textContent=`${smoothed.toFixed(2)} V`;$<HTMLOutputElement>('#pitch').value=`Centre ${Math.round(cvToFrequency(smoothed))} Hz`;$<HTMLOutputElement>('#companionPitch').value=mode==='companion-hold'?`Low ${Math.round(cvToFrequency(low))} Hz · High ${Math.round(cvToFrequency(high))} Hz`:'Companions silent outside Companion Hold'}
function line(values:number[],stroke:string,top:number,height:number){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.beginPath();values.forEach((v,i)=>{const x=58+i*(canvas.width-82)/219,y=top+height/2-(v/5)*(height*.42);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()}
function render(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#101821';ctx.fillRect(0,0,canvas.width,canvas.height);const lanes=[['CLOCK / GATE',20,55],['INPUT',92,90],['CAPTURED TARGET',202,80],['SLEWED OUTPUT',302,90]] as const;ctx.font='12px system-ui';ctx.fillStyle='#b9c5ce';lanes.forEach(([name,top,height])=>{ctx.fillText(name,12,top+14);ctx.strokeStyle='#2d3b47';ctx.strokeRect(58,top,canvas.width-82,height)});history.forEach((p,i)=>{const x=58+i*(canvas.width-82)/219;if(p.gate){ctx.fillStyle='rgba(110,180,150,.16)';ctx.fillRect(x,20,5,55)}if(p.event){ctx.strokeStyle='#f4c96b';ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,392);ctx.stroke()}});line(history.map(p=>p.input),'#79c8ff',92,90);line(history.map(p=>p.raw),'#f4c96b',202,80);line(history.map(p=>p.slewed),'#f1f3f5',302,90);if(mode==='companion-hold'){line(history.map(p=>p.high),'#d98cff',302,90);line(history.map(p=>p.low),'#7ee0b8',302,90)}}
function reset(){history.length=0;raw=0;smoothed=0;gate=false;noise=0;nextEvent=0;last=0;$<HTMLElement>('#eventTitle').textContent='View reset';$<HTMLElement>('#eventText').textContent='The input is moving. The next event will begin a fresh explanation.'}
function syncLabels(){$<HTMLOutputElement>('#manualOut').value=`${Number(manual.value).toFixed(1)} V`;$<HTMLOutputElement>('#rateOut').value=`${Number(rate.value).toFixed(2)} Hz`;$<HTMLOutputElement>('#slewOut').value=`${Math.round(Number(slewInput.value)*100)}%`;$<HTMLOutputElement>('#jitterOut').value=`${Math.round(Number(jitter.value)*100)}%`;$<HTMLOutputElement>('#spreadOut').value=`${Number(spread.value).toFixed(1)} V`;manualRow.hidden=inputSource!=='manual'}
function applyLesson(index:number){lessonIndex=(index+lessons.length)%lessons.length;const l=lessons[lessonIndex];source.value=l.source;inputSource=l.source;rate.value=String(l.rate);slewInput.value=String(l.slew);jitter.value=String(l.jitter);spread.value=String(l.spread);mode=l.mode;document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach(i=>i.checked=i.value===mode);$<HTMLElement>('#lessonCount').textContent=`Experiment ${lessonIndex+1} of ${lessons.length}`;$<HTMLElement>('#lessonTitle').textContent=l.title;$<HTMLElement>('#lessonInstruction').textContent=l.instruction;syncLabels();setVoiceMix();reset()}
function createVoice(panValue:number):Voice{if(!audio||!master)throw new Error('Audio unavailable');const osc=audio.createOscillator(),gain=audio.createGain();gain.gain.value=0;const pan=typeof audio.createStereoPanner==='function'?audio.createStereoPanner():null;if(pan){pan.pan.value=panValue;osc.connect(gain).connect(pan).connect(master)}else osc.connect(gain).connect(master);osc.start();return{osc,gain,pan}}
async function startAudio(){if(audio)return;audio=new AudioContext();master=audio.createGain();master.gain.value=.7;master.connect(audio.destination);voices=[createVoice(-.45),createVoice(0),createVoice(.45)];setVoiceMix()}
function stopAudio(){voices.forEach(v=>{try{v.osc.stop()}catch{}v.osc.disconnect();v.gain.disconnect();v.pan?.disconnect()});voices=[];master?.disconnect();audio?.close();master=null;audio=null;$<HTMLOutputElement>('#audioStatus').value='Audio stopped'}

source.addEventListener('change',()=>{inputSource=source.value as Source;syncLabels();reset()});manual.addEventListener('input',syncLabels);[rate,slewInput,jitter,spread].forEach(el=>el.addEventListener('input',()=>{syncLabels();reset()}));document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach(i=>i.addEventListener('change',()=>{mode=i.value as HoldMode;setVoiceMix();reset()}));$<HTMLButtonElement>('#trigger').onclick=()=>fire(performance.now(),'manual');$<HTMLButtonElement>('#reset').onclick=reset;$<HTMLButtonElement>('#previousLesson').onclick=()=>applyLesson(lessonIndex-1);$<HTMLButtonElement>('#nextLesson').onclick=()=>applyLesson(lessonIndex+1);$<HTMLButtonElement>('#learnTab').onclick=()=>{$<HTMLElement>('#lessonPanel').hidden=false;$<HTMLElement>('#learnTab').classList.add('active');$<HTMLElement>('#exploreTab').classList.remove('active')};$<HTMLButtonElement>('#exploreTab').onclick=()=>{$<HTMLElement>('#lessonPanel').hidden=true;$<HTMLElement>('#exploreTab').classList.add('active');$<HTMLElement>('#learnTab').classList.remove('active')};$<HTMLButtonElement>('#audioStart').onclick=startAudio;$<HTMLButtonElement>('#audioStop').onclick=stopAudio;window.addEventListener('pagehide',stopAudio);
applyLesson(0);requestAnimationFrame(frame);
