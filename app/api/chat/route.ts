import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getBotById } from '@/lib/db';
import { generateEmbedding, retrieveTopK } from '@/lib/rag';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { botId, message, history } = await request.json();

    if (!botId || !message) {
      return NextResponse.json({ error: 'Missing botId or message' }, { status: 400 });
    }

    const bot = await getBotById(botId);
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    // RAG: Retrieve relevant context
    let contextText = '';
    if (bot.chunks && bot.chunks.length > 0) {
      const queryEmbedding = await generateEmbedding(message);
      const topChunks = retrieveTopK(queryEmbedding, bot.chunks, 3);
      contextText = topChunks.join('\n\n');
    } else {
      contextText = bot.knowledge; // Fallback to full knowledge if no chunks
    }

    const systemInstruction = `
      ${bot.systemPrompt}
      
      Your tone should be: ${bot.tone}.
      Your response style should be: ${bot.responseStyle}.
      
      Here is the retrieved context from your personal knowledge base to draw from when answering the user's question:
      ---
      ${contextText}
      ---
      
      If the user asks something outside of your knowledge base, answer based on your persona, but prioritize the provided context.
    `;

    let contextMessage = message;
    if (history && history.length > 0) {
        const historyText = history.map((msg: any) => `${msg.role === 'user' ? 'User' : 'You'}: ${msg.content}`).join('\n');
        contextMessage = `Previous conversation:\n${historyText}\n\nCurrent User Message: ${message}`;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    try {
      if (!apiKey) throw new Error('Missing Gemini API Key');
      const ai = new GoogleGenAI({ apiKey });

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseStream = await chat.sendMessageStream({ message: contextMessage });

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of responseStream) {
              const text = chunk.text;
              if (text) {
                controller.enqueue(new TextEncoder().encode(text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    } catch (geminiError: any) {
      if (!geminiError.message?.toLowerCase().includes('fetch failed') && !geminiError.message?.includes('Failed to fetch')) {
        console.warn('Gemini failed, falling back to Zhipu AI (z.ai)...', geminiError);
      }
      
      // Fallback to Zhipu AI (GLM)
      const openai = new OpenAI({
        apiKey: process.env.ZHIPU_API_KEY || '7c4f941575bd4557a34d7c75d72524b2.PBl88oe6EOOJbFR8',
        baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
      });

      const messages = [
        { role: 'system', content: systemInstruction },
        ...history.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const responseStream = await openai.chat.completions.create({
        model: 'glm-4-flash',
        messages: messages as any,
        stream: true,
        temperature: 0.7,
      });

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of responseStream) {
              const text = chunk.choices[0]?.delta?.content || '';
              if (text) {
                controller.enqueue(new TextEncoder().encode(text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    }

  } catch (error: any) {
    if (!error.message?.toLowerCase().includes('fetch failed') && !error.message?.includes('Failed to fetch')) {
      console.error('Chat API Error:', error);
    }
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
