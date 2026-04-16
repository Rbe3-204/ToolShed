"use client";

import { useState, useMemo } from "react";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
  lineNum: { left: number | null; right: number | null };
}

function computeDiff(left: string, right: string): DiffLine[] {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const result: DiffLine[] = [];

  const maxLen = Math.max(leftLines.length, rightLines.length);
  let li = 0;
  let ri = 0;

  while (li < leftLines.length || ri < rightLines.length) {
    if (li >= leftLines.length) {
      result.push({
        type: "added",
        text: rightLines[ri],
        lineNum: { left: null, right: ri + 1 },
      });
      ri++;
    } else if (ri >= rightLines.length) {
      result.push({
        type: "removed",
        text: leftLines[li],
        lineNum: { left: li + 1, right: null },
      });
      li++;
    } else if (leftLines[li] === rightLines[ri]) {
      result.push({
        type: "unchanged",
        text: leftLines[li],
        lineNum: { left: li + 1, right: ri + 1 },
      });
      li++;
      ri++;
    } else {
      // Look ahead to find matching lines
      let foundRight = -1;
      let foundLeft = -1;
      const lookAhead = Math.min(10, maxLen);

      for (let k = 1; k <= lookAhead; k++) {
        if (ri + k < rightLines.length && leftLines[li] === rightLines[ri + k]) {
          foundRight = k;
          break;
        }
        if (li + k < leftLines.length && leftLines[li + k] === rightLines[ri]) {
          foundLeft = k;
          break;
        }
      }

      if (foundRight > 0 && (foundLeft < 0 || foundRight <= foundLeft)) {
        for (let k = 0; k < foundRight; k++) {
          result.push({
            type: "added",
            text: rightLines[ri + k],
            lineNum: { left: null, right: ri + k + 1 },
          });
        }
        ri += foundRight;
      } else if (foundLeft > 0) {
        for (let k = 0; k < foundLeft; k++) {
          result.push({
            type: "removed",
            text: leftLines[li + k],
            lineNum: { left: li + k + 1, right: null },
          });
        }
        li += foundLeft;
      } else {
        result.push({
          type: "removed",
          text: leftLines[li],
          lineNum: { left: li + 1, right: null },
        });
        result.push({
          type: "added",
          text: rightLines[ri],
          lineNum: { left: null, right: ri + 1 },
        });
        li++;
        ri++;
      }
    }
  }

  return result;
}

export default function DiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const diff = useMemo(() => {
    if (!left && !right) return [];
    return computeDiff(left, right);
  }, [left, right]);

  const added = diff.filter((d) => d.type === "added").length;
  const removed = diff.filter((d) => d.type === "removed").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Original</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original text..."
            className="w-full h-52 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Modified</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified text..."
            className="w-full h-52 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
        </div>
      </div>

      {diff.length > 0 && (
        <>
          <div className="flex gap-4 text-sm">
            <span className="text-green-400">+{added} added</span>
            <span className="text-red-400">-{removed} removed</span>
            <span className="text-gray-500">
              {diff.filter((d) => d.type === "unchanged").length} unchanged
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto font-mono text-sm">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`flex ${
                    line.type === "added"
                      ? "bg-green-900/20"
                      : line.type === "removed"
                        ? "bg-red-900/20"
                        : ""
                  }`}
                >
                  <span className="w-10 text-right pr-2 text-gray-400 dark:text-gray-600 select-none shrink-0 py-0.5 text-xs leading-5">
                    {line.lineNum.left ?? ""}
                  </span>
                  <span className="w-10 text-right pr-2 text-gray-400 dark:text-gray-600 select-none shrink-0 py-0.5 text-xs leading-5">
                    {line.lineNum.right ?? ""}
                  </span>
                  <span
                    className={`w-5 text-center select-none shrink-0 py-0.5 ${
                      line.type === "added"
                        ? "text-green-400"
                        : line.type === "removed"
                          ? "text-red-400"
                          : "text-gray-700"
                    }`}
                  >
                    {line.type === "added"
                      ? "+"
                      : line.type === "removed"
                        ? "-"
                        : " "}
                  </span>
                  <span
                    className={`flex-1 py-0.5 pr-4 whitespace-pre-wrap break-all ${
                      line.type === "added"
                        ? "text-green-300"
                        : line.type === "removed"
                          ? "text-red-300"
                          : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
