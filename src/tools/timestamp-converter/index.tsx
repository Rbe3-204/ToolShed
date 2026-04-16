"use client";

import { useState, useEffect } from "react";

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiff = Math.abs(diffMs);
  const isFuture = diffMs < 0;
  const suffix = isFuture ? "from now" : "ago";

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ${suffix}`;
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ${suffix}`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ${suffix}`;
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ${suffix}`;
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ${suffix}`;
  return `${years} year${years !== 1 ? "s" : ""} ${suffix}`;
}

export default function TimestampConverter() {
  const [mode, setMode] = useState<"toDate" | "toUnix">("toDate");
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [currentUnix, setCurrentUnix] = useState(Math.floor(Date.now() / 1000));
  const [copiedCurrent, setCopiedCurrent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUnix(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function getDateFromUnix(): Date | null {
    const num = parseInt(unixInput);
    if (isNaN(num)) return null;
    // Auto-detect seconds vs milliseconds
    const ts = num > 1e12 ? num : num * 1000;
    return new Date(ts);
  }

  function getUnixFromDate(): number | null {
    if (!dateInput) return null;
    const parsed = Date.parse(dateInput);
    if (isNaN(parsed)) return null;
    return Math.floor(parsed / 1000);
  }

  const dateResult = mode === "toDate" ? getDateFromUnix() : null;
  const unixResult = mode === "toUnix" ? getUnixFromDate() : null;

  async function copyCurrent() {
    await navigator.clipboard.writeText(currentUnix.toString());
    setCopiedCurrent(true);
    setTimeout(() => setCopiedCurrent(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Current timestamp */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Current Unix Timestamp: </span>
          <span className="font-mono text-lg text-gray-900 dark:text-gray-100">{currentUnix}</span>
        </div>
        <button
          onClick={copyCurrent}
          className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 text-sm transition-colors"
        >
          {copiedCurrent ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-lg overflow-hidden border border-gray-700 w-fit">
        <button
          onClick={() => setMode("toDate")}
          className={`px-4 py-1.5 text-sm transition-colors ${
            mode === "toDate"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Unix &rarr; Date
        </button>
        <button
          onClick={() => setMode("toUnix")}
          className={`px-4 py-1.5 text-sm transition-colors ${
            mode === "toUnix"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Date &rarr; Unix
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
          {mode === "toDate" ? "Unix Timestamp" : "Date String"}
        </label>
        {mode === "toDate" ? (
          <input
            type="text"
            value={unixInput}
            onChange={(e) => setUnixInput(e.target.value)}
            placeholder="e.g. 1713225600"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder="e.g. 2024-04-16 00:00:00 or Apr 16 2024"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
      </div>

      {/* Results */}
      {mode === "toDate" && dateResult && !isNaN(dateResult.getTime()) && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {[
            { label: "UTC", value: dateResult.toUTCString() },
            { label: "Local", value: dateResult.toString() },
            { label: "ISO 8601", value: dateResult.toISOString() },
            { label: "Relative", value: getRelativeTime(dateResult) },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-2.5 ${
                i !== arr.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""
              }`}
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 w-20 shrink-0 font-semibold">
                {label}
              </span>
              <code className="font-mono text-sm text-gray-900 dark:text-gray-100 select-all">
                {value}
              </code>
            </div>
          ))}
        </div>
      )}

      {mode === "toDate" && unixInput && (!dateResult || isNaN(dateResult.getTime())) && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          Invalid timestamp. Enter a Unix timestamp in seconds or milliseconds.
        </div>
      )}

      {mode === "toUnix" && unixResult !== null && (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Unix Timestamp: </span>
          <code className="font-mono text-lg text-gray-900 dark:text-gray-100 select-all">
            {unixResult}
          </code>
        </div>
      )}

      {mode === "toUnix" && dateInput && unixResult === null && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          Could not parse date string. Try formats like &quot;2024-04-16&quot; or &quot;Apr 16 2024 12:00:00&quot;.
        </div>
      )}
    </div>
  );
}
