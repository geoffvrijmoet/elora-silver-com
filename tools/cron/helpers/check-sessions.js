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
      // Also pick up failed sessions that have new unaddressed elora messages
      if (chat && chat.status === 'failed') {
        const addressedUpTo = chat.addressedUpTo || 0;
        const hasNewMessages = chat.messages.some((m, i) => i >= addressedUpTo && m.role === 'elora');
        if (hasNewMessages) {
          // Treat as pending — there are new messages to process
        } else {
          console.log(JSON.stringify({ action: 'none' }));
          return;
        }
      } else {
        console.log(JSON.stringify({ action: 'none' }));
        return;
      }
    }

    const id = chat._id.toString();

    // Only send messages from the active change cycle, not the full history
    const relevantMessages = chat.activeMessageIndex != null
      ? chat.messages.slice(chat.activeMessageIndex)
      : chat.messages;

    console.log(JSON.stringify({
      action: chat.status,
      id,
      totalMessageCount: chat.messages.length,
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
