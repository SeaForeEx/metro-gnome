# 🍄 Metro-Gnome 🍄

A whimsical browser-based metronome built with TypeScript and Web Audio API designed for young musicians.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF6B35?style=flat&logo=html5&logoColor=white)


![MetroGnome Desktop View](./screenshots/desktopView.png)

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Debugging Node Version Conflicts](#debugging-node-version-conflicts)
4. [Design Decisions](#design-decisions)
5. [Understanding the Web Audio API](#understanding-the-web-audio-api)
6. [Building the Metronome Functionality](#building-the-metronome-functionality)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### **Node.js**
- Download from: https://nodejs.org/
- Verify installation:
```bash
node -v
```

### **NPM**
- Comes with Node.js
- Verify installation:
```bash
npm -v
```

### **Git** (optional, for cloning)
- Download from: https://git-scm.com/
- Verify installation:
```bash
git --version
```

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SeaForeEx/metro-gnome.git
cd metrognome
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

Open your browser to `http://localhost:5173/`

---

## Debugging Node Version Conflicts

### The Problem
I had conflicting Node.js installations (Homebrew and NVM), causing my terminal to use the wrong version.

### The Solution
I identified which installation was being used with `which node`, disabled NVM in my shell configuration, and verified the correct version was now active.

---

## Design Decisions

### Branding & Theme

Since QuaverEd builds educational music applications for K-8 students, I wanted to create something that would be engaging and fun for young learners while maintaining a professional, musical focus.

**The Metro-Gnome Concept**
I chose "Metro-Gnome" as a playful spin on "metronome" - combining the musical tool with a whimsical garden gnome character. This creates:
- A memorable, kid-friendly brand
- Visual interest that appeals to younger students
- A lighthearted approach to music practice

**Other Concept Considered:**
- **Q-Nome**: Maintaining QuaverEd's "Q" branding while creating a metronome app

The Metro-Gnome won out for its broad appeal, clear visual identity, and alignment with QuaverEd's mission to make music education accessible and enjoyable for elementary students.

### Responsive Design

The app adapts to different screen sizes to ensure usability across devices students and teachers might use:

<table>
<tr>
<td width="50%">

**Key responsive features:**
- Desktop (already shown): Side-by-side layout with image and controls
- Mobile (to the right): Stacked vertical layout for easier touch interaction

</td>
<td width="50%">

![Mobile View](./screenshots/mobileView.png)

</td>
</tr>
</table>
  
---

## Understanding the Web Audio API - Step by Step

Before I could create a metronome app, I first needed a basic understanding of how the Web Audio API worked. I decided to start with the simplest possible implementation: a user clicks a button and hears a brief click sound. This would give me the foundational knowledge needed to build the full metronome functionality.

### Web Audio API Test Code

![Web Audio API Test Code](./screenshots/audioTestCode.png)

### Breaking It Down

**1. Create the AudioContext**
```typescript
const audioContext = new AudioContext();
```
Set up the AudioContext to access the Web Audio API. This is your audio "workspace" that gives you access to all audio features and maintains an internal clock.

**2. Create the HTML and get the button reference**
```typescript
document.querySelector('#app')!.innerHTML = `...`
const playButton = document.querySelector('.play-btn') as HTMLButtonElement;
```
Created a play button in the HTML, then used querySelector to access it in JavaScript.

**3. Add an event listener to the button**
```typescript
playButton.addEventListener('click', () => {
```
Attached an event listener so the audio code runs every time the user clicks the play button.

**4. Create the audio nodes**
```typescript
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();
```
Created an oscillator (sound generator) and a gain node (volume controller) from the AudioContext.

**5. Configure the oscillator**
```typescript
oscillator.frequency.value = 440;
oscillator.type = "sine";
```
Set the frequency to 440 Hz (A4 note) and the wave type to sine wave (the basic building block of sound).

**6. Set up the timing reference**
```typescript
const now = audioContext.currentTime;
```
Captured the current time from the audio clock. This tells all subsequent operations when to start. Think of this like SMPTE timecode - it's the precise time reference that keeps all audio events synchronized and sample-accurate.

**7. Create the volume envelope**
```typescript
gainNode.gain.setValueAtTime(0.3, now);
gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
```
Set the gain to start at 0.3 (30% volume) instantly at `now`, then decay exponentially to 0.01 (1% volume) over 0.05 seconds. This creates a short "click" sound instead of a sustained tone.

**8. Connect the audio routing**
```typescript
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
```
Connected the oscillator to the gain node, then connected the gain node to the destination (speakers/headphones). Signal flow: Oscillator → GainNode → Speakers.

**9. Start and stop the sound**
```typescript
oscillator.start(now);
oscillator.stop(now + 0.05);
```
Started the oscillator at `now` and scheduled it to stop 0.05 seconds later, matching the decay time of the volume envelope.

**Result:** A percussive "tick" sound that plays each time the button is clicked - perfect for a metronome!
