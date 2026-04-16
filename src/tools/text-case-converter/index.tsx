"use client";

import { useState } from "react";

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

const CASES = [
  {
    label: "camelCase",
    convert: (words: string[]) =>
      words.map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(""),
  },
  {
    label: "PascalCase",
    convert: (words: string[]) =>
      words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(""),
  },
  {
    label: "snake_case",
    convert: (words: string[]) => words.map((w) => w.toLowerCase()).join("_"),
  },
  {
    label: "SCREAMING_SNAKE",
    convert: (words: string[]) => words.map((w) => w.toUpperCase()).join("_"),
  },
  {
    label: "kebab-case",
    convert: (words: string[]) => words.map((w) => w.toLowerCase()).join("-"),
  },
  {
    label: "UPPER CASE",
    convert: (words: string[]) => words.map((w) => w.toUpperCase()).join(" "),
  },
  {
    label: "lower case",
    convert: (words: string[]) => words.map((w) => w.toLowerCase()).join(" "),
  },
  {
    label: "Title Case",
    convert: (words: string[]) =>
      words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "),
  },
  {
    label: "Sentence case",
    convert: (words: string[]) =>
      words.map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join(" "),
  },
  {
    label: "dot.case",
    convert: (words: string[]) => words.map((w) => w.toLowerCase()).join("."),
  },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const words = toWords(input);

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to convert..."
          className="w-full h-28 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          spellCheck={false}
        />
      </div>

      {input.trim() && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {CASES.map(({ label, convert }, i) => {
            const result = convert(words);
            return (
              <div
                key={label}
                className={`flex items-center gap-3 px-4 py-2.5 ${i !== CASES.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""}`}
              >
                <span className="text-sm text-gray-500 dark:text-gray-400 w-40 shrink-0">{label}</span>
                <code className="font-mono text-sm text-gray-900 dark:text-gray-100 flex-1 min-w-0 break-all select-all">{result}</code>
                <button
                  onClick={() => copy(label, result)}
                  className="text-gray-500 hover:text-gray-300 shrink-0 transition-colors text-xs"
                >
                  {copied === label ? "Copied!" : "Copy"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
