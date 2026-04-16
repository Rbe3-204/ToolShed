"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#030712");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl("");
      setError(null);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(
      canvas,
      text,
      {
        width: size,
        color: { dark: fgColor, light: bgColor },
        margin: 2,
      },
      (err) => {
        if (err) {
          setError("Failed to generate QR code");
          setDataUrl("");
        } else {
          setError(null);
          setDataUrl(canvas.toDataURL("image/png"));
        }
      }
    );
  }, [text, size, fgColor, bgColor]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Text or URL</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL to encode..."
          className="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Size:</label>
          <input
            type="range" min={128} max={512} step={32} value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-32 accent-blue-600"
          />
          <span className="text-sm text-gray-100 font-mono w-12">{size}px</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">FG:</label>
          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-7 h-7 rounded border border-gray-700 cursor-pointer bg-transparent" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">BG:</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-7 h-7 rounded border border-gray-700 cursor-pointer bg-transparent" />
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      <div className="flex flex-col items-center gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 inline-block">
          <canvas ref={canvasRef} className={text.trim() ? "" : "hidden"} />
          {!text.trim() && (
            <div className="w-48 h-48 flex items-center justify-center text-gray-600 text-sm">
              Enter text to generate QR code
            </div>
          )}
        </div>
        {dataUrl && (
          <button onClick={download} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-sm transition-colors">
            Download PNG
          </button>
        )}
      </div>
    </div>
  );
}
