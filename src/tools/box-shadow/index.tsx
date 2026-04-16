"use client";

import { useState } from "react";

export default function BoxShadowGenerator() {
  const [offsetX, setOffsetX] = useState(5);
  const [offsetY, setOffsetY] = useState(5);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(40);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  function hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const shadowColor = hexToRgba(color, opacity / 100);
  const shadowValue = `${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowColor}`;
  const cssCode = `box-shadow: ${shadowValue};`;

  async function copyCSS() {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const sliders = [
    { label: "Offset X", value: offsetX, set: setOffsetX, min: -50, max: 50 },
    { label: "Offset Y", value: offsetY, set: setOffsetY, min: -50, max: 50 },
    { label: "Blur", value: blur, set: setBlur, min: 0, max: 100 },
    { label: "Spread", value: spread, set: setSpread, min: -50, max: 50 },
    { label: "Opacity", value: opacity, set: setOpacity, min: 0, max: 100, suffix: "%" },
  ];

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 flex items-center justify-center min-h-[250px]">
        <div
          className="w-48 h-48 bg-gray-100 rounded-xl transition-shadow duration-200"
          style={{ boxShadow: shadowValue }}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {sliders.map(({ label, value, set, min, max, suffix }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-400">{label}</label>
                <span className="text-sm text-gray-100 font-mono">
                  {value}{suffix || "px"}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => set(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          ))}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded border border-gray-700 cursor-pointer bg-transparent"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              Inset
            </label>
          </div>
        </div>

        {/* CSS Output */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">CSS Code</label>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <code className="font-mono text-sm text-gray-100 break-all">
              {cssCode}
            </code>
          </div>
          <button
            onClick={copyCSS}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors w-full"
          >
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
      </div>
    </div>
  );
}
