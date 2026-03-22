import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
  }

  const db = await getDb();
  const session = await db
    .collection('changeSessions')
    .findOne({ _id: new ObjectId(id) });

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(session);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
  }

  const { action, message } = await req.json();

  const db = await getDb();
  const session = await db
    .collection('changeSessions')
    .findOne({ _id: new ObjectId(id) });

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const now = new Date();

  if (action === 'approve') {
    if (session.status !== 'preview_ready') {
      return NextResponse.json(
        { error: 'Can only approve sessions with preview_ready status' },
        { status: 400 }
      );
    }

    await db.collection('changeSessions').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { status: 'approved', updatedAt: now },
        $push: {
          messages: {
            role: 'system',
            content: 'Changes approved by Elora.',
            createdAt: now,
          },
        } as any,
      }
    );
  } else if (action === 'feedback') {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Feedback message is required' }, { status: 400 });
    }

    if (session.status !== 'preview_ready') {
      return NextResponse.json(
        { error: 'Can only send feedback on sessions with preview_ready status' },
        { status: 400 }
      );
    }

    await db.collection('changeSessions').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { status: 'feedback_pending', updatedAt: now },
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

  const updated = await db
    .collection('changeSessions')
    .findOne({ _id: new ObjectId(id) });

  return NextResponse.json(updated);
}
