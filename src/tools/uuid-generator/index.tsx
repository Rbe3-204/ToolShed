"use client";

import { useState } from "react";

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function generate() {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = crypto.randomUUID();
      if (uppercase) id = id.toUpperCase();
      result.push(id);
    }
    setUuids(result);
    setCopiedIndex(null);
  }

  async function copyOne(index: number) {
    await navigator.clipboard.writeText(uuids[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  async function copyAll() {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="uuid-count" className="text-sm text-gray-500 dark:text-gray-400">
            Count:
          </label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => {
              const val = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
              setCount(val);
            }}
            className="w-20 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
          />
          Uppercase
        </label>
        <button
          onClick={generate}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
        >
          Generate
        </button>
        {uuids.length > 0 && (
          <button
            onClick={copyAll}
            className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-300 rounded-lg px-4 py-1.5 text-sm transition-colors ml-auto"
          >
            {copiedIndex === -1 ? "Copied All!" : "Copy All"}
          </button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            {uuids.map((uuid, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-2 ${
                  i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"
                } ${i !== uuids.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""}`}
              >
                <span className="text-gray-500 text-sm w-8 shrink-0">
                  {i + 1}.
                </span>
                <code className="font-mono text-sm text-gray-900 dark:text-gray-100 flex-1 select-all">
                  {uuid}
                </code>
                <button
                  onClick={() => copyOne(i)}
                  className="text-gray-500 hover:text-gray-300 ml-3 shrink-0 transition-colors"
                  title="Copy"
                >
                  {copiedIndex === i ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uuids.length > 0 && (
        <p className="text-sm text-gray-500">
          Generated {uuids.length} UUID{uuids.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
