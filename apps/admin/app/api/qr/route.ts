import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import QRCode from 'qrcode';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDb();
  const codes = await db.collection('qrCodes')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(codes);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, targetUrl, bgColor } = await req.json();

  if (!name || !targetUrl) {
    return NextResponse.json({ error: 'Name and target URL are required' }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();

  const doc = {
    name: name.trim(),
    targetUrl: targetUrl.trim(),
    bgColor: bgColor || 'transparent',
    scanCount: 0,
    createdAt: now,
  };

  const result = await db.collection('qrCodes').insertOne(doc);
  const id = result.insertedId.toString();

  // Generate QR code SVG pointing to the redirect URL
  const redirectUrl = `https://elorasilver.com/r/${id}`;
  const isTransparent = !bgColor || bgColor === 'transparent';

  const svg = await QRCode.toString(redirectUrl, {
    type: 'svg',
    margin: 1,
    color: {
      dark: '#000000',
      light: isTransparent ? '#00000000' : bgColor,
    },
  });

  // Also generate as data URL for easy display
  const dataUrl = await QRCode.toDataURL(redirectUrl, {
    margin: 1,
    width: 512,
    color: {
      dark: '#000000',
      light: isTransparent ? '#00000000' : bgColor,
    },
  });

  await db.collection('qrCodes').updateOne(
    { _id: result.insertedId },
    { $set: { svg, dataUrl, redirectUrl } }
  );

  const created = await db.collection('qrCodes').findOne({ _id: result.insertedId });
  return NextResponse.json(created, { status: 201 });
}
