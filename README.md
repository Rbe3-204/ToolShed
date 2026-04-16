# ToolShed

Free, open-source developer utilities. 100% client-side — nothing leaves your browser.

## Tools (11)

| Tool | Category | Description |
|------|----------|-------------|
| JSON Formatter | Developer | Prettify, minify, and validate JSON |
| Hash Generator | Developer | SHA-1, SHA-256, SHA-512 hashing |
| JWT Decoder | Developer | Decode JWT header, payload, and signature |
| CSS Minifier | Developer | Minify and beautify CSS with size stats |
| Regex Tester | Text | Live regex matching with flags and capture groups |
| Markdown Preview | Text | Live Markdown to HTML preview |
| Base64 Encoder/Decoder | Converters | Encode/decode Base64 for text and files |
| Timestamp Converter | Converters | Convert between Unix timestamps and dates |
| UUID Generator | Generators | Generate UUID v4, bulk up to 50, copy all |
| Lorem Ipsum Generator | Generators | Generate placeholder text |
| Color Converter | Design | Convert between HEX, RGB, and HSL |

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Fuse.js** (search)

No backend. No API calls. No auth. Every tool runs entirely in your browser.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a New Tool

1. Create `src/tools/[slug]/index.tsx` with `"use client"`
2. Add one entry to `src/lib/registry.ts`

That's it. Routing, search, SEO, and related tools work automatically.

## Project Structure

```
src/
  app/          # Pages and layouts
  components/   # Shared UI components
  lib/          # Registry and categories
  tools/        # Tool components (one folder each)
  types/        # TypeScript types
docs/           # Architecture and handoff docs
```

## License

MIT
