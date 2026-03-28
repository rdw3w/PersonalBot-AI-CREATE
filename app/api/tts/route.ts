import { NextResponse } from 'next/server';

const API_KEY = "sk_10s4l0xt_PhnDThIdNObQuDWz1ADTwvHN";
const API_URL = "https://api.sarvam.ai/text-to-speech/stream";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "api-subscription-key": API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text,
            target_language_code: "hi-IN", // The user snippet uses hi-IN
            speaker: "shruti",
            model: "bulbul:v3",
            pace: 1.1,
            speech_sample_rate: 22050,
            output_audio_codec: "mp3",
            enable_preprocessing: true
        })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sarvam API error:', response.status, errorText);
      return NextResponse.json({ error: `Sarvam API error: ${response.status}` }, { status: response.status });
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked'
      }
    });

  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.message?.includes('fetch failed')) {
      return NextResponse.json({ error: 'Network error. Please check your connection or ensure the TTS service is reachable.' }, { status: 503 });
    }
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}
