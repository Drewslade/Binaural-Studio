import { buildToneGraph, type ToneGraph } from "./graph";
import { DEFAULT_PARAMS } from "./presets";
import type { EngineParams, EntrainmentMode, Journey, NoiseType } from "./types";

export interface EngineSnapshot {
  playing: boolean;
  paused: boolean;
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
  private mediaElement: HTMLAudioElement | null = null;
  private mediaDestination: MediaStreamAudioDestinationNode | null = null;
  private paused = false;
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
      playing: this.graph !== null && !this.paused,
      paused: this.graph !== null && this.paused,
      params: { ...this.params },
      journey: this.journey,
      journeyElapsed: this.journeyElapsed,
    };
  }

  get isPlaying(): boolean {
    return this.graph !== null && !this.paused;
  }

  get isPaused(): boolean {
    return this.graph !== null && this.paused;
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

  /**
   * Route live Web Audio through an HTML audio element when the browser
   * supports it. Mobile browsers treat media elements as background audio
   * more reliably than a bare AudioContext, including when the screen locks.
   */
  private async createPlaybackDestination(): Promise<AudioNode> {
    const context = this.context;
    if (!context) throw new Error("Audio context is not available.");
    if (typeof Audio === "undefined") return context.destination;

    try {
      const destination = context.createMediaStreamDestination();
      const mediaElement = new Audio();
      mediaElement.autoplay = false;
      mediaElement.setAttribute("playsinline", "");
      mediaElement.srcObject = destination.stream;
      this.mediaDestination = destination;
      this.mediaElement = mediaElement;
      await mediaElement.play();
      return destination;
    } catch {
      this.releaseMediaElement();
      return context.destination;
    }
  }

  private releaseMediaElement(): void {
    const mediaElement = this.mediaElement;
    const mediaDestination = this.mediaDestination;
    this.mediaElement = null;
    this.mediaDestination = null;

    if (mediaElement) {
      mediaElement.pause();
      mediaElement.srcObject = null;
    }
    for (const track of mediaDestination?.stream.getTracks() ?? []) {
      track.stop();
    }
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
    const destination = await this.createPlaybackDestination();
    this.graph = buildToneGraph(this.context, this.params, destination);
    this.graph.start();
    this.emit();
  }

  async playJourney(journey: Journey): Promise<void> {
    await this.stop();
    this.context = new AudioContext();
    const destination = await this.createPlaybackDestination();
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
    this.graph = buildToneGraph(this.context, initial, destination);
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
    this.paused = false;
    if (this.graph) {
      this.graph.stop();
      this.graph = null;
    }
    this.releaseMediaElement();
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

  async pause(): Promise<void> {
    if (!this.context || !this.graph || this.paused) return;
    this.paused = true;
    this.mediaElement?.pause();
    try {
      await this.context.suspend();
    } catch {
      // The context may already be interrupted by the operating system.
    }
    this.emit();
  }

  async resume(): Promise<void> {
    if (!this.context || !this.graph || !this.paused) return;
    try {
      await this.context.resume();
      await this.mediaElement?.play();
      this.paused = false;
      this.emit();
    } catch {
      // Keep the paused state so the interface does not claim audio resumed.
    }
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
