import { buildToneGraph, type ToneGraph } from "./graph";
import { DEFAULT_PARAMS } from "./presets";
import type { EngineParams, EntrainmentMode, Journey, NoiseType } from "./types";

export interface EngineSnapshot {
  playing: boolean;
  params: EngineParams;
  journey: Journey | null;
  journeyElapsed: number;
}

type Listener = (snapshot: EngineSnapshot) => void;

/**
 * Live playback controller. Owns the AudioContext lifecycle; a fresh
 * context is created per play so browsers treat each start as a user
 * gesture and stale nodes are fully released.
 *
 * Manual setters are ignored while a journey is running (journeys own the
 * parameter automation), matching the original generator's disabled
 * controls.
 */
export class BinauralEngine {
  private context: AudioContext | null = null;
  private graph: ToneGraph | null = null;
  private params: EngineParams;
  private journey: Journey | null = null;
  private journeyStartTime = 0;
  private journeyTimer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<Listener>();

  constructor(initial: Partial<EngineParams> = {}) {
    this.params = { ...DEFAULT_PARAMS, ...initial };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    const snapshot = this.snapshot;
    for (const listener of this.listeners) listener(snapshot);
  }

  get snapshot(): EngineSnapshot {
    return {
      playing: this.graph !== null,
      params: { ...this.params },
      journey: this.journey,
      journeyElapsed: this.journeyElapsed,
    };
  }

  get isPlaying(): boolean {
    return this.graph !== null;
  }

  get isJourneyActive(): boolean {
    return this.journey !== null;
  }

  get currentParams(): EngineParams {
    return { ...this.params };
  }

  get journeyElapsed(): number {
    if (!this.context || !this.journey) return 0;
    return this.context.currentTime - this.journeyStartTime;
  }

  /** Beat frequency at a point in a journey (linear ramp between steps). */
  journeyBeatFreqAt(elapsed: number): number {
    const journey = this.journey;
    if (!journey) return this.params.beatFreq;
    let prevTime = 0;
    let prevFreq = journey.steps[0]?.settings.beatFreq ?? this.params.beatFreq;
    for (const step of journey.steps) {
      const freq = step.settings.beatFreq;
      if (freq === undefined) continue;
      if (elapsed <= step.time) {
        const span = step.time - prevTime;
        if (span <= 0) return freq;
        const t = (elapsed - prevTime) / span;
        return prevFreq + (freq - prevFreq) * Math.max(0, Math.min(1, t));
      }
      prevTime = step.time;
      prevFreq = freq;
    }
    return prevFreq;
  }

  async play(overrides: Partial<EngineParams> = {}): Promise<void> {
    await this.stop();
    this.params = { ...this.params, ...overrides };
    this.context = new AudioContext();
    this.graph = buildToneGraph(this.context, this.params);
    this.graph.start();
    this.emit();
  }

  async playJourney(journey: Journey): Promise<void> {
    await this.stop();
    this.context = new AudioContext();
    this.journey = journey;
    this.journeyStartTime = this.context.currentTime;

    const first = journey.steps[0]?.settings ?? {};
    const initial: EngineParams = {
      mode: this.params.mode,
      beatFreq: first.beatFreq ?? this.params.beatFreq,
      carrierFreq: first.carrierFreq ?? this.params.carrierFreq,
      volume: first.volume ?? this.params.volume,
      noiseType: journey.noiseType,
      noiseVolume: first.noiseVolume ?? 0,
    };
    this.graph = buildToneGraph(this.context, initial);
    this.graph.scheduleJourney(journey, this.journeyStartTime);
    this.graph.start();

    this.journeyTimer = setInterval(() => {
      if (!this.journey) return;
      if (this.journeyElapsed >= this.journey.duration) {
        void this.stop();
      } else {
        this.emit();
      }
    }, 250);
    this.emit();
  }

  async stop(): Promise<void> {
    if (this.journeyTimer) {
      clearInterval(this.journeyTimer);
      this.journeyTimer = null;
    }
    this.journey = null;
    if (this.graph) {
      this.graph.stop();
      this.graph = null;
    }
    if (this.context) {
      const context = this.context;
      this.context = null;
      try {
        await context.close();
      } catch {
        // context already closed
      }
    }
    this.emit();
  }

  setBeatFreq(beatFreq: number): void {
    this.params.beatFreq = beatFreq;
    if (this.graph && !this.journey) {
      this.graph.setBeatFreq(beatFreq, this.params.carrierFreq);
    }
    this.emit();
  }

  setCarrierFreq(carrierFreq: number): void {
    this.params.carrierFreq = carrierFreq;
    if (this.graph && !this.journey) {
      this.graph.setCarrierFreq(carrierFreq, this.params.beatFreq);
    }
    this.emit();
  }

  setVolume(volume: number): void {
    this.params.volume = volume;
    if (this.graph && !this.journey) {
      this.graph.setVolume(volume);
    }
    this.emit();
  }

  setNoiseVolume(volume: number): void {
    this.params.noiseVolume = volume;
    if (this.graph && !this.journey) {
      this.graph.setNoiseVolume(volume);
    }
    this.emit();
  }

  setNoiseType(type: NoiseType): void {
    this.params.noiseType = type;
    if (this.graph && !this.journey) {
      this.graph.setNoise(type, this.params.noiseVolume);
    }
    this.emit();
  }

  /** Switching mode restarts playback, since the node graph differs. */
  async setMode(mode: EntrainmentMode): Promise<void> {
    this.params.mode = mode;
    if (this.graph && !this.journey) {
      await this.play();
    } else {
      this.emit();
    }
  }

  dispose(): void {
    void this.stop();
    this.listeners.clear();
  }
}
