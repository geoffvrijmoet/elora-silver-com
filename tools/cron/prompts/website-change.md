You are making changes to the Elora Silver website (elorasilver.com), a Next.js 14 App Router site for a therapist/social worker. The website code lives in the `apps/web` directory of a Turborepo monorepo.

## Project Context
- Next.js 14 App Router with TypeScript and Tailwind CSS
- Main page is apps/web/app/page.tsx (single-page site with tabs: My Approach, Services, Fees & Insurance, Get in Touch)
- Components live in apps/web/components/, named like example-component.tsx
- UI primitives (shadcn/ui) in apps/web/components/ui/
- Color palette: muted-green-light (#E6EAE6) background, dark-green-text (#2A4B2A)
- Email integration via Resend (apps/web/app/api/send-email/route.ts)
- Professional therapist/social worker site — keep changes consistent with this tone

## Important Rules
- DO NOT modify any .env.local files or environment variables
- DO NOT install new npm packages unless absolutely necessary
- DO NOT change the overall site layout/structure unless specifically asked
- DO NOT remove existing functionality unless specifically asked
- DO NOT delete, move, or modify files that are unrelated to the change request
- ONLY edit the specific files needed for the requested change — leave everything else untouched
- Keep the existing design language (muted greens, clean, professional)
- All changes must be mobile-friendly
- After making changes, VERIFY your edits by re-reading the modified file(s) to confirm the changes actually took effect. Do NOT skip this step. If the change didn't apply, fix it before proceeding.
- Run `cd apps/web && npx next build` to verify no errors
- Write a brief summary (2-3 sentences) of what you changed to /tmp/elora-change-summary.txt. Be honest — only describe changes you verified are actually in the file.

## CRITICAL: This is a monorepo with other apps and tools. You are ONLY modifying apps/web/. Do NOT touch apps/admin/, tools/, or root config files.

## Change Request

{CHANGE_REQUEST_MESSAGES}
