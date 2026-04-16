"use client";

import { useState, useRef, useCallback } from "react";

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  if (sn === 0) {
    const val = Math.round(ln * 255);
    return "#" + [val, val, val].map((c) => c.toString(16).padStart(2, "0")).join("");
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hn = h / 360;
  const r = Math.round(hue2rgb(p, q, hn + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hn) * 255);
  const b = Math.round(hue2rgb(p, q, hn - 1 / 3) * 255);
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function MiniColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (hex: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { h, s, l } = hexToHsl(color);
  const [hue, setHue] = useState(h);
  const [sat, setSat] = useState(s);
  const [bri, setBri] = useState(l);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  function updateColor(newH: number, newS: number, newL: number) {
    setHue(newH); setSat(newS); setBri(newL);
    onChange(hslToHex(newH, newS, newL));
  }

  const handleCanvas = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const newS = Math.round(x * 100);
      const newL = Math.round((1 - y) * 100);
      setSat(newS); setBri(newL);
      onChange(hslToHex(hue, newS, newL));
    },
    [hue, onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      handleCanvas(e);
      const move = (e: MouseEvent) => { if (isDragging.current) handleCanvas(e); };
      const up = () => { isDragging.current = false; window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [handleCanvas]
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg border border-gray-700 cursor-pointer hover:scale-110 transition-transform"
        style={{ backgroundColor: color }}
      />
      {open && (
        <div className="absolute bottom-10 left-0 z-50 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-2xl w-56">
          <div
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            className="relative w-full h-36 rounded-lg cursor-crosshair overflow-hidden border border-gray-700 mb-2"
            style={{
              background: `
                linear-gradient(to bottom, transparent, #000),
                linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
              `,
            }}
          >
            <div
              className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${sat}%`, top: `${100 - bri}%`, backgroundColor: color }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => updateColor(parseInt(e.target.value), sat, bri)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer mb-2"
            style={{
              background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            }}
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{color.toUpperCase()}</span>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 flex items-center justify-center min-h-[250px]">
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
                <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>
                <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">
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
              <label className="text-sm text-gray-500 dark:text-gray-400">Color</label>
              <MiniColorPicker color={color} onChange={setColor} />
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
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">CSS Code</label>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <code className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
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
