"use client";

import { useState } from "react";

function markdownToHtml(md: string): string {
  let html = md;

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="bg-gray-800 rounded-lg p-3 overflow-x-auto"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-sm">$1</code>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-400 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr />");

  // Unordered lists
  html = html.replace(/^[\s]*[-*]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

  // Blockquotes
  html = html.replace(
    /^>\s+(.+)$/gm,
    '<blockquote class="border-l-4 border-gray-600 pl-4 italic text-gray-400">$1</blockquote>'
  );

  // Paragraphs: wrap remaining lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sanitize(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

const DEFAULT_MD = `# Markdown Preview

This is a **live preview** of your markdown.

## Features

- **Bold** and *italic* text
- \`Inline code\` formatting
- [Links](https://example.com)
- Lists and headings

### Code Blocks

\`\`\`js
function hello() {
  console.log("Hello, world!");
}
\`\`\`

> Blockquotes work too!

---

Start typing on the left to see the preview update in real time.`;

export default function MarkdownPreview() {
  const [input, setInput] = useState(DEFAULT_MD);

  const html = sanitize(markdownToHtml(input));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Markdown Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type markdown here..."
          className="w-full h-[500px] bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Preview</label>
        <div
          className="w-full h-[500px] bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-y-auto prose prose-invert prose-sm max-w-none
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:text-gray-100
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-gray-100
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-gray-200
            [&_p]:mb-3 [&_p]:text-gray-300 [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:text-gray-300
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:text-gray-300
            [&_li]:mb-1
            [&_hr]:border-gray-700 [&_hr]:my-4
            [&_pre]:my-3
            [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
