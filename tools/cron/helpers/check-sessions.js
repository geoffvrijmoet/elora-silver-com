#!/usr/bin/env node
// Checks MongoDB chatState for actionable work.
// Outputs JSON to stdout: { action, id, messages } or { action: "none" }

const { MongoClient } = require('mongodb');

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

    const chat = await db.collection('chatState').findOne({});

    if (!chat || !['pending', 'approved'].includes(chat.status)) {
      console.log(JSON.stringify({ action: 'none' }));
      return;
    }

    const id = chat._id.toString();

    // Only send messages from the active change cycle, not the full history
    const relevantMessages = chat.activeMessageIndex != null
      ? chat.messages.slice(chat.activeMessageIndex)
      : chat.messages;

    console.log(JSON.stringify({
      action: chat.status,
      id,
      messages: relevantMessages.map(m => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
      changeSummary: chat.changeSummary || null,
    }));
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
