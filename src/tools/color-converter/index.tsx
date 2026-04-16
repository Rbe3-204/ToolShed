"use client";

import { useState, useCallback } from "react";

interface RGB {
  r: number;
  g: number;
  b: number;
}
interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(rgb: RGB): string {
  return (
    "#" +
    [rgb.r, rgb.g, rgb.b]
      .map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState<RGB>({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState<HSL>({ h: 217, s: 91, l: 60 });
  const [copied, setCopied] = useState<string | null>(null);

  const updateFromHex = useCallback((value: string) => {
    setHex(value);
    const parsed = hexToRgb(value);
    if (parsed) {
      setRgb(parsed);
      setHsl(rgbToHsl(parsed));
    }
  }, []);

  const updateFromRgb = useCallback((newRgb: RGB) => {
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
    setHsl(rgbToHsl(newRgb));
  }, []);

  const updateFromHsl = useCallback((newHsl: HSL) => {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb));
  }, []);

  async function copyValue(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const hexDisplay = hex.startsWith("#") ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
  const rgbDisplay = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslDisplay = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div className="flex items-center gap-6">
        <div
          className="w-32 h-32 rounded-xl border-2 border-gray-700 shadow-lg"
          style={{ backgroundColor: hexDisplay }}
        />
        <div className="space-y-1">
          <p className="text-2xl font-mono font-bold text-gray-100">
            {hexDisplay}
          </p>
          <p className="text-sm text-gray-400">{rgbDisplay}</p>
          <p className="text-sm text-gray-400">{hslDisplay}</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {/* HEX */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400 w-10 shrink-0 font-semibold">
            HEX
          </label>
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            spellCheck={false}
          />
          <button
            onClick={() => copyValue("hex", hexDisplay)}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm transition-colors shrink-0"
          >
            {copied === "hex" ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* RGB */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400 w-10 shrink-0 font-semibold">
            RGB
          </label>
          <div className="flex items-center gap-2 flex-1">
            {(["r", "g", "b"] as const).map((channel) => (
              <div key={channel} className="flex items-center gap-1 flex-1">
                <span className="text-xs text-gray-500 uppercase">
                  {channel}
                </span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[channel]}
                  onChange={(e) => {
                    const val = Math.min(
                      255,
                      Math.max(0, parseInt(e.target.value) || 0)
                    );
                    updateFromRgb({ ...rgb, [channel]: val });
                  }}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => copyValue("rgb", rgbDisplay)}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm transition-colors shrink-0"
          >
            {copied === "rgb" ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* HSL */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400 w-10 shrink-0 font-semibold">
            HSL
          </label>
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1 flex-1">
              <span className="text-xs text-gray-500">H</span>
              <input
                type="number"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => {
                  const val = Math.min(
                    360,
                    Math.max(0, parseInt(e.target.value) || 0)
                  );
                  updateFromHsl({ ...hsl, h: val });
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-1 flex-1">
              <span className="text-xs text-gray-500">S</span>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) => {
                  const val = Math.min(
                    100,
                    Math.max(0, parseInt(e.target.value) || 0)
                  );
                  updateFromHsl({ ...hsl, s: val });
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-1 flex-1">
              <span className="text-xs text-gray-500">L</span>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) => {
                  const val = Math.min(
                    100,
                    Math.max(0, parseInt(e.target.value) || 0)
                  );
                  updateFromHsl({ ...hsl, l: val });
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => copyValue("hsl", hslDisplay)}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm transition-colors shrink-0"
          >
            {copied === "hsl" ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
