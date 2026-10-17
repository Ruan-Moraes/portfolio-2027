'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib';

interface SynthNodes {
  context: AudioContext;
  gainNode: GainNode;
  oscillators: OscillatorNode[];
  intervalId: number;
}

export function AmbientSoundbar() {
  const t = useTranslations('common');
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SynthNodes | null>(null);

  const stopSynth = useCallback(() => {
    const active = synthRef.current;
    if (!active) return;

    window.clearInterval(active.intervalId);
    active.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore already stopped oscillators
      }
    });
    active.gainNode.disconnect();
    void active.context.close();
    synthRef.current = null;
    setIsPlaying(false);
  }, []);

  const startSynth = useCallback(() => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtx) return;

    const context = new AudioCtx();
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(0.035, context.currentTime);
    masterGain.connect(context.destination);

    // Acorde espacial cyber-ambient (Fmaj7 / Dm9 atmosférico)
    const baseFrequencies = [146.83, 220.0, 261.63, 329.63];
    const oscillators = baseFrequencies.map((freq, idx) => {
      const osc = context.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, context.currentTime);
      osc.connect(masterGain);
      osc.start();
      return osc;
    });

    let chordIndex = 0;
    const progressions = [
      [146.83, 220.0, 261.63, 329.63],
      [130.81, 196.0, 246.94, 293.66],
      [116.54, 174.61, 220.0, 261.63],
      [130.81, 196.0, 246.94, 329.63],
    ];

    const intervalId = window.setInterval(() => {
      chordIndex = (chordIndex + 1) % progressions.length;
      const chord = progressions[chordIndex];
      oscillators.forEach((osc, i) => {
        osc.frequency.exponentialRampToValueAtTime(
          chord[i],
          context.currentTime + 2.4
        );
      });
    }, 4500);

    synthRef.current = {
      context,
      gainNode: masterGain,
      oscillators,
      intervalId,
    };
    setIsPlaying(true);
  }, []);

  const toggleSound = () => {
    if (isPlaying) {
      stopSynth();
    } else {
      startSynth();
    }
  };

  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, [stopSynth]);

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? t('musicPlaying') : t('musicPaused')}
      title={isPlaying ? t('musicPlaying') : t('musicPaused')}
      className="group relative flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 px-3 text-xs backdrop-blur-md transition-all hover:border-[var(--ui-accent)]/60"
    >
      <span className="font-script text-sm text-[var(--ui-accent)] opacity-85">
        &lt;{t('musicLabel')}&gt;
      </span>

      <span className="flex h-3.5 items-end gap-0.5">
        {[0, 1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            style={{
              animationDelay: `${bar * 140}ms`,
            }}
            className={cn(
              'w-0.5 rounded-full bg-[var(--ui-accent)] transition-all duration-300',
              isPlaying ? 'h-3.5 animate-sound-wave' : 'h-1 opacity-50'
            )}
          />
        ))}
      </span>
    </button>
  );
}
