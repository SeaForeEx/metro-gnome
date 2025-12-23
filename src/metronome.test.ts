import { describe, it, expect } from 'vitest';

describe('BPM to Seconds Conversion', () => {
    it('coverts BPM to seconds per beat correctly', () => {
        // 120 BPM
        let tempo1 = 120;
        let secondsPerBeat1 = 60.0 / tempo1;
        expect(secondsPerBeat1).toBe(0.5);

        // 60 BPM
        let tempo2 = 60;
        let secondsPerBeat2 = 60.0 / tempo2;
        expect(secondsPerBeat2).toBe(1.0);
    })
})

describe('Time Signature Beat Duration', () => {
    it('uses quarter note duration for standard time signature', () => {
        let tempo = 120;
        let timeSignature = 4;
        let secondsPerBeat = 60.0 / tempo;

        if (timeSignature === 6) {
            secondsPerBeat /= 2;
        }

        expect(secondsPerBeat).toBe(0.5);
    })

    it('converts quarter notes to eighth notes (twice as fast) for 6/8', () => {
        let tempo = 120;
        let timeSignature = 6;
        let secondsPerBeat = 60.0 / tempo;

        if (timeSignature === 6) {
            secondsPerBeat /= 2;
        }

        expect(secondsPerBeat).toBe(0.25);
    })
})

describe('Beat Counter Reset', () => {
    it('resets to 0 when reaching time signature', () => {
        let timeSignature = 4;
        let beatCount = 4;

        if (beatCount === timeSignature) {
            beatCount = 0;
        }

        expect(beatCount).toBe(0);
    })
})

describe('Beat Accent Logic', () => {
    it('accents downbeats (beat 1 of each measure) with 440Hz', () => {
        let beatNumber = 4;
        let timeSignature = 4;
        let frequency = beatNumber % timeSignature === 0 ? 440.0 : 220.0;

        expect(frequency).toBe(440.0);
    })

    it('uses 220Hz for other beats', () => {
        let beatNumber = 2;
        let timeSignature = 4;
        let frequency = beatNumber % timeSignature === 0 ? 440.0 : 220.0;

        expect(frequency).toBe(220.0);
    })
})