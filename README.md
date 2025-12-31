# Next.js + Tailwind CSS + TypeScript Starter

<div align="center">
  <h2>🔋 tah_next_templete</h2>
  <p>Next.js + Tailwind CSS + TypeScript starter packed with useful development features.</p>

</div>

## Features

This repository is 🔋 battery packed with:

- ⚡️ Next.js 16 with App Router
- ⚛️ React 19
- ✨ TypeScript
- 💨 Tailwind CSS 4 — Configured with CSS Variables to extend the **primary** color
- 💎 Pre-built Components — Components that will **automatically adapt** with your brand color
- 🃏 Jest — Configured for unit testing
- 📈 Absolute Import and Path Alias — Import components using `@/` prefix
- 📏 ESLint — Find and fix problems in your code, also will **auto sort** your imports
- 💖 Prettier — Format your code consistently
- 🐶 Husky & Lint Staged — Run scripts on your staged files before they are committed
- 🤖 Conventional Commit Lint — Make sure you & your teammates follow conventional commit
- ⏰ Release Please — Generate your changelog by activating the `release-please` workflow
- 👷 Github Actions — Lint your code on PR
- 🚘 Automatic Branch and Issue Autolink — Branch will be automatically created on issue **assign**, and auto linked on PR
- 🔥 Snippets — A collection of useful snippets
- 👀 Open Graph Helper Function — Generate open graph images for your pages
- 🗺 Site Map — Automatically generate sitemap.xml
- 📦 Type-safe Environment Variables — Using Zod for validation

See the 👉 [CHANGELOG.md](./CHANGELOG.md) 👈 for more details.

## Getting Started

### 1. Clone this repository

   ```bash
   git clone https://github.com/Tah5721312/tah_next_templete.git
   cd tah_next_templete
   ```

### 2. Install dependencies

It is encouraged to use **pnpm** so the husky hooks can work properly.

```bash
pnpm install
```

### 3. Run the development server

You can start the server using this command:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/app/page.tsx`.

### 4. Configure your project

There are some things you need to change including title, urls, favicons, etc.

Find all comments with !STARTERCONF, then follow the guide.

Don't forget to change the package name in package.json

### 5. Commit Message Convention

This starter is using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), it is mandatory to use it to commit changes.

## Project Structure

```
tah_next_templete/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── lib/          # Utility functions and helpers
│   ├── constant/     # Configuration and constants
│   └── styles/       # Global styles
├── public/           # Static assets
└── ...
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React, React Icons
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint + Prettier
- **Git Hooks:** Husky + Lint Staged

## License

This project is private and proprietary.
