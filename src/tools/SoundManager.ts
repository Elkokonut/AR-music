import { Howl, Howler } from 'howler';

export default class SoundManager {
    soundDict: Map<string, { sound: Howler.sound, lastTimePlayed: number }>;
    timeBeforeSound: number; // ms

    constructor() {
        this.soundDict = new Map<string, { sound: Howler.sound, lastTimePlayed: number, set: boolean }>();
        this.timeBeforeSound = 1000;
    }

    private addSound(label: string, sound_path: string) {
        this.soundDict.set(label,
            {
                sound: new Howl({ src: [sound_path] }),
                lastTimePlayed: -this.timeBeforeSound
            });
    }

    playSound(label: string) {
        if (this.soundDict.get(label) == null) {
            this.addSound(label, `sound sample/${label}.wav`);
        }
        const curr_time = Date.now();
        const soundObj = this.soundDict.get(label);
        if (curr_time - soundObj.lastTimePlayed > this.timeBeforeSound) {
            soundObj.lastTimePlayed = curr_time;
            this.soundDict.set(label, soundObj);
            soundObj.sound.play();
        }
    }
}
