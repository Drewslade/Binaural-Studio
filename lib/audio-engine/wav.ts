/** Encode an AudioBuffer as a 16-bit PCM WAV blob. */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;

  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  const interleaved = new Int16Array(buffer.length * numChannels);
  let offset = 0;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = Math.max(-1, Math.min(1, channels[ch][i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      interleaved[offset++] = sample;
    }
  }

  const dataSize = numChannels * buffer.length * (bitDepth / 8);
  const header = createWavHeader(numChannels, sampleRate, buffer.length);
  const arrayBuffer = new ArrayBuffer(dataSize);
  const view = new DataView(arrayBuffer);
  for (let i = 0; i < interleaved.length; i++) {
    view.setInt16(i * 2, interleaved[i], true);
  }

  return new Blob([header, view], { type: "audio/wav" });
}

/** Create a 44-byte header for a stereo or mono 16-bit PCM WAV file. */
export function createWavHeader(
  numChannels: number,
  sampleRate: number,
  frameCount: number
): ArrayBuffer {
  const format = 1;
  const bitDepth = 16;
  const dataSize = numChannels * frameCount * (bitDepth / 8);
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);
  return header;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
