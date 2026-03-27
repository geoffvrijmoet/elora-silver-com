#!/usr/bin/env node
// Waits for a Vercel deployment to be ready for a given git commit SHA.
// Usage: node wait-for-deploy.js <commit-sha> <project-id> [--timeout 300]
//
// Polls the Vercel API every 10 seconds until the deployment for the
// given commit is READY. Exits 0 on success, 1 on timeout.

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
if (!VERCEL_TOKEN) {
  console.error('VERCEL_TOKEN not set');
  process.exit(1);
}

const commitSha = process.argv[2];
const projectId = process.argv[3];
let timeout = 300; // default 5 minutes

for (let i = 4; i < process.argv.length; i += 2) {
  if (process.argv[i] === '--timeout') timeout = parseInt(process.argv[i + 1], 10);
}

if (!commitSha || !projectId) {
  console.error('Usage: wait-for-deploy.js <commit-sha> <project-id> [--timeout 300]');
  process.exit(1);
}

async function main() {
  const startTime = Date.now();
  const timeoutMs = timeout * 1000;

  while (Date.now() - startTime < timeoutMs) {
    try {
      const res = await fetch(
        `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=5`,
        { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
      );

      if (res.ok) {
        const data = await res.json();
        const deployment = data.deployments?.find(d =>
          d.meta?.githubCommitSha === commitSha ||
          d.meta?.gitCommitSha === commitSha
        );

        if (deployment) {
          if (deployment.state === 'READY') {
            console.log(`Deployment ready: ${deployment.url}`);
            process.exit(0);
          }
          if (deployment.state === 'ERROR' || deployment.state === 'CANCELED') {
            console.error(`Deployment ${deployment.state}: ${deployment.url}`);
            process.exit(1);
          }
          // Still building — keep waiting
        }
      }
    } catch (err) {
      // Network error — keep trying
    }

    await new Promise(r => setTimeout(r, 10000));
  }

  console.error('Timeout waiting for deployment');
  process.exit(1);
}

main();
