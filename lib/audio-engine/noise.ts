import type { NoiseType } from "./types";

/**
 * Looping noise buffer sources. All generators take a BaseAudioContext so
 * they work identically in live (AudioContext) and offline-render
 * (OfflineAudioContext) graphs.
 */

function createNoiseBuffer(
  context: BaseAudioContext,
  fill: (output: Float32Array) => void
): AudioBufferSourceNode {
  const bufferSize = 2 * context.sampleRate;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  fill(buffer.getChannelData(0));
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  return noise;
}

export function createWhiteNoise(context: BaseAudioContext): AudioBufferSourceNode {
  return createNoiseBuffer(context, (output) => {
    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  });
}

/** Paul Kellet's economy pink-noise filter over white noise. */
export function createPinkNoise(context: BaseAudioContext): AudioBufferSourceNode {
  return createNoiseBuffer(context, (output) => {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < output.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  });
}

/** Leaky-integrator brown noise. */
export function createBrownNoise(context: BaseAudioContext): AudioBufferSourceNode {
  return createNoiseBuffer(context, (output) => {
    let lastOut = 0.0;
    for (let i = 0; i < output.length; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
  });
}

export function createNoiseSource(
  context: BaseAudioContext,
  type: NoiseType
): AudioBufferSourceNode | null {
  switch (type) {
    case "white":
      return createWhiteNoise(context);
    case "pink":
      return createPinkNoise(context);
    case "brown":
      return createBrownNoise(context);
    default:
      return null;
  }
}
