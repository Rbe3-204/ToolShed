"use client";

import { useState, useMemo } from "react";

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);
  const [testString, setTestString] = useState("");

  const flags = `${flagG ? "g" : ""}${flagI ? "i" : ""}${flagM ? "m" : ""}`;

  const { matches, error } = useMemo(() => {
    if (!pattern || !testString) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flags);
      const results: MatchResult[] = [];

      if (flagG) {
        const allMatches = Array.from(testString.matchAll(regex));
        for (const m of allMatches) {
          results.push({
            match: m[0],
            index: m.index!,
            groups: m.slice(1),
          });
        }
      } else {
        const m = testString.match(regex);
        if (m) {
          results.push({
            match: m[0],
            index: m.index!,
            groups: m.slice(1),
          });
        }
      }

      return { matches: results, error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, testString, flags, flagG]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-gray-500 font-mono text-lg">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
          <span className="text-gray-500 font-mono text-lg">/</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-400 mr-1">Flags:</span>
          {[
            { flag: "g", label: "g", active: flagG, set: setFlagG },
            { flag: "i", label: "i", active: flagI, set: setFlagI },
            { flag: "m", label: "m", active: flagM, set: setFlagM },
          ].map(({ flag, label, active, set }) => (
            <button
              key={flag}
              onClick={() => set(!active)}
              className={`w-8 h-8 rounded-lg font-mono text-sm transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
          className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold">Invalid regex:</span> {error}
        </div>
      )}

      {!error && pattern && testString && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">
            Matches ({matches.length} found)
          </h3>
          {matches.length > 0 ? (
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                {matches.map((m, i) => (
                  <div
                    key={i}
                    className={`px-4 py-3 ${
                      i !== matches.length - 1
                        ? "border-b border-gray-800"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        Match {i + 1}
                      </span>
                      <code className="font-mono text-sm text-blue-400">
                        &quot;{m.match}&quot;
                      </code>
                      <span className="text-xs text-gray-500">
                        index: {m.index}
                      </span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className="mt-1 ml-4 space-y-0.5">
                        {m.groups.map((g, gi) => (
                          <div key={gi} className="text-xs">
                            <span className="text-gray-500">
                              Group {gi + 1}:{" "}
                            </span>
                            <code className="text-green-400">
                              &quot;{g}&quot;
                            </code>
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
