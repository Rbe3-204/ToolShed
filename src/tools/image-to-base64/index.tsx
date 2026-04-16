"use client";

import { useState, useRef } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageToBase64() {
  const [dataUri, setDataUri] = useState("");
  const [base64Only, setBase64Only] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit.");
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setDataUri(result);
      setBase64Only(result.split(",")[1] || "");
      setPreview(result);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const b64Size = base64Only ? new Blob([base64Only]).size : 0;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragActive ? "border-blue-400 bg-blue-900/20" : "border-gray-700 bg-gray-900 hover:border-gray-500"
        }`}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
        <svg className="w-10 h-10 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-gray-500">{fileName || "Drop an image here or click to browse"}</p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {preview && (
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex items-center justify-center">
            <img src={preview} alt="Preview" className="max-w-full max-h-48 rounded" />
          </div>
          {/* Info */}
          <div className="space-y-2 text-sm">
            <p className="text-gray-500 dark:text-gray-400">File: <span className="text-gray-900 dark:text-gray-100">{fileName}</span></p>
            <p className="text-gray-500 dark:text-gray-400">Original: <span className="text-gray-900 dark:text-gray-100">{(fileSize / 1024).toFixed(1)} KB</span></p>
            <p className="text-gray-500 dark:text-gray-400">Base64: <span className="text-gray-900 dark:text-gray-100">{(b64Size / 1024).toFixed(1)} KB</span> <span className="text-gray-500">({Math.round((b64Size / fileSize) * 100)}% of original)</span></p>
          </div>
        </div>
      )}

      {dataUri && (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Data URI</label>
              <button onClick={() => copy("uri", dataUri)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{copied === "uri" ? "Copied!" : "Copy"}</button>
            </div>
            <textarea value={dataUri} readOnly className="w-full h-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-xs text-gray-900 dark:text-gray-100 resize-none focus:outline-none" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-500 dark:text-gray-400">Base64 Only</label>
              <button onClick={() => copy("b64", base64Only)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{copied === "b64" ? "Copied!" : "Copy"}</button>
            </div>
            <textarea value={base64Only} readOnly className="w-full h-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-xs text-gray-900 dark:text-gray-100 resize-none focus:outline-none" />
          </div>
        </div>
      )}
    </div>
  );
}
