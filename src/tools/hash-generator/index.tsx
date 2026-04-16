"use client";

import { useState } from "react";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-512"] as const;

async function computeHash(algo: string, data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSalt(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [tab, setTab] = useState<"generate" | "verify">("generate");
  const [input, setInput] = useState("");
  const [salt, setSalt] = useState("");
  const [pepper, setPepper] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Verify tab state
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifySalt, setVerifySalt] = useState("");
  const [verifyPepper, setVerifyPepper] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [verifyAlgo, setVerifyAlgo] = useState<string | null>(null);

  async function generateHashes() {
    if (!input) return;
    setLoading(true);
    const combined = `${pepper}${salt}${input}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);

    const results: Record<string, string> = {};
    for (const algo of ALGORITHMS) {
      results[algo] = await computeHash(algo, data.buffer as ArrayBuffer);
    }

    setHashes(results);
    setLoading(false);
  }

  async function handleVerify() {
    if (!verifyInput || !verifyHash) return;
    const combined = `${verifyPepper}${verifySalt}${verifyInput}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const target = verifyHash.trim().toLowerCase();

    for (const algo of ALGORITHMS) {
      const hash = await computeHash(algo, data.buffer as ArrayBuffer);
      if (hash === target) {
        setVerifyResult(true);
        setVerifyAlgo(algo);
        return;
      }
    }
    setVerifyResult(false);
    setVerifyAlgo(null);
  }

  async function copyHash(algo: string) {
    await navigator.clipboard.writeText(hashes[algo]);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-gray-700 w-fit">
        <button
          onClick={() => setTab("generate")}
          className={`px-4 py-1.5 text-sm transition-colors ${
            tab === "generate"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Generate
        </button>
        <button
          onClick={() => setTab("verify")}
          className={`px-4 py-1.5 text-sm transition-colors ${
            tab === "verify"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Verify
        </button>
      </div>

      {tab === "generate" ? (
        <>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="w-full h-28 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              spellCheck={false}
            />
          </div>

          {/* Salt & Pepper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-400">Salt</label>
                <button
                  onClick={() => setSalt(generateSalt())}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Auto-generate
                </button>
              </div>
              <input
                type="text"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                placeholder="Optional salt value..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                spellCheck={false}
              />
              <p className="text-xs text-gray-600 mt-1">
                Random value prepended to input before hashing
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Pepper</label>
              <input
                type="text"
                value={pepper}
                onChange={(e) => setPepper(e.target.value)}
                placeholder="Optional secret pepper..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                spellCheck={false}
              />
              <p className="text-xs text-gray-600 mt-1">
                Secret value prepended before salt + input
              </p>
            </div>
          </div>

          {(salt || pepper) && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-500 font-mono">
              Hash input: {pepper && <span className="text-pink-400">[pepper]</span>}
              {salt && <span className="text-amber-400">[salt]</span>}
              <span className="text-blue-400">[input]</span>
            </div>
          )}

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
          )}
        </>
      ) : (
        <>
          {/* Verify tab */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Original Text
            </label>
            <textarea
              value={verifyInput}
              onChange={(e) => { setVerifyInput(e.target.value); setVerifyResult(null); }}
              placeholder="Enter the original text..."
              className="w-full h-20 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              spellCheck={false}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Hash to Verify
            </label>
            <input
              type="text"
              value={verifyHash}
              onChange={(e) => { setVerifyHash(e.target.value); setVerifyResult(null); }}
              placeholder="Paste hash to check against..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              spellCheck={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Salt</label>
              <input
                type="text"
                value={verifySalt}
                onChange={(e) => { setVerifySalt(e.target.value); setVerifyResult(null); }}
                placeholder="Salt used during hashing..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                spellCheck={false}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Pepper</label>
              <input
                type="text"
                value={verifyPepper}
                onChange={(e) => { setVerifyPepper(e.target.value); setVerifyResult(null); }}
                placeholder="Pepper used during hashing..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                spellCheck={false}
              />
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={!verifyInput || !verifyHash}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
          >
            Verify Hash
          </button>

          {verifyResult === true && (
            <div className="bg-green-900/50 border border-green-700 text-green-300 rounded-lg px-4 py-3 text-sm">
              Match! The text matches the hash ({verifyAlgo}).
            </div>
          )}
          {verifyResult === false && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
              No match. The text does not produce this hash with any supported algorithm.
            </div>
          )}
        </>
      )}
    </div>
  );
}
