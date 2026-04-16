# ToolShed Architecture

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (no UI libraries)
- **Search**: Fuse.js (fuzzy search on homepage)
- **Hosting**: Vercel (planned)
- **Runtime**: 100% client-side. No backend, no API calls, no auth.

## Data Model

### ToolCategory
Union type: `"Text" | "Developer" | "Converters" | "Generators" | "Design"`

### ToolDefinition (src/types/tool.ts)
```typescript
interface ToolDefinition {
  name: string;           // Display name
  slug: string;           // URL segment (/tools/[slug])
  description: string;    // SEO description
  category: ToolCategory;
  keywords: string[];     // Extra Fuse.js search terms
  component: ComponentType; // React component to render
}
```

### CategoryMeta (src/lib/categories.ts)
```typescript
interface CategoryMeta {
  name: ToolCategory;
  emoji: string;
  description: string;
  color: string; // Tailwind bg class
}
```

## Registry System (src/lib/registry.ts)

This is the single source of truth. To add a new tool:
1. Create component at `src/tools/[slug]/index.tsx`
2. Import and add one entry to the `tools` array in `registry.ts`

Helper functions:
- `getToolBySlug(slug)` - lookup by URL slug
- `getToolsByCategory(category)` - filter by category
- `getRelatedTools(slug, limit=3)` - same category first, then others
- `getAllSlugs()` - used by `generateStaticParams` for static generation

## Routing

```
/                  -> src/app/page.tsx (homepage)
/tools/[slug]      -> src/app/tools/[slug]/page.tsx (tool page)
```

The `[slug]` route uses:
- `generateStaticParams()` - pre-renders all tool pages at build time
- `generateMetadata()` - per-tool `<title>` and `<meta description>`
- `notFound()` - returns 404 for unknown slugs

## Server vs Client Component Boundary

**Server components** (static HTML, zero JS):
- `src/app/layout.tsx` - root layout
- `src/app/page.tsx` - homepage shell
- `src/app/tools/[slug]/page.tsx` - tool page shell
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `src/components/related-tools.tsx`
- `src/app/not-found.tsx`

**Client components** ("use client"):
- `src/components/tool-list.tsx` - search + category filter
- `src/components/category-grid.tsx` - clickable category cards
- `src/components/carbon-ad.tsx` - Carbon Ads integration
- All tool components in `src/tools/*/index.tsx`

## Monetization

### Carbon Ads
- Component: `src/components/carbon-ad.tsx`
- Placement: tool page sidebar, below Related Tools
- Currently placeholder -- needs account signup at carbonads.net
- Loads script dynamically via `useEffect`

### Donation
- "Support this project" link in `src/components/site-footer.tsx`
- Links to Buy Me a Coffee (URL configurable)

## Styling Conventions

- **Dark theme**: `bg-gray-950` body, `bg-gray-900` cards, `text-gray-100` text
- **Accent colors**: per-category colors on badges (blue, green, purple, amber, pink)
- **Buttons**: `bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm`
- **Inputs**: `bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500`
- **Cards**: `bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 hover:scale-[1.02]`
- **Monospace**: `font-mono` for code textareas, hashes, UUIDs, JWT tokens
- **Container**: `max-w-7xl mx-auto px-4`

## Directory Structure

```
src/
  app/
    globals.css           - Tailwind + custom scrollbar/selection
    layout.tsx            - Root layout with header/footer
    page.tsx              - Homepage
    not-found.tsx         - Custom 404
    tools/[slug]/page.tsx - Dynamic tool page
  components/
    site-header.tsx       - Sticky header with tool count badge
    site-footer.tsx       - Footer with donation link
    category-grid.tsx     - Category card grid (client)
    tool-card.tsx         - Individual tool card with hover animation
    tool-list.tsx         - Search + filter + card grid (client)
    related-tools.tsx     - Sidebar for tool pages
    carbon-ad.tsx         - Carbon Ads integration (client)
  lib/
    registry.ts           - THE registry (single source of truth)
    categories.ts         - Category metadata
  tools/
    json-formatter/       - Prettify/minify/validate JSON
    base64-codec/         - Encode/decode Base64 (text + file)
    uuid-generator/       - UUID v4, bulk, copy
    hash-generator/       - SHA-1/256/512 via Web Crypto
    regex-tester/         - Live regex matching with groups
    lorem-ipsum/          - Placeholder text generator
    color-converter/      - HEX/RGB/HSL converter with swatch
    markdown-preview/     - Live Markdown to HTML preview
    jwt-decoder/          - Decode JWT header/payload/signature
    timestamp-converter/  - Unix timestamp to date conversion
    css-minifier/         - Minify and beautify CSS
  types/
    tool.ts               - ToolCategory, ToolDefinition
docs/
  ARCHITECTURE.md         - This file
  HANDOFF.md              - Session handoff for continuity
```
