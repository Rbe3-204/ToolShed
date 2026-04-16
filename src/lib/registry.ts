import { ToolDefinition, ToolCategory } from "@/types/tool";
import JsonFormatter from "@/tools/json-formatter";
import Base64Codec from "@/tools/base64-codec";
import UuidGenerator from "@/tools/uuid-generator";

export const tools: ToolDefinition[] = [
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description:
      "Prettify, minify, and validate JSON data instantly in your browser.",
    category: "Developer",
    keywords: ["prettify", "minify", "validate", "json", "format"],
    component: JsonFormatter,
  },
  {
    name: "Base64 Encoder/Decoder",
    slug: "base64-codec",
    description:
      "Encode and decode Base64 strings and files entirely client-side.",
    category: "Converters",
    keywords: ["base64", "encode", "decode", "binary", "file"],
    component: Base64Codec,
  },
  {
    name: "UUID Generator",
    slug: "uuid-generator",
    description:
      "Generate UUID v4 identifiers \u2014 single or bulk up to 50 \u2014 with one-click copy.",
    category: "Generators",
    keywords: ["uuid", "guid", "v4", "random", "identifier"],
    component: UuidGenerator,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((t) => t.category === category);
}

export function getRelatedTools(slug: string, limit = 3): ToolDefinition[] {
  const current = getToolBySlug(slug);
  if (!current) return [];
  const sameCategory = tools.filter(
    (t) => t.category === current.category && t.slug !== slug
  );
  const others = tools.filter(
    (t) => t.category !== current.category && t.slug !== slug
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getAllSlugs(): string[] {
  return tools.map((t) => t.slug);
}
