import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDb();
  const sessions = await db
    .collection('changeSessions')
    .find({})
    .sort({ updatedAt: -1 })
    .toArray();

  return NextResponse.json(sessions);
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

  const session = {
    status: 'pending',
    messages: [
      {
        role: 'elora' as const,
        content: message.trim(),
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection('changeSessions').insertOne(session);

  return NextResponse.json({ _id: result.insertedId, ...session }, { status: 201 });
}
