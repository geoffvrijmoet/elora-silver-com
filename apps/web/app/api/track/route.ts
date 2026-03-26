import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI!);
    await cachedClient.connect();
  }
  return cachedClient.db('elora-silver');
}

function parseDevice(width: number): string {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function parseBrowser(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

export async function POST(req: NextRequest) {
  try {
    const { path, referrer, sessionId, screenWidth } = await req.json();

    if (!path || !sessionId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const userAgent = req.headers.get('user-agent') || '';

    const db = await getDb();
    await db.collection('pageViews').insertOne({
      path,
      referrer: referrer || '',
      sessionId,
      device: parseDevice(screenWidth || 0),
      browser: parseBrowser(userAgent),
      timestamp: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}
