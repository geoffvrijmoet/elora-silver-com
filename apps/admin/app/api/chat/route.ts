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

  // Allow posting when idle, failed, or pending (adding more to the batch)
  const canPost = !chat || chat.status === 'idle' || chat.status === 'failed' || chat.status === 'pending';
  if (!canPost) {
    return NextResponse.json(
      { error: 'Changes are being processed. You can add more messages once the current cycle completes.' },
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

  // If already pending, just append — keep the existing activeMessageIndex
  const updateSet: Record<string, unknown> = {
    status: 'pending',
    updatedAt: now,
  };
  if (chat.status !== 'pending') {
    updateSet.activeMessageIndex = chat.messages.length;
  }

  await db.collection('chatState').updateOne(
    { _id: chat._id },
    {
      $set: updateSet,
      $push: { messages: newMessage } as any,
    }
  );

  const updated = await db.collection('chatState').findOne({ _id: chat._id });
  return NextResponse.json(updated);
}
