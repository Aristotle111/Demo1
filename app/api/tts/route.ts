import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import * as sherpa_onnx from 'sherpa-onnx-node';

export const runtime = 'nodejs';

const ttsInstances: Record<string, any> = {};

function getTtsInstance(lang: string) {
  if (ttsInstances[lang]) {
    return ttsInstances[lang];
  }

  const isFrench = lang === 'fr-FR';
  const folderName = isFrench ? 'fr_FR' : 'en_US';
  const modelFileName = isFrench ? 'fr_FR-siwis-medium.onnx' : 'en_US-lessac-medium.onnx';

  const modelDir = path.join(process.cwd(), 'models', folderName);
  const modelPath = path.join(modelDir, modelFileName);
  const tokensPath = path.join(modelDir, 'tokens.txt');
  const dataDir = path.join(modelDir, 'espeak-ng-data');

  if (!fs.existsSync(modelPath)) {
    throw new Error(`TTS ONNX model file not found at: ${modelPath}`);
  }
  if (!fs.existsSync(tokensPath)) {
    throw new Error(`TTS tokens file not found at: ${tokensPath}`);
  }

  const config = {
    model: {
      vits: {
        model: modelPath,
        tokens: tokensPath,
        dataDir: dataDir,
        lexicon: '',
      },
      numThreads: 2,
      debug: 0,
      provider: 'cpu',
    },
    maxNumSentences: 1,
  };

  const OfflineTtsClass = 
    (sherpa_onnx as any).OfflineTts || 
    (sherpa_onnx as any).default?.OfflineTts;

    if (!OfflineTtsClass) {
    throw new Error("Failed to load OfflineTts constructor from sherpa-onnx-node");
    }

  const tts = new OfflineTtsClass(config);
  ttsInstances[lang] = tts;
  return tts;
}

function createWavBuffer(samples: Float32Array, sampleRate: number): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // WAV Header construction
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write PCM audio data
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7FFF, offset);
  }

  return buffer;
}

export async function POST(request: Request) {
  try {
    const { text, lang } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const tts = getTtsInstance(lang);

    const audio = tts.generate({
      text: text,
      sid: 0,
      speed: 1.0,
    });

    if (!audio || !audio.samples || audio.samples.length === 0) {
      return NextResponse.json({ error: 'Failed to synthesize speech sample' }, { status: 500 });
    }

    const wavBuffer = createWavBuffer(audio.samples, audio.sampleRate);

    return new NextResponse(new Uint8Array(wavBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': wavBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('[TTS API ERROR]:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}