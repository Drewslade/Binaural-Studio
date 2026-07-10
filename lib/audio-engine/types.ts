/**
 * Framework-agnostic types for the Binaural Studio audio engine.
 * Nothing in lib/audio-engine may import from React or Next.
 */

export type EntrainmentMode = "binaural" | "isochronic";

export type NoiseType = "none" | "white" | "pink" | "brown";

export interface EngineParams {
  mode: EntrainmentMode;
  /** Perceived beat / pulse rate in Hz. */
  beatFreq: number;
  /** Carrier (base) tone in Hz. */
  carrierFreq: number;
  /** Master tone gain, 0–0.3. */
  volume: number;
  noiseType: NoiseType;
  /** Background noise gain, 0–0.15. */
  noiseVolume: number;
}

export interface JourneyStepSettings {
  beatFreq?: number;
  carrierFreq?: number;
  volume?: number;
  noiseVolume?: number;
}

export interface JourneyStep {
  /** Seconds from the start of the journey. Values ramp linearly between steps. */
  time: number;
  settings: JourneyStepSettings;
}

export interface Journey {
  id: string;
  name: string;
  /** Total length in seconds. */
  duration: number;
  noiseType: NoiseType;
  steps: JourneyStep[];
}

export interface Band {
  slug: string;
  name: string;
  hzLow: number;
  hzHigh: number;
}

export interface ParamRange {
  min: number;
  max: number;
  step: number;
}
