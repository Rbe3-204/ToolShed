"use client";

import { useState, useCallback } from "react";

export default function PdfToImage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [scale, setScale] = useState(2);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setError(null);
    setImages([]);
    setFileName(file.name);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const rendered: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (page.render({ canvasContext: ctx, viewport } as any)).promise;
        rendered.push(canvas.toDataURL("image/png"));
      }

      setImages(rendered);
    } catch {
      setError("Failed to render PDF. The file may be corrupted or protected.");
    }

    setLoading(false);
  }, [scale]);

  function downloadImage(dataUrl: string, index: number) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${fileName.replace(".pdf", "")}-page-${index + 1}.png`;
    a.click();
  }

  function downloadAll() {
    for (let i = 0; i < images.length; i++) {
      setTimeout(() => downloadImage(images[i], i), i * 200);
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload */}
      <label className="block w-full h-36 border-2 border-dashed border-gray-700 bg-gray-900 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
        <input type="file" accept=".pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
        <svg className="w-10 h-10 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-gray-500">{fileName || "Click to select a PDF"}</p>
      </label>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-500 dark:text-gray-400">Quality:</label>
        <input
          type="range" min={1} max={4} step={0.5} value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-32 accent-blue-600"
        />
        <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{scale}x</span>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Rendering pages...</p>
        </div>
      )}

      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{images.length} pages rendered</p>
            <button
              onClick={downloadAll}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors"
            >
              Download All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <img src={img} alt={`Page ${i + 1}`} className="w-full" />
                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-800">
                  <span className="text-xs text-gray-500">Page {i + 1}</span>
                  <button
                    onClick={() => downloadImage(img, i)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
