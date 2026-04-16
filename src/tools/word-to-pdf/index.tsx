"use client";

import { useState, useRef } from "react";

export default function WordToPdf() {
  const [fileName, setFileName] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  async function handleFile(file: File) {
    if (
      !file.name.endsWith(".docx") &&
      !file.type.includes("officedocument.wordprocessingml")
    ) {
      setError("Please select a .docx file.");
      return;
    }

    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch {
      setError("Failed to convert document. Make sure it's a valid .docx file.");
    }

    setLoading(false);
  }

  function downloadPdf() {
    if (!previewRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setError("Pop-up blocked. Please allow pop-ups for this site.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName.replace(".docx", "")}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 0 20px;
              line-height: 1.6;
              color: #1a1a1a;
            }
            h1 { font-size: 24px; margin-top: 24px; }
            h2 { font-size: 20px; margin-top: 20px; }
            h3 { font-size: 16px; margin-top: 16px; }
            p { margin: 8px 0; }
            table { border-collapse: collapse; width: 100%; margin: 12px 0; }
            td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
            img { max-width: 100%; }
            ul, ol { padding-left: 24px; }
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  return (
    <div className="space-y-4">
      {/* Upload */}
      <label className="block w-full h-36 border-2 border-dashed border-gray-700 bg-gray-900 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
        <input
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          className="hidden"
        />
        <svg className="w-10 h-10 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-gray-500">
          {fileName || "Click to select a .docx file"}
        </p>
      </label>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">Converting document...</p>
        </div>
      )}

      {htmlContent && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{fileName}</p>
            <button
              onClick={downloadPdf}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-sm transition-colors"
            >
              Save as PDF
            </button>
          </div>

          {/* Preview */}
          <div
            ref={previewRef}
            className="bg-white rounded-lg p-8 max-h-[600px] overflow-y-auto
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-3
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-2
              [&_p]:text-gray-800 [&_p]:mb-2 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:text-gray-800
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:text-gray-800
              [&_li]:mb-1
              [&_table]:w-full [&_table]:border-collapse [&_table]:mb-3
              [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_td]:text-gray-800
              [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_th]:bg-gray-100 [&_th]:text-gray-900 [&_th]:font-semibold
              [&_strong]:font-bold [&_em]:italic
              [&_img]:max-w-full [&_img]:rounded"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </>
      )}
    </div>
  );
}
