import { ToolDefinition, ToolCategory } from "@/types/tool";
import JsonFormatter from "@/tools/json-formatter";
import Base64Codec from "@/tools/base64-codec";
import UuidGenerator from "@/tools/uuid-generator";
import HashGenerator from "@/tools/hash-generator";
import RegexTester from "@/tools/regex-tester";
import LoremIpsumGenerator from "@/tools/lorem-ipsum";
import MarkdownPreview from "@/tools/markdown-preview";
import JwtDecoder from "@/tools/jwt-decoder";
import TimestampConverter from "@/tools/timestamp-converter";
import CssMinifier from "@/tools/css-minifier";
import DiffChecker from "@/tools/diff-checker";
import UrlEncoder from "@/tools/url-encoder";
import PasswordGenerator from "@/tools/password-generator";
import BoxShadowGenerator from "@/tools/box-shadow";
import ColorPicker from "@/tools/color-picker";

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
  {
    name: "Hash Generator",
    slug: "hash-generator",
    description:
      "Generate SHA-1, SHA-256, and SHA-512 hashes from any text input.",
    category: "Developer",
    keywords: ["hash", "sha", "sha256", "sha512", "checksum", "digest"],
    component: HashGenerator,
  },
  {
    name: "Regex Tester",
    slug: "regex-tester",
    description:
      "Test regular expressions with live matching, flags, and capture group display.",
    category: "Text",
    keywords: ["regex", "regexp", "regular expression", "pattern", "match", "test"],
    component: RegexTester,
  },
  {
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum",
    description:
      "Generate placeholder text by paragraphs, sentences, or words.",
    category: "Generators",
    keywords: ["lorem", "ipsum", "placeholder", "text", "dummy", "filler"],
    component: LoremIpsumGenerator,
  },
  {
    name: "Markdown Preview",
    slug: "markdown-preview",
    description:
      "Live Markdown to HTML preview with syntax highlighting.",
    category: "Text",
    keywords: ["markdown", "md", "preview", "html", "render"],
    component: MarkdownPreview,
  },
  {
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description:
      "Decode JWT tokens to inspect header, payload, and signature.",
    category: "Developer",
    keywords: ["jwt", "token", "decode", "header", "payload", "signature"],
    component: JwtDecoder,
  },
  {
    name: "Timestamp Converter",
    slug: "timestamp-converter",
    description:
      "Convert between Unix timestamps and human-readable dates.",
    category: "Converters",
    keywords: ["unix", "timestamp", "epoch", "date", "time", "convert"],
    component: TimestampConverter,
  },
  {
    name: "CSS Minifier",
    slug: "css-minifier",
    description:
      "Minify and beautify CSS code with size comparison.",
    category: "Developer",
    keywords: ["css", "minify", "beautify", "compress", "format", "stylesheet"],
    component: CssMinifier,
  },
  {
    name: "Diff Checker",
    slug: "diff-checker",
    description:
      "Compare two texts side-by-side and highlight differences.",
    category: "Text",
    keywords: ["diff", "compare", "difference", "text", "merge", "changes"],
    component: DiffChecker,
  },
  {
    name: "URL Encoder/Decoder",
    slug: "url-encoder",
    description:
      "Encode and decode URL components and full URIs.",
    category: "Converters",
    keywords: ["url", "encode", "decode", "uri", "percent", "query string"],
    component: UrlEncoder,
  },
  {
    name: "Password Generator",
    slug: "password-generator",
    description:
      "Generate secure passwords with custom length and character options.",
    category: "Generators",
    keywords: ["password", "generate", "secure", "random", "strong"],
    component: PasswordGenerator,
  },
  {
    name: "Box Shadow Generator",
    slug: "box-shadow",
    description:
      "Visual CSS box-shadow builder with live preview and copy.",
    category: "Design",
    keywords: ["box-shadow", "css", "shadow", "generator", "visual", "builder"],
    component: BoxShadowGenerator,
  },
  {
    name: "Color Picker",
    slug: "color-picker",
    description:
      "Custom visual color picker with palette saving and format export.",
    category: "Design",
    keywords: ["color", "picker", "palette", "select", "visual", "swatch"],
    component: ColorPicker,
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
