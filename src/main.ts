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
          <input type='number' id='bpm' value='120' min='40' max='208' />
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

const playButton = document.querySelector('.play-btn') as HTMLButtonElement;
const stopButton = document.querySelector('.stop-btn') as HTMLButtonElement;

playButton.addEventListener('click', () => {
  if (oscillator) return;
  // const gainNode = audioContext.createGain();

  oscillator = audioContext.createOscillator();
  oscillator.frequency.value = 440;
  oscillator.type = "sine";

  // const now = audioContext.currentTime;
  // gainNode.gain.setValueAtTime(0.3, now);
  // gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

  // oscillator.connect(gainNode);
  // gainNode.connect(audioContext.destination);

  // oscillator.start(now);
  // oscillator.stop(now + 0.05);
  oscillator.connect(audioContext.destination);
  oscillator.start();

  oscillator.onended = () => {
    oscillator = null;
  };
})

stopButton.addEventListener('click', () => {
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
  }
})