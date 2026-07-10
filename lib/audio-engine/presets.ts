import type { Band, EngineParams, Journey, ParamRange } from "./types";

export const DEFAULT_PARAMS: EngineParams = {
  mode: "binaural",
  beatFreq: 10.0,
  carrierFreq: 220,
  volume: 0.1,
  noiseType: "none",
  noiseVolume: 0,
};

export const BEAT_RANGE: ParamRange = { min: 1, max: 30, step: 0.5 };
export const CARRIER_RANGE: ParamRange = { min: 60, max: 600, step: 1 };
export const VOLUME_RANGE: ParamRange = { min: 0, max: 0.3, step: 0.01 };
export const NOISE_RANGE: ParamRange = { min: 0, max: 0.15, step: 0.005 };

export interface BeatPreset {
  id: string;
  label: string;
  beatFreq: number;
}

export const BEAT_PRESETS: BeatPreset[] = [
  { id: "focus", label: "Focus", beatFreq: 15.0 },
  { id: "relax", label: "Relax", beatFreq: 10.0 },
  { id: "meditate", label: "Meditate", beatFreq: 6.0 },
  { id: "sleep", label: "Sleep", beatFreq: 3.0 },
];

export const BANDS: Band[] = [
  { slug: "delta", name: "Delta", hzLow: 0.5, hzHigh: 4 },
  { slug: "theta", name: "Theta", hzLow: 4, hzHigh: 8 },
  { slug: "alpha", name: "Alpha", hzLow: 8, hzHigh: 12 },
  { slug: "beta", name: "Beta", hzLow: 12, hzHigh: 30 },
  { slug: "gamma", name: "Gamma", hzLow: 30, hzHigh: 100 },
];

export function bandForFrequency(hz: number): Band {
  for (const band of BANDS) {
    if (hz < band.hzHigh) return band;
  }
  return BANDS[BANDS.length - 1];
}

export const JOURNEYS: Journey[] = [
  {
    id: "focusRamp",
    name: "Focus Ramp",
    duration: 1500, // 25 min
    noiseType: "pink",
    steps: [
      { time: 0, settings: { beatFreq: 10.0, noiseVolume: 0.01, carrierFreq: 200, volume: 0.1 } },
      { time: 180, settings: { beatFreq: 14.0, noiseVolume: 0.02, carrierFreq: 220 } },
      { time: 300, settings: { beatFreq: 18.0 } },
      { time: 1380, settings: { beatFreq: 18.0 } },
      { time: 1500, settings: { beatFreq: 12.0, noiseVolume: 0.01, carrierFreq: 200 } },
    ],
  },
  {
    id: "meditationTrip",
    name: "Meditation Trip",
    duration: 900, // 15 min
    noiseType: "brown",
    steps: [
      { time: 0, settings: { beatFreq: 10.0, noiseVolume: 0.03, carrierFreq: 180, volume: 0.1 } },
      { time: 180, settings: { beatFreq: 7.0, noiseVolume: 0.04, carrierFreq: 170 } },
      { time: 480, settings: { beatFreq: 4.0, noiseVolume: 0.05, carrierFreq: 160 } },
      { time: 720, settings: { beatFreq: 8.0, noiseVolume: 0.04, carrierFreq: 170 } },
      { time: 900, settings: { beatFreq: 10.0, noiseVolume: 0.03, carrierFreq: 180 } },
    ],
  },
  {
    id: "thetaTrance",
    name: "Theta Trance",
    duration: 720, // 12 min
    noiseType: "brown",
    steps: [
      { time: 0, settings: { beatFreq: 9.0, noiseVolume: 0.04, carrierFreq: 136.1, volume: 0.12 } },
      { time: 120, settings: { beatFreq: 9.0 } },
      { time: 360, settings: { beatFreq: 4.5, noiseVolume: 0.05 } },
      { time: 600, settings: { beatFreq: 4.5 } },
      { time: 720, settings: { beatFreq: 9.0, noiseVolume: 0.04 } },
    ],
  },
  {
    id: "hypnagogicDip",
    name: "Hypnagogic Dip",
    duration: 1200, // 20 min
    noiseType: "pink",
    steps: [
      { time: 0, settings: { beatFreq: 10.0, noiseVolume: 0.02, carrierFreq: 417, volume: 0.1 } },
      { time: 180, settings: { beatFreq: 10.0 } },
      { time: 600, settings: { beatFreq: 6.0, noiseVolume: 0.03 } },
      { time: 1020, settings: { beatFreq: 6.0 } },
      { time: 1200, settings: { beatFreq: 11.0, noiseVolume: 0.02 } },
    ],
  },
];

export function getJourney(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
