"use client";

import { useState, useRef, useEffect } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function Base64Codec() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function encode(text: string): string {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function decode(b64: string): string {
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function handleConvert() {
    setError(null);
    if (inputType === "text") {
      try {
        if (mode === "encode") {
          setOutputText(encode(inputText));
        } else {
          setOutputText(decode(inputText));
        }
      } catch (e) {
        setError((e as Error).message);
        setOutputText("");
      }
    }
  }

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (outputText?.startsWith("blob:")) {
        URL.revokeObjectURL(outputText);
      }
    };
  }, [outputText]);

  function handleFileSelect(file: File) {
    setError(null);
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit");
      return;
    }
    setFileName(file.name);

    if (mode === "encode") {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1] || result;
        setOutputText(base64);
      };
      reader.onerror = () => setError("Failed to read file");
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          const binary = atob(text.trim());
          const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
          const blob = new Blob([bytes]);
          const url = URL.createObjectURL(blob);
          setOutputText(url);
        } catch {
          setError("Invalid Base64 in file");
        }
      };
      reader.readAsText(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function handleDownload() {
    if (!outputText) return;
    if (mode === "decode" && inputType === "file" && outputText.startsWith("blob:")) {
      const a = document.createElement("a");
      a.href = outputText;
      a.download = fileName ? `decoded-${fileName}` : "decoded-file";
      a.click();
    }
  }

  async function copyOutput() {
    if (!outputText || outputText.startsWith("blob:")) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isDownloadMode = mode === "decode" && inputType === "file" && outputText.startsWith("blob:");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => { setMode("encode"); setOutputText(""); setError(null); }}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "encode"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => { setMode("decode"); setOutputText(""); setError(null); }}
            className={`px-4 py-1.5 text-sm transition-colors ${
              mode === "decode"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Decode
          </button>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => { setInputType("text"); setOutputText(""); setError(null); setFileName(null); }}
            className={`px-4 py-1.5 text-sm transition-colors ${
              inputType === "text"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Text
          </button>
          <button
            onClick={() => { setInputType("file"); setOutputText(""); setError(null); setFileName(null); }}
            className={`px-4 py-1.5 text-sm transition-colors ${
              inputType === "file"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            File
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input</label>
          {inputType === "text" ? (
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Enter Base64 string to decode..."
              }
              className="w-full h-80 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              spellCheck={false}
            />
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-80 bg-gray-900 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-blue-400 bg-blue-900/20"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
              <svg className="w-12 h-12 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {fileName ? (
                <p className="text-gray-300 text-sm">{fileName}</p>
              ) : (
                <p className="text-gray-500 text-sm">
                  Drop a file here or click to browse
                </p>
              )}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Output</label>
          {isDownloadMode ? (
            <div className="w-full h-80 bg-gray-900 border border-gray-700 rounded-lg flex flex-col items-center justify-center">
              <button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-sm transition-colors"
              >
                Download Decoded File
              </button>
            </div>
          ) : (
            <textarea
              value={outputText}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-80 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none"
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {inputType === "text" && (
          <button
            onClick={handleConvert}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
          >
            {mode === "encode" ? "Encode" : "Decode"}
          </button>
        )}
        {!isDownloadMode && (
          <button
            onClick={copyOutput}
            disabled={!outputText}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg px-4 py-1.5 text-sm transition-colors ml-auto"
          >
            {copied ? "Copied!" : "Copy Output"}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}
    </div>
  );
}
