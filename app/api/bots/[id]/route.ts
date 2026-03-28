import { NextResponse } from 'next/server';
import { getBotById, saveBot, deleteBot, Bot } from '@/lib/db';
import { processKnowledgeBase } from '@/lib/rag';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bot = await getBotById(id);
  if (!bot) {
    return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
  }
  return NextResponse.json(bot);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const existingBot = await getBotById(id);
    if (!existingBot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    let chunks = existingBot.chunks;
    if (body.knowledge !== existingBot.knowledge) {
      chunks = await processKnowledgeBase(body.knowledge || '');
    }

    const updatedBot: Bot = {
      ...existingBot,
      ...body,
      id, // Ensure ID doesn't change
      chunks,
      user_id: body.user_id || existingBot.user_id,
    };
    await saveBot(updatedBot);
    return NextResponse.json(updatedBot);
  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.message?.includes('fetch failed')) {
      return NextResponse.json({ error: 'Network error. Please check your connection or ensure the API is reachable.' }, { status: 503 });
    }
    console.error('Error updating bot:', error);
    return NextResponse.json({ error: 'Failed to update bot' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteBot(id);
  return NextResponse.json({ success: true });
}
