"use client";

import { useState } from "react";

export default function UrlEncoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    setError(null);
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  function handleEncodeAll() {
    setError(null);
    try {
      setOutput(encodeURI(input));
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
            onClick={() => {
              setMode("encode");
              setOutput("");
              setError(null);
            }}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "encode"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => {
              setMode("decode");
              setOutput("");
              setError(null);
            }}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "decode"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Decode
          </button>
        </div>
        <button
          onClick={handleConvert}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
        >
          {mode === "encode" ? "Encode Component" : "Decode"}
        </button>
        {mode === "encode" && (
          <button
            onClick={handleEncodeAll}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
          >
            Encode Full URI
          </button>
        )}
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
            placeholder={
              mode === "encode"
                ? "Enter URL or text to encode..."
                : "Enter encoded URL to decode..."
            }
            className="w-full h-52 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Output</label>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="w-full h-52 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {mode === "encode" && (
        <div className="text-xs text-gray-500">
          <strong>Encode Component</strong> encodes all special characters (use
          for query params). <strong>Encode Full URI</strong> preserves
          :/?#[]@!$&apos;()*+,;= (use for full URLs).
        </div>
      )}
    </div>
  );
}
