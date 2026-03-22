#!/usr/bin/env node
// Updates a change session in MongoDB.
// Usage: node update-session.js <id> <status> [--preview-url URL] [--branch NAME] [--summary TEXT] [--system-message TEXT]

const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { id: args[0], status: args[1] };

  for (let i = 2; i < args.length; i += 2) {
    switch (args[i]) {
      case '--preview-url': result.previewUrl = args[i + 1]; break;
      case '--branch': result.branch = args[i + 1]; break;
      case '--summary': result.summary = args[i + 1]; break;
      case '--system-message': result.systemMessage = args[i + 1]; break;
    }
  }
  return result;
}

async function main() {
  const opts = parseArgs();
  if (!opts.id || !opts.status) {
    console.error('Usage: update-session.js <id> <status> [options]');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('elora-silver');

    const update = {
      $set: {
        status: opts.status,
        updatedAt: new Date(),
      },
    };

    if (opts.previewUrl) update.$set.previewUrl = opts.previewUrl;
    if (opts.branch) update.$set.previewBranch = opts.branch;
    if (opts.summary) update.$set.changeSummary = opts.summary;

    if (opts.systemMessage) {
      update.$push = {
        messages: {
          role: 'system',
          content: opts.systemMessage,
          createdAt: new Date(),
        },
      };
    }

    await db.collection('changeSessions').updateOne(
      { _id: new ObjectId(opts.id) },
      update
    );

    console.log('OK');
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
