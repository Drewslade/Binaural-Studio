import { buildToneGraph } from "./graph";
import { audioBufferToWavBlob } from "./wav";
import type { EngineParams, EntrainmentMode, Journey } from "./types";

const SAMPLE_RATE = 44100;

/** Render the current settings to a WAV blob of the given length. */
export async function renderStaticWav(
  params: EngineParams,
  durationSeconds: number
): Promise<Blob> {
  const context = new OfflineAudioContext(
    2,
    Math.floor(SAMPLE_RATE * durationSeconds),
    SAMPLE_RATE
  );
  const graph = buildToneGraph(context, params);
  graph.start(0);
  const rendered = await context.startRendering();
  return audioBufferToWavBlob(rendered);
}

/** Render a full journey (with all ramps) to a WAV blob. */
export async function renderJourneyWav(
  journey: Journey,
  mode: EntrainmentMode
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
  const context = new OfflineAudioContext(
    2,
    SAMPLE_RATE * journey.duration,
    SAMPLE_RATE
  );
  const graph = buildToneGraph(context, params);
  graph.scheduleJourney(journey, 0);
  graph.start(0);
  const rendered = await context.startRendering();
  return audioBufferToWavBlob(rendered);
}
