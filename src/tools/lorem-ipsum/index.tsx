"use client";

import { useState } from "react";

const PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.",
  "Praesent blandit laoreet nibh. Fusce convallis metus id felis luctus adipiscing. Pellentesque egestas neque sit amet convallis pulvinar, justo nulla eleifend augue, ac auctor orci leo non est.",
  "Etiam ultricies nisi vel augue. Suspendisse potenti. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Nulla porta dolor.",
  "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  "Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.",
  "Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.",
];

function getSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) || [text];
}

function getWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">(
    "paragraphs"
  );
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    let result = "";

    if (unit === "paragraphs") {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        paras.push(PARAGRAPHS[i % PARAGRAPHS.length]);
      }
      result = paras.join("\n\n");
    } else if (unit === "sentences") {
      const allSentences = PARAGRAPHS.flatMap(getSentences);
      const selected: string[] = [];
      for (let i = 0; i < count; i++) {
        selected.push(allSentences[i % allSentences.length]);
      }
      result = selected.join(" ");
    } else {
      const allWords = PARAGRAPHS.flatMap(getWords);
      const selected: string[] = [];
      for (let i = 0; i < count; i++) {
        selected.push(allWords[i % allWords.length]);
      }
      result = selected.join(" ");
    }

    setOutput(result);
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="lorem-count" className="text-sm text-gray-400">
            Count:
          </label>
          <input
            id="lorem-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => {
              const val = Math.min(
                50,
                Math.max(1, parseInt(e.target.value) || 1)
              );
              setCount(val);
            }}
            className="w-20 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          {(["paragraphs", "sentences", "words"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-4 py-1.5 text-sm capitalize transition-colors ${
                unit === u
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
        >
          Generate
        </button>
        {output && (
          <button
            onClick={copyOutput}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-4 py-1.5 text-sm transition-colors ml-auto"
          >
            {copied ? "Copied!" : "Copy All"}
          </button>
        )}
      </div>

      {output && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-[500px] overflow-y-auto">
          <p className="text-sm text-gray-100 whitespace-pre-line leading-relaxed">
            {output}
          </p>
        </div>
      )}
    </div>
  );
}
