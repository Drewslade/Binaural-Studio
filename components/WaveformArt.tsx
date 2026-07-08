/**
 * Abstract line art derived from the actual oscillator math: the sum of two
 * sines at f and f+Δ equals a carrier at the average frequency inside a
 * cosine envelope at the beat rate — exactly what a binaural beat is.
 * Rendered server-side as a deterministic SVG, so it's identity art, not
 * decoration; each band page draws its own beat rate.
 */

interface WaveformArtProps {
  /** Beat (envelope) frequency in Hz over a one-second window. */
  beatFreq: number;
  /** Real carrier Hz — mapped to a readable visual density. */
  carrierFreq?: number;
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

export default function WaveformArt({
  beatFreq,
  carrierFreq = 220,
  width = 720,
  height = 120,
  stroke = "#B99457",
  strokeWidth = 1.5,
  className,
}: WaveformArtProps) {
  // Map the audible carrier (60–600 Hz) onto 30–90 visual cycles so the
  // texture stays legible at any real frequency.
  const visualCarrier = 30 + ((Math.min(Math.max(carrierFreq, 60), 600) - 60) / 540) * 60;
  const samples = Math.min(2000, width * 2);
  const midY = height / 2;
  const amplitude = height * 0.38;

  const points: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples; // one second of signal
    const envelope = Math.cos(Math.PI * beatFreq * t);
    const carrier = Math.sin(2 * Math.PI * visualCarrier * t);
    const y = midY - amplitude * envelope * carrier;
    const x = t * width;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label={`Waveform of a ${beatFreq} Hz beat`}
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
