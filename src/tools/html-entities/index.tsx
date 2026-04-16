"use client";

import { useState } from "react";

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};

function encodeEntities(text: string, encodeAll: boolean): string {
  if (encodeAll) {
    return Array.from(text)
      .map((ch) => {
        if (ENTITY_MAP[ch]) return ENTITY_MAP[ch];
        const code = ch.charCodeAt(0);
        if (code > 127) return `&#${code};`;
        return ch;
      })
      .join("");
  }
  return text.replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch] || ch);
}

function decodeEntities(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export default function HtmlEntities() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encodeAll, setEncodeAll] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleConvert() {
    if (mode === "encode") {
      setOutput(encodeEntities(input, encodeAll));
    } else {
      setOutput(decodeEntities(input));
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
            onClick={() => { setMode("encode"); setOutput(""); }}
            className={`px-4 py-1.5 text-sm transition-colors ${mode === "encode" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            Encode
          </button>
          <button
            onClick={() => { setMode("decode"); setOutput(""); }}
            className={`px-4 py-1.5 text-sm transition-colors ${mode === "decode" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            Decode
          </button>
        </div>
        {mode === "encode" && (
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={encodeAll} onChange={(e) => setEncodeAll(e.target.checked)} className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" />
            Encode non-ASCII
          </label>
        )}
        <button onClick={handleConvert} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors">
          {mode === "encode" ? "Encode" : "Decode"}
        </button>
        <button onClick={copyOutput} disabled={!output} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg px-4 py-1.5 text-sm transition-colors ml-auto">
          {copied ? "Copied!" : "Copy Output"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? '<div class="test">' : "&lt;div class=&quot;test&quot;&gt;"} className="w-full h-52 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" spellCheck={false} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Output</label>
          <textarea value={output} readOnly placeholder="Result will appear here..." className="w-full h-52 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none" />
        </div>
      </div>
    </div>
  );
}
