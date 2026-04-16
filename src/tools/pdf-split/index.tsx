"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

function parsePageRange(range: string, maxPages: number): number[] {
  const pages: Set<number> = new Set();
  const parts = range.split(",").map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr);
      const end = parseInt(endStr);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
          pages.add(i);
        }
      }
    } else {
      const num = parseInt(part);
      if (!isNaN(num) && num >= 1 && num <= maxPages) {
        pages.add(num);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export default function PdfSplit() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [rangeInput, setRangeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPdfBytes(bytes);
      setFileName(file.name);
      setTotalPages(pdf.getPageCount());
      setRangeInput(`1-${pdf.getPageCount()}`);
    } catch {
      setError("Failed to load PDF");
    }
  }

  const selectedPages = rangeInput ? parsePageRange(rangeInput, totalPages) : [];

  async function extract() {
    if (!pdfBytes || selectedPages.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const source = await PDFDocument.load(pdfBytes);
      const output = await PDFDocument.create();
      const indices = selectedPages.map((p) => p - 1); // 0-indexed
      const pages = await output.copyPages(source, indices);
      for (const page of pages) output.addPage(page);

      const resultBytes = await output.save();
      const blob = new Blob([resultBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName.replace(".pdf", "")}-pages.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to extract pages");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Upload */}
      <label className="block w-full h-36 border-2 border-dashed border-gray-700 bg-gray-900 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
        <input type="file" accept=".pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
        <svg className="w-10 h-10 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-gray-500">{fileName || "Click to select a PDF"}</p>
      </label>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {pdfBytes && (
        <>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-900 dark:text-gray-100">{fileName}</p>
            <p className="text-xs text-gray-500">{totalPages} pages</p>
          </div>

          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Page Range</label>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1-3, 5, 7-10"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {selectedPages.length > 0
                ? `Selected: pages ${selectedPages.join(", ")} (${selectedPages.length} pages)`
                : "Enter page numbers or ranges"}
            </p>
          </div>

          <button
            onClick={extract}
            disabled={selectedPages.length === 0 || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2 text-sm transition-colors"
          >
            {loading ? "Extracting..." : `Extract ${selectedPages.length} Pages`}
          </button>
        </>
      )}
    </div>
  );
}
