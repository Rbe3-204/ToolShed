"use client";

import { useState, useMemo } from "react";

interface MatchResult {
  match: string;
  index: number;
  length: number;
  groups: string[];
}

const COMMON_PATTERNS = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { label: "URL", pattern: "https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+" },
  { label: "Phone", pattern: "\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}" },
  { label: "IP Address", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { label: "Hex Color", pattern: "#[0-9a-fA-F]{3,8}" },
];

export default function RegexTester() {
  const [tab, setTab] = useState<"match" | "replace">("match");
  const [pattern, setPattern] = useState("");
  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);
  const [flagS, setFlagS] = useState(false);
  const [flagU, setFlagU] = useState(false);
  const [testString, setTestString] = useState("");
  const [replaceWith, setReplaceWith] = useState("");

  const flags = `${flagG ? "g" : ""}${flagI ? "i" : ""}${flagM ? "m" : ""}${flagS ? "s" : ""}${flagU ? "u" : ""}`;

  const { matches, error } = useMemo(() => {
    if (!pattern || !testString) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flags);
      const results: MatchResult[] = [];

      if (flagG) {
        const allMatches = Array.from(testString.matchAll(regex));
        for (const m of allMatches) {
          results.push({ match: m[0], index: m.index!, length: m[0].length, groups: m.slice(1) });
        }
      } else {
        const m = testString.match(regex);
        if (m) {
          results.push({ match: m[0], index: m.index!, length: m[0].length, groups: m.slice(1) });
        }
      }
      return { matches: results, error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, testString, flags, flagG]);

  const replaceResult = useMemo(() => {
    if (!pattern || !testString || tab !== "replace") return "";
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, replaceWith);
    } catch {
      return "";
    }
  }, [pattern, testString, replaceWith, flags, tab]);

  // Build highlighted text
  const highlightedText = useMemo(() => {
    if (!pattern || !testString || matches.length === 0) return null;
    const parts: { text: string; highlighted: boolean }[] = [];
    let lastIndex = 0;
    for (const m of matches) {
      if (m.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, m.index), highlighted: false });
      }
      parts.push({ text: m.match, highlighted: true });
      lastIndex = m.index + m.length;
    }
    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), highlighted: false });
    }
    return parts;
  }, [pattern, testString, matches]);

  const [copied, setCopied] = useState(false);
  async function copyReplace() {
    await navigator.clipboard.writeText(replaceResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 w-fit">
        <button onClick={() => setTab("match")} className={`px-4 py-1.5 text-sm transition-colors ${tab === "match" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
          Match
        </button>
        <button onClick={() => setTab("replace")} className={`px-4 py-1.5 text-sm transition-colors ${tab === "replace" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
          Replace
        </button>
      </div>

      {/* Pattern */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-gray-500 font-mono text-lg">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
          <span className="text-gray-500 font-mono text-lg">/</span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { flag: "g", active: flagG, set: setFlagG },
            { flag: "i", active: flagI, set: setFlagI },
            { flag: "m", active: flagM, set: setFlagM },
            { flag: "s", active: flagS, set: setFlagS },
            { flag: "u", active: flagU, set: setFlagU },
          ].map(({ flag, active, set }) => (
            <button
              key={flag}
              onClick={() => set(!active)}
              className={`w-8 h-8 rounded-lg font-mono text-sm transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {flag}
            </button>
          ))}
        </div>
      </div>

      {/* Common patterns */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-400 self-center mr-1">Quick:</span>
        {COMMON_PATTERNS.map(({ label, pattern: p }) => (
          <button
            key={label}
            onClick={() => setPattern(p)}
            className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Replace input */}
      {tab === "replace" && (
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Replace with</label>
          <input
            type="text"
            value={replaceWith}
            onChange={(e) => setReplaceWith(e.target.value)}
            placeholder="Replacement string ($1 for groups)..."
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
        </div>
      )}

      {/* Test string */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-gray-500 dark:text-gray-400">Test String</label>
          {matches.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">
              {matches.length} match{matches.length !== 1 ? "es" : ""}
            </span>
          )}
        </div>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
          className="w-full h-36 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          spellCheck={false}
        />
      </div>

      {/* Highlighted matches */}
      {highlightedText && tab === "match" && (
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Highlighted</label>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-sm whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">
            {highlightedText.map((part, i) =>
              part.highlighted ? (
                <mark key={i} className="bg-yellow-400/30 text-yellow-300 dark:text-yellow-200 rounded px-0.5">{part.text}</mark>
              ) : (
                <span key={i} className="text-gray-900 dark:text-gray-100">{part.text}</span>
              )
            )}
          </div>
        </div>
      )}

      {/* Replace result */}
      {tab === "replace" && replaceResult && !error && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-500 dark:text-gray-400">Replace Result</label>
            <button onClick={copyReplace} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">
            {replaceResult}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold">Invalid regex:</span> {error}
        </div>
      )}

      {/* Match details */}
      {!error && pattern && testString && tab === "match" && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Match Details
          </h3>
          {matches.length > 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                {matches.map((m, i) => (
                  <div key={i} className={`px-4 py-3 ${i !== matches.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""}`}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-gray-500">Match {i + 1}</span>
                      <code className="font-mono text-sm text-blue-400">&quot;{m.match}&quot;</code>
                      <span className="text-xs text-gray-500">index: {m.index}</span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className="mt-1 ml-4 space-y-0.5">
                        {m.groups.map((g, gi) => (
                          <div key={gi} className="text-xs">
                            <span className="text-gray-500">Group {gi + 1}: </span>
                            <code className="text-green-400">&quot;{g}&quot;</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No matches found.</p>
          )}
        </div>
      )}
    </div>
  );
}
