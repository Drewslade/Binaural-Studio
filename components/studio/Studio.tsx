"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BEAT_PRESETS,
  BEAT_RANGE,
  CARRIER_RANGE,
  DEFAULT_PARAMS,
  JOURNEYS,
  NOISE_RANGE,
  VOLUME_RANGE,
  BinauralEngine,
  bandForFrequency,
  formatTime,
  getJourney,
  renderJourneyWav,
  renderStaticWav,
  type EngineParams,
  type EntrainmentMode,
  type Journey,
  type NoiseType,
} from "@/lib/audio-engine";
import Visualizer from "./Visualizer";

interface PreparedExport {
  blob: Blob;
  filename: string;
  url: string;
}

const MAX_EXPORT_MINUTES = 30;
const cardClass = "rounded-2xl border border-paper/10 bg-charcoal p-4 sm:p-6";
const selectClass =
  "w-full rounded-lg border border-paper/15 bg-ink px-3 py-2.5 text-sm text-paper focus:border-gold focus:outline-none";

export default function Studio() {
  const engineRef = useRef<BinauralEngine | null>(null);
  const getEngine = () => {
    if (!engineRef.current) engineRef.current = new BinauralEngine();
    return engineRef.current;
  };

  const [params, setParams] = useState<EngineParams>(DEFAULT_PARAMS);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [journeyElapsed, setJourneyElapsed] = useState(0);
  const [visualBeat, setVisualBeat] = useState(DEFAULT_PARAMS.beatFreq);
  const [selectedJourneyId, setSelectedJourneyId] = useState("none");
  const [exportMinutes, setExportMinutes] = useState("5");
  const [exportBusy, setExportBusy] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const [preparedExport, setPreparedExport] = useState<PreparedExport | null>(null);
  const [shareSupported, setShareSupported] = useState(false);
  const preparedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const engine = getEngine();
    const unsubscribe = engine.subscribe((snap) => {
      setParams(snap.params);
      setPlaying(snap.playing);
      setPaused(snap.paused);
      setJourney(snap.journey);
      setJourneyElapsed(snap.journeyElapsed);
      setVisualBeat(
        snap.journey
          ? engine.journeyBeatFreqAt(snap.journeyElapsed)
          : snap.params.beatFreq
      );
    });
    return () => {
      unsubscribe();
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    setShareSupported(
      typeof navigator.share === "function" && typeof navigator.canShare === "function"
    );
    return () => {
      if (preparedUrlRef.current) URL.revokeObjectURL(preparedUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    if (typeof MediaMetadata !== "undefined") {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: journey?.name ?? `${visualBeat.toFixed(1)} Hz ${params.mode} session`,
        artist: "Binaural Studio",
        album: "Studio",
      });
    }
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";

    const play = () => {
      const engine = getEngine();
      if (engine.isPaused) {
        void engine.resume();
        return;
      }
      const selected = getJourney(selectedJourneyId);
      if (selected) void engine.playJourney(selected);
      else void engine.play();
    };
    const pause = () => void getEngine().pause();
    const stop = () => void getEngine().stop();

    try {
      navigator.mediaSession.setActionHandler("play", play);
      navigator.mediaSession.setActionHandler("pause", pause);
      navigator.mediaSession.setActionHandler("stop", stop);
    } catch {
      // Some browsers expose Media Session with only partial action support.
    }

    return () => {
      try {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("stop", null);
      } catch {
        // Partial Media Session implementations may reject unsupported actions.
      }
    };
  }, [journey, params.mode, paused, playing, selectedJourneyId, visualBeat]);

  const journeyRunning = journey !== null;
  const band = bandForFrequency(visualBeat);
  const activePresetId = BEAT_PRESETS.find(
    (p) => Math.abs(p.beatFreq - params.beatFreq) < 0.001
  )?.id;

  // --- handlers ---------------------------------------------------------

  const handlePreset = (beatFreq: number) => {
    const engine = getEngine();
    engine.setBeatFreq(beatFreq);
    if (!engine.isPlaying) void engine.play();
  };

  const handlePlayStop = () => {
    const engine = getEngine();
    if (engine.isPlaying) void engine.stop();
    else if (engine.isPaused) void engine.resume();
    else void engine.play();
  };

  const handleMode = (mode: EntrainmentMode) => {
    void getEngine().setMode(mode);
  };

  const handleNoiseVolume = (value: number) => {
    const engine = getEngine();
    if (params.noiseType === "none" && value > 0) {
      engine.setNoiseType("white");
    }
    engine.setNoiseVolume(value);
  };

  const handleNoiseType = (type: NoiseType) => {
    const engine = getEngine();
    engine.setNoiseType(type);
    if (type !== "none" && params.noiseVolume === 0) {
      engine.setNoiseVolume(0.02);
    }
  };

  const handleJourneyPlay = () => {
    const selected = getJourney(selectedJourneyId);
    if (selected) void getEngine().playJourney(selected);
  };

  const handleExport = async () => {
    setExportBusy(true);
    setPreparedExport(null);
    if (preparedUrlRef.current) {
      URL.revokeObjectURL(preparedUrlRef.current);
      preparedUrlRef.current = null;
    }
    try {
      const selected = getJourney(selectedJourneyId);
      let blob: Blob;
      let filename: string;
      const updateProgress = (progress: number) => {
        const percent = Math.round(progress * 100);
        setExportStatus(
          selected
            ? `Rendering ${selected.name}: ${percent}%`
            : `Rendering audio: ${percent}%`
        );
      };

      if (selected) {
        blob = await renderJourneyWav(selected, params.mode, updateProgress);
        filename = `binaural-studio_${selected.id}.wav`;
      } else {
        const minutes = Number.parseFloat(exportMinutes);
        if (
          !Number.isFinite(minutes) ||
          minutes < 1 ||
          minutes > MAX_EXPORT_MINUTES
        ) {
          setExportStatus(
            `Enter a duration between 1 and ${MAX_EXPORT_MINUTES} minutes.`
          );
          setExportBusy(false);
          return;
        }
        blob = await renderStaticWav(params, minutes * 60, updateProgress);
        filename = `binaural-studio_${params.beatFreq}hz_${params.mode}.wav`;
      }

      const url = URL.createObjectURL(blob);
      preparedUrlRef.current = url;
      setPreparedExport({ blob, filename, url });
      setExportStatus("Your WAV is ready. Save it or use your phone's share menu.");
    } catch (error) {
      console.error("Export failed:", error);
      setExportStatus("Export failed. Try a shorter duration.");
    }
    setExportBusy(false);
  };

  const handleShare = async () => {
    if (!preparedExport || !navigator.share || !navigator.canShare) return;
    const file = new File([preparedExport.blob], preparedExport.filename, {
      type: "audio/wav",
    });
    if (!navigator.canShare({ files: [file] })) {
      setExportStatus("File sharing is not supported here. Use Save WAV instead.");
      return;
    }

    try {
      await navigator.share({
        title: "Binaural Studio audio",
        files: [file],
      });
      setExportStatus("File shared.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setExportStatus("Sharing failed. Use Save WAV instead.");
    }
  };

  // --- render -----------------------------------------------------------

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Left: generator */}
      <div className={cardClass}>
        {/* Mode */}
        <div
          className="grid grid-cols-2 gap-1 rounded-xl border border-paper/10 bg-ink p-1"
          role="group"
          aria-label="Playback mode"
        >
          {(
            [
              ["binaural", "Binaural", "headphones"],
              ["isochronic", "Isochronic", "speakers"],
            ] as const
          ).map(([mode, label, hint]) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleMode(mode)}
              disabled={journeyRunning}
              aria-pressed={params.mode === mode}
              className={`min-h-12 rounded-lg px-2 py-2.5 text-sm transition-colors disabled:opacity-40 sm:px-3 ${
                params.mode === mode
                  ? "bg-charcoal text-gold"
                  : "text-sage hover:text-paper"
              }`}
            >
              <span className="block sm:inline">{label}</span>{" "}
              <span className="block text-[11px] text-sage sm:inline sm:text-xs">
                <span className="hidden sm:inline">· </span>
                {hint}
              </span>
            </button>
          ))}
        </div>

        {/* Visualizer + band indicator */}
        <div className="mt-5">
          <Visualizer
            beatFreq={visualBeat}
            carrierFreq={params.carrierFreq}
            playing={playing}
          />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-mono text-sm text-paper">
              {visualBeat.toFixed(1)} Hz
              <span className="text-sage"> · {band.name.toLowerCase()} range</span>
            </p>
            <Link
              href={`/frequency/${band.slug}`}
              className="text-sm text-gold hover:underline"
            >
              About {band.name.toLowerCase()} →
            </Link>
          </div>
        </div>

        <fieldset disabled={journeyRunning} className="transition-opacity">
          {/* Presets */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BEAT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePreset(preset.beatFreq)}
                aria-pressed={activePresetId === preset.id}
                className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  activePresetId === preset.id
                    ? "border-gold bg-gold font-medium text-ink"
                    : "border-paper/15 text-paper hover:border-gold/60"
                }`}
              >
                {preset.label}
                <span
                  className={`ml-1.5 font-mono text-xs ${
                    activePresetId === preset.id ? "text-ink/70" : "text-sage"
                  }`}
                >
                  {preset.beatFreq}Hz
                </span>
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="mt-6 space-y-5 rounded-xl border border-paper/10 bg-ink/60 p-4 sm:p-5">
            <div>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <label htmlFor="beat-freq" className="text-sage">
                  Beat frequency
                </label>
                <span className="font-mono text-gold">
                  {params.beatFreq.toFixed(1)} Hz
                </span>
              </div>
              <input
                id="beat-freq"
                type="range"
                min={BEAT_RANGE.min}
                max={BEAT_RANGE.max}
                step={BEAT_RANGE.step}
                value={params.beatFreq}
                onChange={(e) => getEngine().setBeatFreq(e.target.valueAsNumber)}
              />
            </div>

            <div>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <label htmlFor="carrier-freq" className="text-sage">
                  Carrier tone
                </label>
                <span className="font-mono text-paper">
                  {params.carrierFreq} Hz
                </span>
              </div>
              <input
                id="carrier-freq"
                type="range"
                min={CARRIER_RANGE.min}
                max={CARRIER_RANGE.max}
                step={CARRIER_RANGE.step}
                value={params.carrierFreq}
                onChange={(e) =>
                  getEngine().setCarrierFreq(e.target.valueAsNumber)
                }
              />
            </div>

            <div>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <label htmlFor="volume" className="text-sage">
                  {params.mode === "binaural" ? "Binaural volume" : "Tone volume"}
                </label>
                <span className="font-mono text-paper">
                  {Math.round((params.volume / VOLUME_RANGE.max) * 100)}%
                </span>
              </div>
              <input
                id="volume"
                type="range"
                min={VOLUME_RANGE.min}
                max={VOLUME_RANGE.max}
                step={VOLUME_RANGE.step}
                value={params.volume}
                onChange={(e) => getEngine().setVolume(e.target.valueAsNumber)}
              />
            </div>

            <div className="border-t border-paper/10 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="noise-type" className="text-sm text-sage">
                  Background noise
                </label>
                <select
                  id="noise-type"
                  value={params.noiseType}
                  onChange={(e) => handleNoiseType(e.target.value as NoiseType)}
                  className="rounded-md border border-paper/15 bg-ink px-2 py-1 text-xs text-paper focus:border-gold focus:outline-none"
                >
                  <option value="none">None</option>
                  <option value="white">White</option>
                  <option value="pink">Pink</option>
                  <option value="brown">Brown</option>
                </select>
              </div>
              <input
                aria-label="Noise volume"
                type="range"
                min={NOISE_RANGE.min}
                max={NOISE_RANGE.max}
                step={NOISE_RANGE.step}
                value={params.noiseVolume}
                onChange={(e) => handleNoiseVolume(e.target.valueAsNumber)}
              />
            </div>
          </div>
        </fieldset>

        {/* Transport */}
        <div className="sticky bottom-3 z-20 mt-6 rounded-xl bg-charcoal/95 shadow-lg backdrop-blur sm:static sm:bg-transparent sm:shadow-none">
          <button
            type="button"
            onClick={handlePlayStop}
            className={`min-h-12 w-full rounded-xl py-3.5 font-medium transition-colors ${
              playing
                ? "border border-paper/25 bg-charcoal text-paper hover:border-gold hover:text-gold"
                : "bg-gold text-ink hover:bg-gold/90"
            }`}
          >
            {paused
              ? journeyRunning
                ? "Resume journey"
                : "Resume"
              : journeyRunning
                ? "Stop journey"
                : playing
                  ? "Stop"
                  : "Play"}
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-sage">
          Binaural mode needs stereo headphones. Keep the volume low and
          comfortable.
        </p>
      </div>

      {/* Right: journeys + export */}
      <div className="space-y-6">
        <div className={cardClass}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl text-paper">Journeys</h2>
            {journeyRunning && journey && (
              <span className="font-mono text-xs text-gold">
                {formatTime(journeyElapsed)} / {formatTime(journey.duration)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-sage">
            Guided sessions that ramp the beat frequency over time. Settle in,
            and the Studio drives.
          </p>
          <div className="mt-4 space-y-3">
            <select
              aria-label="Select a journey"
              value={selectedJourneyId}
              onChange={(e) => setSelectedJourneyId(e.target.value)}
              disabled={journeyRunning}
              className={selectClass}
            >
              <option value="none">Select a journey…</option>
              {JOURNEYS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({Math.round(item.duration / 60)} min)
                </option>
              ))}
            </select>
            {journeyRunning && journey ? (
              <button
                type="button"
                onClick={() => void getEngine().stop()}
                className="w-full rounded-lg border border-paper/25 py-2.5 text-sm text-paper transition-colors hover:border-gold hover:text-gold"
              >
                Stop {journey.name}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleJourneyPlay}
                disabled={selectedJourneyId === "none"}
                className="w-full rounded-lg bg-gold py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Play journey
              </button>
            )}
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="font-display text-xl text-paper">Export to WAV</h2>
          <p className="mt-2 text-sm leading-relaxed text-sage">
            Prepare the current settings or selected journey as an audio file
            for offline listening.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="w-24">
              <label htmlFor="export-duration" className="sr-only">
                Duration in minutes
              </label>
              <input
                id="export-duration"
                type="number"
                min={1}
                max={MAX_EXPORT_MINUTES}
                value={
                  selectedJourneyId !== "none"
                    ? Math.round((getJourney(selectedJourneyId)?.duration ?? 0) / 60)
                    : exportMinutes
                }
                onChange={(e) => setExportMinutes(e.target.value)}
                disabled={selectedJourneyId !== "none" || exportBusy}
                className="w-full rounded-lg border border-paper/15 bg-ink px-3 py-2.5 text-center font-mono text-sm text-paper focus:border-gold focus:outline-none disabled:opacity-50"
              />
            </div>
            <span className="text-sm text-sage">min</span>
            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={exportBusy}
              className="min-h-11 flex-1 rounded-lg border border-paper/25 px-3 py-2.5 text-sm text-paper transition-colors hover:border-gold hover:text-gold disabled:cursor-wait disabled:opacity-50"
            >
              {exportBusy ? "Rendering..." : preparedExport ? "Prepare again" : "Prepare WAV"}
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-sage">
            WAV files use about 5 MB per minute. Rendering stays on this device.
          </p>
          {preparedExport && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <a
                href={preparedExport.url}
                download={preparedExport.filename}
                className="flex min-h-11 items-center justify-center rounded-lg bg-gold px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold/90"
              >
                Save WAV
              </a>
              {shareSupported && (
                <button
                  type="button"
                  onClick={() => void handleShare()}
                  className="min-h-11 rounded-lg border border-paper/25 px-3 py-2.5 text-sm text-paper transition-colors hover:border-gold hover:text-gold"
                >
                  Share file
                </button>
              )}
            </div>
          )}
          <p className="mt-2 min-h-4 text-xs text-sage" role="status">
            {exportStatus}
          </p>
        </div>
      </div>
    </div>
  );
}
