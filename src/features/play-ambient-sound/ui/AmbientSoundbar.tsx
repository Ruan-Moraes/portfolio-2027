'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib';

interface SynthNodes {
  context: AudioContext;
  masterGain: GainNode;
  schedulerId: number | null;
  stepIndex: number;
}

interface ChordProgressionStep {
  pad: number[];
  melody: number[];
}

const SOUND_BARS = [0, 1, 2, 3, 4] as const;

// Progressão Lo-Fi / Chillhop alegre e relaxante (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
const LOFI_CHORDS: ChordProgressionStep[] = [
  {
    // Fmaj7 (F3, A3, C4, E4) + notas da pentatônica de Dó maior
    pad: [174.61, 220.0, 261.63, 329.63],
    melody: [523.25, 659.25, 587.33, 523.25],
  },
  {
    // Em7 (E3, G3, B3, D4)
    pad: [164.81, 196.0, 246.94, 293.66],
    melody: [493.88, 587.33, 659.25, 783.99],
  },
  {
    // Dm9 (D3, F3, A3, E4)
    pad: [146.83, 174.61, 220.0, 329.63],
    melody: [440.0, 523.25, 587.33, 659.25],
  },
  {
    // Cmaj9 (C3, E3, G3, D4)
    pad: [130.81, 164.81, 196.0, 293.66],
    melody: [523.25, 659.25, 783.99, 659.25],
  },
];

function playRhodesNote(
  context: AudioContext,
  destination: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  peakGain: number
) {
  const osc = context.createOscillator();
  const subOsc = context.createOscillator();
  const filter = context.createBiquadFilter();

  const env = context.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  // Harmônico suave de piano elétrico (Rhodes)
  subOsc.type = 'triangle';
  subOsc.frequency.setValueAtTime(freq * 2, startTime);

  const subGain = context.createGain();

  subGain.gain.setValueAtTime(0.12, startTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, startTime);

  // Envelope ADSR macio (sem glissando assustador)
  env.gain.setValueAtTime(0.0001, startTime);
  env.gain.linearRampToValueAtTime(peakGain, startTime + 0.08);
  env.gain.exponentialRampToValueAtTime(
    peakGain * 0.45,
    startTime + duration * 0.5
  );
  env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(filter);
  subOsc.connect(subGain);
  subGain.connect(filter);
  filter.connect(env);
  env.connect(destination);

  osc.start(startTime);
  subOsc.start(startTime);

  const stopAt = startTime + duration + 0.05;

  osc.stop(stopAt);
  subOsc.stop(stopAt);

  // Release Web Audio graph nodes once note finishes to prevent memory accumulation
  subOsc.onended = () => {
    osc.disconnect();
    subOsc.disconnect();
    subGain.disconnect();
    filter.disconnect();
    env.disconnect();
  };
}

function AmbientSoundbarComponent() {
  const t = useTranslations('common');

  const [isPlaying, setIsPlaying] = useState(false);

  const isPlayingRef = useRef(false);
  const synthRef = useRef<SynthNodes | null>(null);

  const pauseSynth = useCallback(() => {
    const active = synthRef.current;

    if (!active) return;

    if (active.schedulerId !== null) {
      window.clearInterval(active.schedulerId);

      active.schedulerId = null;
    }

    if (active.context.state === 'running') {
      void active.context.suspend();
    }

    isPlayingRef.current = false;

    setIsPlaying(false);
  }, []);

  const destroySynth = useCallback(() => {
    const active = synthRef.current;

    if (!active) return;

    if (active.schedulerId !== null) {
      window.clearInterval(active.schedulerId);
    }

    active.masterGain.disconnect();

    void active.context.close();

    synthRef.current = null;

    isPlayingRef.current = false;
  }, []);

  const startSynth = useCallback(async () => {
    let nodes = synthRef.current;

    if (!nodes) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioCtx) return;

      const context = new AudioCtx();
      const masterGain = context.createGain();

      masterGain.gain.setValueAtTime(0.18, context.currentTime);

      masterGain.connect(context.destination);

      nodes = {
        context,
        masterGain,
        schedulerId: null,
        stepIndex: 0,
      };

      synthRef.current = nodes;
    }

    if (nodes.context.state === 'suspended') {
      await nodes.context.resume();
    }

    const triggerBar = () => {
      const current = synthRef.current;

      if (
        !current ||
        current.context.state !== 'running' ||
        document.hidden ||
        !isPlayingRef.current
      ) {
        return;
      }

      const now = current.context.currentTime + 0.05;

      const step = LOFI_CHORDS[current.stepIndex % LOFI_CHORDS.length];

      current.stepIndex += 1;

      step.pad.forEach((freq, i) => {
        playRhodesNote(
          current.context,
          current.masterGain,
          freq,
          now + i * 0.04,
          3.1,
          0.055
        );
      });

      step.melody.forEach((noteFreq, beatIdx) => {
        const noteStart = now + beatIdx * 0.78;

        playRhodesNote(
          current.context,
          current.masterGain,
          noteFreq,
          noteStart,
          1.35,
          0.042
        );
      });
    };

    isPlayingRef.current = true;

    setIsPlaying(true);

    triggerBar();

    if (nodes.schedulerId !== null) {
      window.clearInterval(nodes.schedulerId);
    }

    nodes.schedulerId = window.setInterval(triggerBar, 3200);
  }, []);

  const toggleSound = () => {
    if (isPlayingRef.current) {
      pauseSynth();
    } else {
      void startSynth();
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      const active = synthRef.current;

      if (!active || !isPlayingRef.current) return;

      if (document.hidden && active.context.state === 'running') {
        void active.context.suspend();
      } else if (!document.hidden && active.context.state === 'suspended') {
        void active.context.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      destroySynth();
    };
  }, [destroySynth]);

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? t('musicPlaying') : t('musicPaused')}
      title={isPlaying ? t('musicPlaying') : t('musicPaused')}
      className="group relative inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 px-3 text-xs backdrop-blur-md transition-all hover:border-[var(--ui-accent)]/60"
    >
      <span className="font-script flex items-center pt-0.5 text-base leading-none text-[var(--ui-accent)] opacity-90">
        &lt;{t('musicLabel')}&gt;
      </span>

      <span className="flex h-3.5 items-center gap-0.5">
        {SOUND_BARS.map((bar) => (
          <span
            key={bar}
            style={{
              animationDelay: `${bar * 140}ms`,
            }}
            className={cn(
              'w-0.5 rounded-full bg-[var(--ui-accent)] transition-all duration-300',
              isPlaying ? 'h-3.5 animate-sound-wave' : 'h-1.5 opacity-60'
            )}
          />
        ))}
      </span>
    </button>
  );
}

export const AmbientSoundbar = memo(AmbientSoundbarComponent);

