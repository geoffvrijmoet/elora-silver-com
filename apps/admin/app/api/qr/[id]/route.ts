import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import QRCode from 'qrcode';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const { bgColor } = await req.json();
  const db = await getDb();
  const qr = await db.collection('qrCodes').findOne({ _id: new ObjectId(id) });

  if (!qr) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isTransparent = !bgColor || bgColor === 'transparent';
  const colorConfig = {
    dark: '#000000',
    light: isTransparent ? '#00000000' : bgColor,
  };

  const svg = await QRCode.toString(qr.redirectUrl, {
    type: 'svg',
    margin: 1,
    color: colorConfig,
  });

  const dataUrl = await QRCode.toDataURL(qr.redirectUrl, {
    margin: 1,
    width: 512,
    color: colorConfig,
  });

  await db.collection('qrCodes').updateOne(
    { _id: new ObjectId(id) },
    { $set: { bgColor: bgColor || 'transparent', svg, dataUrl } }
  );

  const updated = await db.collection('qrCodes').findOne({ _id: new ObjectId(id) });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const db = await getDb();
  await db.collection('qrCodes').deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
