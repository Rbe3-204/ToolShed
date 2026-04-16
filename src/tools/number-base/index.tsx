"use client";

import { useState } from "react";

const BASES = [
  { label: "Binary", base: 2, prefix: "0b" },
  { label: "Octal", base: 8, prefix: "0o" },
  { label: "Decimal", base: 10, prefix: "" },
  { label: "Hexadecimal", base: 16, prefix: "0x" },
] as const;

export default function NumberBaseConverter() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = (() => {
    if (!input.trim()) return null;
    try {
      const clean = input.trim().replace(/^0[bBxXoO]/, "");
      const num = parseInt(clean, fromBase);
      if (isNaN(num)) return null;
      return num;
    } catch {
      return null;
    }
  })();

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">From:</label>
          <div className="flex rounded-lg overflow-hidden border border-gray-700">
            {BASES.map(({ label, base }) => (
              <button
                key={base}
                onClick={() => setFromBase(base)}
                className={`px-3 py-1.5 text-sm transition-colors ${fromBase === base ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Input</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter a ${BASES.find((b) => b.base === fromBase)?.label.toLowerCase()} number...`}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          spellCheck={false}
        />
      </div>

      {input.trim() && parsed === null && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          Invalid {BASES.find((b) => b.base === fromBase)?.label.toLowerCase()} number.
        </div>
      )}

      {parsed !== null && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          {BASES.map(({ label, base, prefix }, i) => {
            const result = parsed.toString(base).toUpperCase();
            const display = `${prefix}${result}`;
            return (
              <div
                key={base}
                className={`flex items-center gap-3 px-4 py-3 ${i !== BASES.length - 1 ? "border-b border-gray-800" : ""}`}
              >
                <span className="text-sm text-gray-400 w-28 shrink-0 font-semibold">{label}</span>
                <code className="font-mono text-sm text-gray-100 flex-1 min-w-0 break-all select-all">{display}</code>
                <button
                  onClick={() => copy(label, display)}
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
