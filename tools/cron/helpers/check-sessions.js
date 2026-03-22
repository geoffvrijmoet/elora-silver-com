#!/usr/bin/env node
// Checks MongoDB for actionable change sessions.
// Outputs JSON to stdout: { action, id, branch, messages } or { action: "none" }

const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('elora-silver');

    const session = await db.collection('changeSessions').findOne(
      { status: { $in: ['pending', 'feedback_pending', 'approved'] } },
      { sort: { updatedAt: 1 } }
    );

    if (!session) {
      console.log(JSON.stringify({ action: 'none' }));
      return;
    }

    const id = session._id.toString();
    const shortId = id.slice(-8);

    console.log(JSON.stringify({
      action: session.status,
      id,
      branch: session.previewBranch || `change/${shortId}`,
      messages: session.messages.map(m => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
      changeSummary: session.changeSummary || null,
    }));
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
