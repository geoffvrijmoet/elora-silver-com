import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDb();
  const chat = await db.collection('chatState').findOne({});

  if (!chat) {
    return NextResponse.json({ status: 'idle', messages: [] });
  }

  return NextResponse.json(chat);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { message } = await req.json();

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();
  const chat = await db.collection('chatState').findOne({});

  if (chat && chat.status !== 'idle' && chat.status !== 'failed') {
    return NextResponse.json(
      { error: 'A change is already in progress. Please wait for it to complete.' },
      { status: 409 }
    );
  }

  const newMessage = {
    role: 'elora' as const,
    content: message.trim(),
    createdAt: now,
  };

  if (!chat) {
    const result = await db.collection('chatState').insertOne({
      status: 'pending',
      messages: [newMessage],
      activeMessageIndex: 0,
      updatedAt: now,
    });
    const created = await db.collection('chatState').findOne({ _id: result.insertedId });
    return NextResponse.json(created, { status: 201 });
  }

  await db.collection('chatState').updateOne(
    { _id: chat._id },
    {
      $set: {
        status: 'pending',
        activeMessageIndex: chat.messages.length,
        updatedAt: now,
      },
      $push: { messages: newMessage } as any,
    }
  );

  const updated = await db.collection('chatState').findOne({ _id: chat._id });
  return NextResponse.json(updated);
}
