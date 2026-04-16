"use client";

import { useState } from "react";

function jsonToYaml(obj: unknown, indent: number = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj === "string") return `"${obj}"`;
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => {
      const val = jsonToYaml(item, indent + 1);
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const lines = val.split("\n");
        return `${pad}- ${lines[0]}\n${lines.slice(1).map((l) => `${pad}  ${l}`).join("\n")}`;
      }
      return `${pad}- ${val}`;
    }).join("\n");
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries.map(([key, val]) => {
      if (typeof val === "object" && val !== null) {
        return `${pad}${key}:\n${jsonToYaml(val, indent + 1)}`;
      }
      return `${pad}${key}: ${jsonToYaml(val, indent)}`;
    }).join("\n");
  }

  return String(obj);
}

function jsonToCsv(data: unknown): string {
  if (!Array.isArray(data)) {
    if (typeof data === "object" && data !== null) {
      data = [data];
    } else {
      return String(data);
    }
  }
  const arr = data as Record<string, unknown>[];
  if (arr.length === 0) return "";

  const headers = Array.from(new Set(arr.flatMap((row) => Object.keys(row))));

  function escapeCell(val: unknown): string {
    if (val === null || val === undefined) return "";
    const str = typeof val === "object" ? JSON.stringify(val) : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const rows = arr.map((row) =>
    headers.map((h) => escapeCell(row[h])).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export default function JsonConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [format, setFormat] = useState<"yaml" | "csv">("yaml");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    setError(null);
    try {
      const parsed = JSON.parse(input);
      if (format === "yaml") {
        setOutput(jsonToYaml(parsed));
      } else {
        setOutput(jsonToCsv(parsed));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => { setFormat("yaml"); setOutput(""); setError(null); }}
            className={`px-4 py-1.5 text-sm transition-colors ${format === "yaml" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            JSON to YAML
          </button>
          <button
            onClick={() => { setFormat("csv"); setOutput(""); setError(null); }}
            className={`px-4 py-1.5 text-sm transition-colors ${format === "csv" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            JSON to CSV
          </button>
        </div>
        <button onClick={handleConvert} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors">
          Convert
        </button>
        <button onClick={copyOutput} disabled={!output} className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg px-4 py-1.5 text-sm transition-colors ml-auto">
          {copied ? "Copied!" : "Copy Output"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">JSON Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"key": "value"}' className="w-full h-80 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" spellCheck={false} />
        </div>
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{format.toUpperCase()} Output</label>
          <textarea value={output} readOnly placeholder="Converted output..." className="w-full h-80 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none" />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}
    </div>
  );
}
