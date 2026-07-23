"use client";

import { useEffect, useRef } from "react";

const GOLD = "#B99457";
const SAGE = "#8A9186";

interface VisualizerProps {
  beatFreq: number;
  carrierFreq: number;
  playing: boolean;
}

interface WaveState {
  beat: number;
  carrier: number;
}

/**
 * Draws the beat waveform (carrier inside a cosine envelope at the beat
 * rate). Per the brand motion rules there is no idle animation: the canvas
 * is static and only morphs briefly when a parameter actually changes.
 * Gold stroke = audio is live; sage = idle. Honors prefers-reduced-motion.
 */
export default function Visualizer({ beatFreq, carrierFreq, playing }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<WaveState>({ beat: beatFreq, carrier: carrierFreq });
  const playingRef = useRef(playing);
  const rafRef = useRef(0);

  useEffect(() => {
    playingRef.current = playing;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = (wave: WaveState) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const visualCarrier =
        30 + ((Math.min(Math.max(wave.carrier, 60), 600) - 60) / 540) * 60;
      const midY = h / 2;
      const amplitude = h * 0.38;

      ctx.strokeStyle = playingRef.current ? GOLD : SAGE;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x++) {
        const t = x / w;
        const y =
          midY -
          amplitude *
            Math.cos(Math.PI * wave.beat * t) *
            Math.sin(2 * Math.PI * visualCarrier * t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const target: WaveState = { beat: beatFreq, carrier: carrierFreq };
    const start: WaveState = { ...waveRef.current };
    const changed =
      Math.abs(start.beat - target.beat) > 0.001 ||
      Math.abs(start.carrier - target.carrier) > 0.001;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    cancelAnimationFrame(rafRef.current);

    if (!changed || reducedMotion) {
      waveRef.current = target;
      draw(target);
    } else {
      // Short morph between the old and new parameter shape, then stop.
      const durationMs = 450;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / durationMs);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const current: WaveState = {
          beat: start.beat + (target.beat - start.beat) * eased,
          carrier: start.carrier + (target.carrier - start.carrier) * eased,
        };
        waveRef.current = current;
        draw(current);
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    const onResize = () => draw(waveRef.current);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [beatFreq, carrierFreq, playing]);

  return (
    <canvas
      ref={canvasRef}
      className="h-20 w-full rounded-xl border border-paper/10 bg-ink sm:h-28"
      aria-label="Waveform of the current beat settings"
    />
  );
}
