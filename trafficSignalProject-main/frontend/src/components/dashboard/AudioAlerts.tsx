import { useEffect, useRef } from 'react';

// Simple beep synth
const playAlertSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

export default function AudioAlerts({ active, violationCount }: { active: boolean, violationCount: number }) {
    const prevCount = useRef(violationCount);

    useEffect(() => {
        if (active && violationCount > prevCount.current) {
            playAlertSound();
        }
        prevCount.current = violationCount;
    }, [violationCount, active]);

    return null; // Logic only component
}
