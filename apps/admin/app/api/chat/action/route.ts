import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, message } = await req.json();
  const db = await getDb();
  const chat = await db.collection('chatState').findOne({});

  if (!chat) {
    return NextResponse.json({ error: 'No chat found' }, { status: 404 });
  }

  const now = new Date();

  if (action === 'approve') {
    if (chat.status !== 'preview_ready') {
      return NextResponse.json(
        { error: 'Can only approve when preview is ready' },
        { status: 400 }
      );
    }

    await db.collection('chatState').updateOne(
      { _id: chat._id },
      {
        $set: { status: 'approved', updatedAt: now },
        $push: {
          messages: {
            role: 'system',
            content: 'Changes approved.',
            createdAt: now,
          },
        } as any,
      }
    );
  } else if (action === 'feedback') {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Feedback message is required' }, { status: 400 });
    }

    if (chat.status !== 'preview_ready') {
      return NextResponse.json(
        { error: 'Can only send feedback when preview is ready' },
        { status: 400 }
      );
    }

    await db.collection('chatState').updateOne(
      { _id: chat._id },
      {
        $set: {
          status: 'pending',
          activeMessageIndex: chat.messages.length,
          updatedAt: now,
        },
        $push: {
          messages: {
            role: 'elora',
            content: message.trim(),
            createdAt: now,
          },
        } as any,
      }
    );
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const updated = await db.collection('chatState').findOne({ _id: chat._id });
  return NextResponse.json(updated);
}
