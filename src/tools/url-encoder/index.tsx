"use client";

import { useState, useMemo } from "react";

function isValidUrl(str: string): { valid: boolean; reason: string } {
  if (!str.trim()) return { valid: false, reason: "" };
  try {
    const url = new URL(str);
    if (!["http:", "https:", "ftp:", "mailto:"].includes(url.protocol)) {
      return { valid: false, reason: `Unsupported protocol: ${url.protocol}` };
    }
    return { valid: true, reason: "" };
  } catch {
    return { valid: false, reason: "Not a valid URL format" };
  }
}

export default function UrlEncoder() {
  const [mode, setMode] = useState<"encode" | "decode" | "validate">("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      if (mode === "encode") {
        return encodeURIComponent(input);
      } else if (mode === "decode") {
        return decodeURIComponent(input);
      }
      return "";
    } catch {
      return "";
    }
  }, [input, mode]);

  const encodeFullUri = useMemo(() => {
    if (!input.trim() || mode !== "encode") return "";
    try {
      return encodeURI(input);
    } catch {
      return "";
    }
  }, [input, mode]);

  const error = useMemo(() => {
    if (!input.trim()) return null;
    if (mode === "decode") {
      try {
        decodeURIComponent(input);
        return null;
      } catch (e) {
        return (e as Error).message;
      }
    }
    return null;
  }, [input, mode]);

  const validation = useMemo(() => {
    if (mode !== "validate" || !input.trim()) return null;
    return isValidUrl(input);
  }, [input, mode]);

  // Parse URL parts for validate mode
  const urlParts = useMemo(() => {
    if (mode !== "validate" || !input.trim()) return null;
    try {
      const url = new URL(input);
      return {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || "(default)",
        pathname: url.pathname,
        search: url.search || "(none)",
        hash: url.hash || "(none)",
        origin: url.origin,
      };
    } catch {
      return null;
    }
  }, [input, mode]);

  async function copyValue(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          {(["encode", "decode", "validate"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 text-sm capitalize transition-colors ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode !== "validate" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter URL or text to encode...\ne.g. hello world&foo=bar"
                  : "Enter encoded URL to decode...\ne.g. hello%20world%26foo%3Dbar"
              }
              className="w-full h-52 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              spellCheck={false}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-400">
                {mode === "encode" ? "Component Encoded" : "Decoded"}
              </label>
              <button
                onClick={() => copyValue(output)}
                disabled={!output}
                className="text-xs text-gray-500 hover:text-gray-300 disabled:opacity-50 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Result appears as you type..."
              className="w-full h-52 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm text-gray-400 mb-1">URL to Validate</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/path?query=value#hash"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
        </div>
      )}

      {/* Encode Full URI output */}
      {mode === "encode" && encodeFullUri && encodeFullUri !== output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">Full URI Encoded</label>
            <button
              onClick={() => copyValue(encodeFullUri)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 break-all">
            {encodeFullUri}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Preserves :/?#[]@!$&apos;()*+,;= for use as a full URL
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Validation result */}
      {mode === "validate" && input.trim() && validation && (
        <>
          {validation.valid ? (
            <div className="bg-green-900/50 border border-green-700 text-green-300 rounded-lg px-4 py-3 text-sm">
              Valid URL
            </div>
          ) : (
            <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
              Invalid URL{validation.reason ? `: ${validation.reason}` : ""}
            </div>
          )}

          {urlParts && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              {Object.entries(urlParts).map(([key, value], i, arr) => (
                <div
                  key={key}
                  className={`flex items-center gap-3 px-4 py-2.5 ${
                    i !== arr.length - 1 ? "border-b border-gray-800" : ""
                  }`}
                >
                  <span className="text-sm text-gray-400 w-24 shrink-0 font-semibold capitalize">
                    {key}
                  </span>
                  <code className="font-mono text-sm text-gray-100 flex-1 break-all select-all">
                    {value}
                  </code>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
