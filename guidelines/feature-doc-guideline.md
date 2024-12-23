
# Project Overview
Use this guide to build a web app that advertises Elora Silver, a social worker and therapist.

# Feature Requirements
- The website should be password protected.
- The website should have a section called "Learn 'Shake Ya Ass' by Mystikal", where there will be a game that helps the user learn the lyrics to the song.
- The web app should have lightning-fast performance.
- The entire app should be extremely mobile-friendly.
- We will use Next.js, Shadcn, Lucid, Clerk, MongoDB, and Tailwind CSS to build the app.
- We will push the code to GitHub (my github account is geoffvrijmoet) via SSH, and the repository will be called "elora-silver-com".

# Relevant Docs
This is the reference documentation for Clerk: https://clerk.com/docs/references/nextjs/

# Current File Structure
ELORA-SILVER-COM/
├── app/
│   ├── fonts/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── guidelines/
│   └── feature-doc-guideline.md
├── lib/
│   └── utils.ts
├── node_modules/
├── .cursorrules
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

# Rules
- All new components should go in /components and be named like example-component.tsx unless otherwise specified.
- All new pages go in /app.
