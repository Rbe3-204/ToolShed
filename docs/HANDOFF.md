# ToolShed Session Handoff

> Last updated: 2026-04-16

## Current State

The project is fully functional with 11 client-side developer tools. Build passes, all tools work, dark theme, monetization placeholders in place.

### What's Built
- Next.js 14 App Router project with TypeScript + Tailwind CSS
- Tools registry system (single config file drives routing, search, and SEO)
- Homepage with Fuse.js fuzzy search, category grid, filter tabs
- Dynamic tool pages with SEO metadata and related tools sidebar
- Custom 404 page
- Dark theme with custom scrollbar and selection colors
- Carbon Ads placeholder in tool page sidebar
- Donation link in footer (Buy Me a Coffee)
- Tool count badge in header
- Hover animations on tool cards

### Tools (11 total)
| Tool | Slug | Category | Status |
|------|------|----------|--------|
| JSON Formatter | json-formatter | Developer | Done |
| Base64 Encoder/Decoder | base64-codec | Converters | Done |
| UUID Generator | uuid-generator | Generators | Done |
| Hash Generator | hash-generator | Developer | Done |
| Regex Tester | regex-tester | Text | Done |
| Lorem Ipsum Generator | lorem-ipsum | Generators | Done |
| Color Converter | color-converter | Design | Done |
| Markdown Preview | markdown-preview | Text | Done |
| JWT Decoder | jwt-decoder | Developer | Done |
| Timestamp Converter | timestamp-converter | Converters | Done |
| CSS Minifier | css-minifier | Developer | Done |

### Category Coverage
- Text: 2 tools (Regex Tester, Markdown Preview)
- Developer: 4 tools (JSON Formatter, Hash Generator, JWT Decoder, CSS Minifier)
- Converters: 2 tools (Base64 Codec, Timestamp Converter)
- Generators: 2 tools (UUID Generator, Lorem Ipsum)
- Design: 1 tool (Color Converter)

## Monetization

### Carbon Ads (placeholder)
- Component: `src/components/carbon-ad.tsx`
- Placed in tool page sidebar below Related Tools
- Currently shows placeholder -- needs Carbon Ads account signup
- To activate: set `CARBON_SERVE_ID` and `CARBON_PLACEMENT_ID` in the component

### Donation Link
- "Support this project" link in footer
- Points to `https://buymeacoffee.com/toolshed` (update URL when account created)

## How to Add a New Tool

1. Create `src/tools/[slug]/index.tsx` with `"use client"` directive
2. Import and add entry to `tools` array in `src/lib/registry.ts`
3. That's it. Routing, search, SEO, and related tools all work automatically.

## Key Files to Know

- `src/lib/registry.ts` - The single source of truth for all tools
- `src/lib/categories.ts` - Category definitions (emoji, color, description)
- `src/app/tools/[slug]/page.tsx` - Dynamic route that renders tool components
- `src/components/tool-list.tsx` - Homepage search and filtering logic
- `src/components/carbon-ad.tsx` - Carbon Ads integration (placeholder)
- `src/components/site-footer.tsx` - Footer with donation link
- `tailwind.config.ts` - Must include `src/tools/**` in content paths

## Architecture Decisions

1. **No React.lazy/dynamic** - Static generation handles code-splitting per page
2. **No UI libraries** - Pure Tailwind CSS
3. **No external deps beyond fuse.js** - All tools use native browser APIs
4. **Narrow client boundary** - Only interactive pieces are client components
5. **Keywords in registry** - Enables Fuse.js to match "prettify" -> JSON Formatter
6. **No markdown library** - Custom regex-based converter for Markdown Preview
7. **Web Crypto API** - Used for Hash Generator (SHA-1/256/512)
8. **Monetization non-intrusive** - Ads only in sidebar, donation link subtle in footer

## Git History

- `6377281` - Initial commit: ToolShed with 3 tools
- `f4ac575` - Add 4 new tools, custom 404, UI polish, and docs
- (pending) - Add 4 more tools, monetization, UI enhancements

## Not Yet Done

- Vercel deployment + GitHub remote
- Carbon Ads account signup and activation
- Buy Me a Coffee account setup
- Light/dark mode toggle
- More tools for Design category
- Favicon customization
- OpenGraph images for social sharing
- Tool usage analytics

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
