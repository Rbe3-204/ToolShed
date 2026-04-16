"use client";

import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState<2 | 4>(2);
  const [copied, setCopied] = useState(false);
  const [valid, setValid] = useState<boolean | null>(null);

  function prettify() {
    setValid(null);
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  function minify() {
    setValid(null);
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  function validate() {
    try {
      JSON.parse(input);
      setError(null);
      setValid(true);
    } catch (e) {
      setError((e as Error).message);
      setValid(false);
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Indent:</span>
          <button
            onClick={() => setIndentSize(2)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              indentSize === 2
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            2
          </button>
          <button
            onClick={() => setIndentSize(4)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              indentSize === 4
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            4
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prettify}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
          >
            Prettify
          </button>
          <button
            onClick={minify}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
          >
            Minify
          </button>
          <button
            onClick={validate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
          >
            Validate
          </button>
        </div>
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
            placeholder='Paste JSON here...\n{"key": "value"}'
            className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Output</label>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted output will appear here..."
            className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {valid === true && !error && (
        <div className="bg-green-900/50 border border-green-700 text-green-300 rounded-lg px-4 py-3 text-sm">
          Valid JSON
        </div>
      )}
    </div>
  );
}
