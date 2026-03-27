import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI!);
    await cachedClient.connect();
  }
  return cachedClient.db('elora-silver');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const db = await getDb();
    const qr = await db.collection('qrCodes').findOne({ _id: new ObjectId(id) });

    if (!qr) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Log the scan
    const userAgent = req.headers.get('user-agent') || '';
    await db.collection('qrScans').insertOne({
      qrCodeId: new ObjectId(id),
      timestamp: new Date(),
      userAgent,
    });

    // Increment scan count
    await db.collection('qrCodes').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { scanCount: 1 } }
    );

    return NextResponse.redirect(qr.targetUrl);
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
