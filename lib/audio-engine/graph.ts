import { createNoiseSource } from "./noise";
import type { EngineParams, Journey, NoiseType } from "./types";

/**
 * One audio-node graph shared by live playback, journeys, and offline WAV
 * rendering. Binaural mode runs two oscillators hard-panned left/right;
 * isochronic mode amplitude-pulses a single oscillator with an LFO
 * (LFO * 0.5 + constant 0.5 → gain swings 0..1 at the beat rate).
 */
export interface ToneGraph {
  readonly context: BaseAudioContext;
  start(when?: number): void;
  stop(): void;
  setBeatFreq(beatFreq: number, carrierFreq: number): void;
  setCarrierFreq(carrierFreq: number, beatFreq: number): void;
  setVolume(volume: number): void;
  setNoiseVolume(volume: number): void;
  /** Live contexts only: swap the looping noise buffer in place. */
  setNoise(type: NoiseType, volume: number): void;
  scheduleJourney(journey: Journey, startTime: number): void;
}

export function buildToneGraph(
  context: BaseAudioContext,
  params: EngineParams,
  destination: AudioNode = context.destination
): ToneGraph {
  const now = context.currentTime;

  const masterGain = context.createGain();
  masterGain.gain.setValueAtTime(params.volume, now);
  masterGain.connect(destination);

  let oscLeft: OscillatorNode | null = null;
  let oscRight: OscillatorNode | null = null;
  let isoOsc: OscillatorNode | null = null;
  let lfo: OscillatorNode | null = null;
  let constantOffset: ConstantSourceNode | null = null;

  if (params.mode === "binaural") {
    oscLeft = context.createOscillator();
    oscLeft.type = "sine";
    oscLeft.frequency.setValueAtTime(params.carrierFreq, now);
    const panLeft = context.createStereoPanner();
    panLeft.pan.setValueAtTime(-1, now);
    oscLeft.connect(panLeft).connect(masterGain);

    oscRight = context.createOscillator();
    oscRight.type = "sine";
    oscRight.frequency.setValueAtTime(params.carrierFreq + params.beatFreq, now);
    const panRight = context.createStereoPanner();
    panRight.pan.setValueAtTime(1, now);
    oscRight.connect(panRight).connect(masterGain);
  } else {
    const pulseGain = context.createGain();
    pulseGain.gain.setValueAtTime(0, now);
    pulseGain.connect(masterGain);

    lfo = context.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(params.beatFreq, now);
    const lfoScaler = context.createGain();
    lfoScaler.gain.setValueAtTime(0.5, now);
    lfo.connect(lfoScaler).connect(pulseGain.gain);

    constantOffset = context.createConstantSource();
    constantOffset.offset.setValueAtTime(0.5, now);
    constantOffset.connect(pulseGain.gain);

    isoOsc = context.createOscillator();
    isoOsc.type = "sine";
    isoOsc.frequency.setValueAtTime(params.carrierFreq, now);
    isoOsc.connect(pulseGain);
  }

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(params.noiseType === "none" ? 0 : params.noiseVolume, now);
  noiseGain.connect(destination);
  let noiseSource = createNoiseSource(context, params.noiseType);
  if (noiseSource) noiseSource.connect(noiseGain);

  let started = false;

  const sources = (): AudioScheduledSourceNode[] => {
    const all: (AudioScheduledSourceNode | null)[] = [
      oscLeft,
      oscRight,
      isoOsc,
      lfo,
      constantOffset,
      noiseSource,
    ];
    return all.filter((n): n is AudioScheduledSourceNode => n !== null);
  };

  return {
    context,

    start(when) {
      started = true;
      for (const src of sources()) {
        if (when === undefined) src.start();
        else src.start(when);
      }
    },

    stop() {
      for (const src of sources()) {
        try {
          src.stop();
        } catch {
          // never started or already stopped
        }
      }
    },

    setBeatFreq(beatFreq, carrierFreq) {
      const t = context.currentTime;
      if (oscRight) oscRight.frequency.setValueAtTime(carrierFreq + beatFreq, t);
      if (lfo) lfo.frequency.setValueAtTime(beatFreq, t);
    },

    setCarrierFreq(carrierFreq, beatFreq) {
      const t = context.currentTime;
      if (oscLeft) oscLeft.frequency.setValueAtTime(carrierFreq, t);
      if (oscRight) oscRight.frequency.setValueAtTime(carrierFreq + beatFreq, t);
      if (isoOsc) isoOsc.frequency.setValueAtTime(carrierFreq, t);
    },

    setVolume(volume) {
      masterGain.gain.setValueAtTime(volume, context.currentTime);
    },

    setNoiseVolume(volume) {
      noiseGain.gain.setValueAtTime(volume, context.currentTime);
    },

    setNoise(type, volume) {
      if (noiseSource) {
        try {
          noiseSource.stop();
        } catch {
          // already stopped
        }
        noiseSource.disconnect();
        noiseSource = null;
      }
      const next = createNoiseSource(context, type);
      if (next) {
        next.connect(noiseGain);
        if (started) next.start();
        noiseSource = next;
        noiseGain.gain.setValueAtTime(volume, context.currentTime);
      } else {
        noiseGain.gain.setValueAtTime(0, context.currentTime);
      }
    },

    scheduleJourney(journey, startTime) {
      let lastCarrier =
        journey.steps[0]?.settings.carrierFreq ?? params.carrierFreq;
      for (const step of journey.steps) {
        const rampTime = startTime + step.time;
        const s = step.settings;
        if (s.beatFreq !== undefined) {
          if (lfo) lfo.frequency.linearRampToValueAtTime(s.beatFreq, rampTime);
          if (oscRight) {
            const carrier = s.carrierFreq !== undefined ? s.carrierFreq : lastCarrier;
            oscRight.frequency.linearRampToValueAtTime(carrier + s.beatFreq, rampTime);
          }
        }
        if (s.carrierFreq !== undefined) {
          if (isoOsc) isoOsc.frequency.linearRampToValueAtTime(s.carrierFreq, rampTime);
          if (oscLeft) oscLeft.frequency.linearRampToValueAtTime(s.carrierFreq, rampTime);
          lastCarrier = s.carrierFreq;
        }
        if (s.volume !== undefined) {
          masterGain.gain.linearRampToValueAtTime(s.volume, rampTime);
        }
        if (s.noiseVolume !== undefined) {
          noiseGain.gain.linearRampToValueAtTime(s.noiseVolume, rampTime);
        }
      }
    },
  };
}
