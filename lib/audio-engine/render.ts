import { createWavHeader } from "./wav";
import type {
  EngineParams,
  EntrainmentMode,
  Journey,
  JourneyStepSettings,
  NoiseType,
} from "./types";

const SAMPLE_RATE = 22050;
const CHANNELS = 2;
const BYTES_PER_SAMPLE = 2;
const CHUNK_SECONDS = 2;
const TWO_PI = Math.PI * 2;

export type RenderProgress = (progress: number) => void;

type JourneyValue = keyof JourneyStepSettings;

interface NoiseState {
  b0: number;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
  b6: number;
  lastBrown: number;
}

function createNoiseState(): NoiseState {
  return { b0: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0, lastBrown: 0 };
}

function noiseSample(type: NoiseType, state: NoiseState): number {
  if (type === "none") return 0;
  const white = Math.random() * 2 - 1;
  if (type === "white") return white;

  if (type === "pink") {
    state.b0 = 0.99886 * state.b0 + white * 0.0555179;
    state.b1 = 0.99332 * state.b1 + white * 0.0750759;
    state.b2 = 0.969 * state.b2 + white * 0.153852;
    state.b3 = 0.8665 * state.b3 + white * 0.3104856;
    state.b4 = 0.55 * state.b4 + white * 0.5329522;
    state.b5 = -0.7616 * state.b5 - white * 0.016898;
    const pink =
      (state.b0 +
        state.b1 +
        state.b2 +
        state.b3 +
        state.b4 +
        state.b5 +
        state.b6 +
        white * 0.5362) *
      0.11;
    state.b6 = white * 0.115926;
    return pink;
  }

  const brown = (state.lastBrown + 0.02 * white) / 1.02;
  state.lastBrown = brown;
  return brown * 3.5;
}

function journeyValueAt(
  journey: Journey | undefined,
  elapsed: number,
  key: JourneyValue,
  fallback: number
): number {
  if (!journey) return fallback;

  let previousTime = 0;
  let previousValue = fallback;
  for (const step of journey.steps) {
    const nextValue = step.settings[key];
    if (nextValue === undefined) continue;
    if (elapsed <= step.time) {
      const span = step.time - previousTime;
      if (span <= 0) return nextValue;
      const progress = Math.max(0, Math.min(1, (elapsed - previousTime) / span));
      return previousValue + (nextValue - previousValue) * progress;
    }
    previousTime = step.time;
    previousValue = nextValue;
  }
  return previousValue;
}

function floatToPcm16(value: number): number {
  const clamped = Math.max(-1, Math.min(1, value));
  return Math.round(clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff);
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function renderWav(
  params: EngineParams,
  durationSeconds: number,
  journey?: Journey,
  onProgress?: RenderProgress
): Promise<Blob> {
  const totalFrames = Math.floor(SAMPLE_RATE * durationSeconds);
  if (!Number.isFinite(totalFrames) || totalFrames <= 0) {
    throw new Error("Audio duration must be greater than zero.");
  }

  const parts: BlobPart[] = [createWavHeader(CHANNELS, SAMPLE_RATE, totalFrames)];
  const framesPerChunk = SAMPLE_RATE * CHUNK_SECONDS;
  const noise = createNoiseState();
  let leftPhase = 0;
  let rightPhase = 0;
  let carrierPhase = 0;
  let pulsePhase = 0;

  onProgress?.(0);
  for (let chunkStart = 0; chunkStart < totalFrames; chunkStart += framesPerChunk) {
    const chunkFrames = Math.min(framesPerChunk, totalFrames - chunkStart);
    const chunk = new ArrayBuffer(chunkFrames * CHANNELS * BYTES_PER_SAMPLE);
    const view = new DataView(chunk);

    for (let frame = 0; frame < chunkFrames; frame++) {
      const absoluteFrame = chunkStart + frame;
      const elapsed = absoluteFrame / SAMPLE_RATE;
      const beatFreq = journeyValueAt(journey, elapsed, "beatFreq", params.beatFreq);
      const carrierFreq = journeyValueAt(
        journey,
        elapsed,
        "carrierFreq",
        params.carrierFreq
      );
      const volume = journeyValueAt(journey, elapsed, "volume", params.volume);
      const noiseVolume = journeyValueAt(
        journey,
        elapsed,
        "noiseVolume",
        params.noiseVolume
      );
      const background = noiseSample(params.noiseType, noise) * noiseVolume;

      let left: number;
      let right: number;
      if (params.mode === "binaural") {
        left = Math.sin(leftPhase) * volume + background;
        right = Math.sin(rightPhase) * volume + background;
        leftPhase = (leftPhase + (TWO_PI * carrierFreq) / SAMPLE_RATE) % TWO_PI;
        rightPhase =
          (rightPhase + (TWO_PI * (carrierFreq + beatFreq)) / SAMPLE_RATE) % TWO_PI;
      } else {
        const pulse = Math.sin(pulsePhase) * 0.5 + 0.5;
        const tone = Math.sin(carrierPhase) * pulse * volume;
        left = tone + background;
        right = left;
        carrierPhase = (carrierPhase + (TWO_PI * carrierFreq) / SAMPLE_RATE) % TWO_PI;
        pulsePhase = (pulsePhase + (TWO_PI * beatFreq) / SAMPLE_RATE) % TWO_PI;
      }

      const byteOffset = frame * CHANNELS * BYTES_PER_SAMPLE;
      view.setInt16(byteOffset, floatToPcm16(left), true);
      view.setInt16(byteOffset + BYTES_PER_SAMPLE, floatToPcm16(right), true);
    }

    parts.push(chunk);
    onProgress?.(Math.min(1, (chunkStart + chunkFrames) / totalFrames));
    await nextFrame();
  }

  return new Blob(parts, { type: "audio/wav" });
}

/** Render the current settings without allocating the full session in memory. */
export function renderStaticWav(
  params: EngineParams,
  durationSeconds: number,
  onProgress?: RenderProgress
): Promise<Blob> {
  return renderWav(params, durationSeconds, undefined, onProgress);
}

/** Render a full journey, including its parameter ramps, in small chunks. */
export function renderJourneyWav(
  journey: Journey,
  mode: EntrainmentMode,
  onProgress?: RenderProgress
): Promise<Blob> {
  const first = journey.steps[0]?.settings ?? {};
  const params: EngineParams = {
    mode,
    beatFreq: first.beatFreq ?? 10,
    carrierFreq: first.carrierFreq ?? 220,
    volume: first.volume ?? 0.1,
    noiseType: journey.noiseType,
    noiseVolume: first.noiseVolume ?? 0,
  };
  return renderWav(params, journey.duration, journey, onProgress);
}
