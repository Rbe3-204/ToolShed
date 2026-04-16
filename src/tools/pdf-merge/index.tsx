"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

interface PdfFile {
  name: string;
  size: number;
  pages: number;
  bytes: ArrayBuffer;
}

export default function PdfMerge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList) {
    setError(null);
    const newFiles: PdfFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type !== "application/pdf") continue;
      try {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        newFiles.push({
          name: file.name,
          size: file.size,
          pages: pdf.getPageCount(),
          bytes,
        });
      } catch {
        setError(`Failed to load ${file.name}`);
      }
    }

    setFiles((prev) => [...prev, ...newFiles]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function moveFile(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  }

  async function merge() {
    if (files.length < 2) return;
    setLoading(true);
    setError(null);

    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const pdf = await PDFDocument.load(file.bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        for (const page of pages) merged.addPage(page);
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to merge PDFs");
    }

    setLoading(false);
  }

  const totalPages = files.reduce((sum, f) => sum + f.pages, 0);

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <label className="block w-full h-36 border-2 border-dashed border-gray-700 bg-gray-900 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
          className="hidden"
        />
        <svg className="w-10 h-10 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
        <p className="text-sm text-gray-500">Click or drop PDF files here</p>
      </label>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          {files.map((file, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i !== files.length - 1 ? "border-b border-gray-800" : ""}`}>
              <span className="text-sm text-gray-500 w-6 shrink-0">{i + 1}.</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-100 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{file.pages} pages &middot; {(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="text-gray-500 hover:text-gray-300 disabled:opacity-30 p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="text-gray-500 hover:text-gray-300 disabled:opacity-30 p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-400 p-1 ml-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{files.length} files &middot; {totalPages} total pages</p>
          <button
            onClick={merge}
            disabled={files.length < 2 || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2 text-sm transition-colors"
          >
            {loading ? "Merging..." : "Merge PDFs"}
          </button>
        </div>
      )}
    </div>
  );
}
