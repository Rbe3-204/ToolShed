"use client";

import { useState } from "react";

function minifyCss(css: string): string {
  let result = css;
  // Remove comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove newlines and extra whitespace
  result = result.replace(/\s+/g, " ");
  // Remove spaces around special characters
  result = result.replace(/\s*([{}:;,>~+])\s*/g, "$1");
  // Remove trailing semicolons before closing braces
  result = result.replace(/;}/g, "}");
  // Remove leading/trailing whitespace
  result = result.trim();
  return result;
}

function beautifyCss(css: string): string {
  // First minify to normalize
  let result = minifyCss(css);
  // Add newline after opening brace
  result = result.replace(/{/g, " {\n  ");
  // Add newline after semicolons (inside blocks)
  result = result.replace(/;/g, ";\n  ");
  // Add newline before closing brace
  result = result.replace(/\s*}/g, "\n}\n");
  // Add space after colon
  result = result.replace(/:/g, ": ");
  // Fix double spaces in selectors with colons (like :hover)
  result = result.replace(/: : /g, "::");
  result = result.replace(/: (\w+-)/g, ":$1");
  // Clean up extra whitespace on empty lines
  result = result.replace(/\n\s*\n/g, "\n");
  // Trim trailing spaces on each line
  result = result
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
  return result;
}

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"minify" | "beautify">("minify");
  const [copied, setCopied] = useState(false);

  function process() {
    if (!input) return;
    setOutput(mode === "minify" ? minifyCss(input) : beautifyCss(input));
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const originalSize = new Blob([input]).size;
  const resultSize = new Blob([output]).size;
  const savings =
    originalSize > 0
      ? Math.round(((originalSize - resultSize) / originalSize) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => setMode("minify")}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "minify"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Minify
          </button>
          <button
            onClick={() => setMode("beautify")}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "beautify"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Beautify
          </button>
        </div>
        <button
          onClick={process}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
        >
          {mode === "minify" ? "Minify" : "Beautify"}
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg px-4 py-1.5 text-sm transition-colors ml-auto"
        >
          {copied ? "Copied!" : "Copy Output"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste CSS here..."
            className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Output</label>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none"
          />
        </div>
      </div>

      {output && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-400">
          Original: {originalSize.toLocaleString()} bytes &rarr;{" "}
          {mode === "minify" ? "Minified" : "Beautified"}:{" "}
          {resultSize.toLocaleString()} bytes
          {mode === "minify" && savings > 0 && (
            <span className="text-green-400 ml-2">({savings}% smaller)</span>
          )}
        </div>
      )}
    </div>
  );
}
