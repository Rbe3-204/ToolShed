"use client";

import { useState, useMemo } from "react";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }
  return atob(base64);
}

interface DecodedJWT {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  error: string | null;
}

function decodeJWT(token: string): DecodedJWT {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return {
      header: null,
      payload: null,
      signature: "",
      error: "Invalid JWT format. Expected 3 parts separated by dots.",
    };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, signature: parts[2], error: null };
  } catch (e) {
    return {
      header: null,
      payload: null,
      signature: "",
      error: (e as Error).message,
    };
  }
}

function Section({
  title,
  subtitle,
  content,
  color,
}: {
  title: string;
  subtitle: string;
  content: string;
  color: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <div className={`px-4 py-2 border-b border-gray-700 flex items-center justify-between ${color}`}>
        <div>
          <span className="text-sm font-semibold text-gray-100">{title}</span>
          <span className="text-xs text-gray-400 ml-2">{subtitle}</span>
        </div>
        <button
          onClick={copy}
          className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 font-mono text-sm text-gray-100 overflow-x-auto whitespace-pre-wrap break-all">
        {content}
      </pre>
    </div>
  );
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    return decodeJWT(token);
  }, [token]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Paste JWT Token
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
          className="w-full h-28 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          spellCheck={false}
        />
      </div>

      {decoded?.error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold">Error:</span> {decoded.error}
        </div>
      )}

      {decoded && !decoded.error && (
        <div className="space-y-3">
          <Section
            title="Header"
            subtitle="ALGORITHM & TOKEN TYPE"
            content={JSON.stringify(decoded.header, null, 2)}
            color="bg-red-900/30"
          />
          <Section
            title="Payload"
            subtitle="DATA"
            content={JSON.stringify(decoded.payload, null, 2)}
            color="bg-purple-900/30"
          />
          <Section
            title="Signature"
            subtitle="VERIFY SIGNATURE"
            content={decoded.signature}
            color="bg-blue-900/30"
          />
        </div>
      )}
    </div>
  );
}
