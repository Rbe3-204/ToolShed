"use client";

import { useState } from "react";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-512"] as const;

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateHashes() {
    if (!input) return;
    setLoading(true);
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const results: Record<string, string> = {};
    for (const algo of ALGORITHMS) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      results[algo] = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    setHashes(results);
    setLoading(false);
  }

  async function copyHash(algo: string) {
    await navigator.clipboard.writeText(hashes[algo]);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          spellCheck={false}
        />
      </div>

      <button
        onClick={generateHashes}
        disabled={!input || loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
      >
        {loading ? "Generating..." : "Generate Hashes"}
      </button>

      {Object.keys(hashes).length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          {ALGORITHMS.map((algo, i) => (
            <div
              key={algo}
              className={`flex items-center gap-3 px-4 py-3 ${
                i !== ALGORITHMS.length - 1
                  ? "border-b border-gray-800"
                  : ""
              }`}
            >
              <span className="text-sm text-gray-400 w-20 shrink-0 font-semibold">
                {algo}
              </span>
              <code className="font-mono text-xs text-gray-100 flex-1 min-w-0 break-all select-all">
                {hashes[algo]}
              </code>
              <button
                onClick={() => copyHash(algo)}
                className="text-gray-500 hover:text-gray-300 shrink-0 transition-colors"
                title="Copy"
              >
                {copied === algo ? (
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
