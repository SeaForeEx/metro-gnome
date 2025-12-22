import './style.css'

const audioContext = new AudioContext();

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
          <label for='bpm'>BPM</label>
          <input type='number' id='bpm' value='120' min='40' max='208' 
            oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
            <span id='bpm-error' class='error-message'>
              Keep BPM between 40-208
            </span>
        </div>
        <div class='input-group'>
          <label for='time-signature'>Time Signature</label>
          <select id='time-signature'>
            <option value='4'>4/4</option>
            <option value='3'>3/4</option>
            <option value='2'>2/4</option>
            <option value='6'>6/8</option>
          </select>
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
let oscillator: OscillatorNode | null = null;
let tempo = 120.0;
let nextNoteTime = 0.0;
let scheduleAheadTime = 0.1;
let beatCount = 0;
let isPlaying = false;

const bpmInput = document.getElementById('bpm') as HTMLInputElement;
const bpmError = document.getElementById('bpm-error') as HTMLElement;

bpmInput.addEventListener('input', () => {
  const value = parseFloat(bpmInput.value);
  if (value >= 40 && value <= 208) {
    tempo = value;
    bpmError.style.display = 'none';
  } else {
    bpmError.style.display = 'block';
  }
});

bpmInput.addEventListener('blur', () => {
  bpmInput.value = tempo.toString();
  bpmError.style.display = 'none';
});

function nextNote() {
  let secondsPerBeat = 60.0 / tempo;

  nextNoteTime += secondsPerBeat;

  beatCount++;

  if (beatCount == 4) {
    beatCount = 0;
  }
}

function scheduleNote( beatNumber: number, time: number) {
  const gainNode = audioContext.createGain();

  oscillator = audioContext.createOscillator();
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, time);
  gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (beatNumber % 4 === 0) {
    oscillator.frequency.value = 440.0;
  } else {
    oscillator.frequency.value = 220.0;
  }
  
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

let schedulerId: number | null = null;

playButton.addEventListener('click', () => {
  if (isPlaying) return;

  nextNoteTime = audioContext.currentTime;
  beatCount = 0;
  isPlaying = true;

  schedulerId = setInterval(() => scheduler(), 25);
})

stopButton.addEventListener('click', () => {
  isPlaying = false;
  if (schedulerId !== null) {
    clearInterval(schedulerId);
    schedulerId = null; 
  }
})