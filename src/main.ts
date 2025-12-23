import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class='container'>
    <div class='welcome-header'>
      Welcome to the <br class='mobile-break'>Metro-Gnome!
    </div>
    <div class='content-wrapper'>
      <div class='image-container'>
        <img src='/metro-gnome.png' class='metro-gnome-image' />
      </div>
      <div class='text-container'>
        <div class='input-group'>
          <div class='slider-container'>
            <label for='bpm'>BPM:</label>
            <span id='bpm-display'>120</span>
          </div>
          <input type='range' id='bpm' step="1" value='120' min='40' max='208' />
        </div>
        <div class='input-group'>
          <label>Time Signature</label>
          <div class='time-signature-buttons'>
            <button class='time-sig-btn active' data-value='4'>4/4</button>
            <button class='time-sig-btn' data-value='3'>3/4</button>
            <button class='time-sig-btn' data-value='6'>6/8</button>
          </div>
        </div>
        <div class='button-container'>
            <button class='control-btn play-btn'>
              <img src='/play-button.png' class='btn-image' alt='Play metronome' />
            </button>
            <button class='control-btn stop-btn'>
              <img src='/stop-button.png' class='btn-image' alt='Stop metronome' />
            </button>
        </div>
      </div>
    </div>
  </div>
`

const audioContext = new AudioContext();

const SCHEDULER_INTERVAL = 25;

let tempo: number = 120.0;
let timeSignature: number = 4;
let nextNoteTime: number = 0.0;
let scheduleAheadTime: number = 0.1;
let beatCount: number = 0;
let isPlaying: boolean = false;
let schedulerId: number | null = null;

const bpmSlider = document.getElementById('bpm') as HTMLInputElement;
const bpmDisplay = document.getElementById('bpm-display') as HTMLElement;

const timeSignatureButtons = document.querySelectorAll('.time-sig-btn');

bpmSlider.addEventListener('input', () => {
  tempo = parseInt(bpmSlider.value);
  bpmDisplay.textContent = bpmSlider.value;
});

timeSignatureButtons.forEach(button => {
  button.addEventListener('click', () => {
    timeSignatureButtons.forEach(btn => btn.classList.remove('active'));
    
    button.classList.add('active');
    
    timeSignature = parseFloat((button as HTMLElement).dataset.value || '4');
  });
});

function nextNote() {
  let secondsPerBeat = 60.0 / tempo;

  if (timeSignature === 6) {
    secondsPerBeat = secondsPerBeat / 2;
  }

  nextNoteTime += secondsPerBeat;

  beatCount++;

  if (beatCount === timeSignature) {
    beatCount = 0;
  }
}

function scheduleNote( beatNumber: number, time: number) {
  const gainNode = audioContext.createGain();
  const oscillator = audioContext.createOscillator();
  
  oscillator.type = "sine";
  oscillator.frequency.value = beatNumber % timeSignature === 0 ? 440.0 : 220.0;

  gainNode.gain.setValueAtTime(0.3, time);
  gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start(time);
  oscillator.stop(time + 0.05);
}

function scheduler() {
  if (!isPlaying) return;
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote( beatCount, nextNoteTime );
    nextNote();
  }
}

const playButton = document.querySelector('.play-btn') as HTMLButtonElement;
const stopButton = document.querySelector('.stop-btn') as HTMLButtonElement;

playButton.addEventListener('click', () => {
  if (isPlaying) return;

  nextNoteTime = audioContext.currentTime;
  beatCount = 0;
  isPlaying = true;

  schedulerId = setInterval(() => scheduler(), SCHEDULER_INTERVAL);
})

stopButton.addEventListener('click', () => {
  isPlaying = false;
  if (schedulerId !== null) {
    clearInterval(schedulerId);
    schedulerId = null; 
  }
})