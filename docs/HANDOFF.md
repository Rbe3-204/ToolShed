# ToolShed Session Handoff

> Last updated: 2026-04-16

## Current State

The project is fully functional with 7 client-side developer tools. Build passes, all tools work, dark theme applied throughout.

### What's Built
- Next.js 14 App Router project with TypeScript + Tailwind CSS
- Tools registry system (single config file drives routing, search, and SEO)
- Homepage with Fuse.js fuzzy search, category grid, filter tabs
- Dynamic tool pages with SEO metadata and related tools sidebar
- Custom 404 page
- Dark theme with custom scrollbar and selection colors

### Tools (7 total)
| Tool | Slug | Category | Status |
|------|------|----------|--------|
| JSON Formatter | json-formatter | Developer | Done |
| Base64 Encoder/Decoder | base64-codec | Converters | Done |
| UUID Generator | uuid-generator | Generators | Done |
| Hash Generator | hash-generator | Developer | Done |
| Regex Tester | regex-tester | Text | Done |
| Lorem Ipsum Generator | lorem-ipsum | Generators | Done |
| Color Converter | color-converter | Design | Done |

### Category Coverage
- Text: 1 tool (Regex Tester)
- Developer: 2 tools (JSON Formatter, Hash Generator)
- Converters: 1 tool (Base64 Codec)
- Generators: 2 tools (UUID Generator, Lorem Ipsum)
- Design: 1 tool (Color Converter)

## How to Add a New Tool

1. Create `src/tools/[slug]/index.tsx` with `"use client"` directive
2. Import and add entry to `tools` array in `src/lib/registry.ts`
3. That's it. Routing, search, SEO, and related tools all work automatically.

## Key Files to Know

- `src/lib/registry.ts` - The single source of truth for all tools
- `src/lib/categories.ts` - Category definitions (emoji, color, description)
- `src/app/tools/[slug]/page.tsx` - Dynamic route that renders tool components
- `src/components/tool-list.tsx` - Homepage search and filtering logic
- `tailwind.config.ts` - Must include `src/tools/**` in content paths

## Architecture Decisions

1. **No React.lazy/dynamic** - Static generation handles code-splitting per page
2. **No UI libraries** - Pure Tailwind CSS
3. **No external deps beyond fuse.js** - All tools use native browser APIs
4. **Narrow client boundary** - Only interactive pieces are client components
5. **Keywords in registry** - Enables Fuse.js to match "prettify" -> JSON Formatter

## Git History

- `6377281` - Initial commit: ToolShed with 3 tools
- (pending) - Add 4 new tools, UI polish, docs

## Not Yet Done

- Vercel deployment
- GitHub repo remote
- More tools for underrepresented categories (Text, Converters, Design)
- Light/dark mode toggle
- Favicon customization
- Tool usage analytics
- OpenGraph images for social sharing

## Dev Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

## Dependencies

- `next@14.2.35` - Framework
- `react@18` / `react-dom@18` - UI
- `fuse.js@7.3.0` - Fuzzy search
- `tailwindcss@3.4.1` - Styling
- `typescript@5` - Type safety
