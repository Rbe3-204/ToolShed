"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

function hslToRgb(h: number, s: number, l: number): RGB {
  const sn = s / 100, ln = l / 100;
  if (sn === 0) { const val = Math.round(ln * 255); return { r: val, g: val, b: val }; }
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
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

// --- Mini picker used in gradient tab ---
function MiniPicker({
  color,
  onChange,
  label,
}: {
  color: string;
  onChange: (hex: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const parsed = hexToRgb(color);
  const initHsl = parsed ? rgbToHsl(parsed.r, parsed.g, parsed.b) : { h: 0, s: 0, l: 50 };
  const [hue, setHue] = useState(initHsl.h);
  const [sat, setSat] = useState(initHsl.s);
  const [bri, setBri] = useState(initHsl.l);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  function update(h: number, s: number, l: number) {
    setHue(h); setSat(s); setBri(l);
    const rgb = hslToRgb(h, s, l);
    onChange(rgbToHex(rgb.r, rgb.g, rgb.b));
  }

  const handleCanvas = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const newS = Math.round(x * 100), newL = Math.round((1 - y) * 100);
    setSat(newS); setBri(newL);
    const rgb = hslToRgb(hue, newS, newL);
    onChange(rgbToHex(rgb.r, rgb.g, rgb.b));
  }, [hue, onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    handleCanvas(e);
    const move = (e: MouseEvent) => { if (isDragging.current) handleCanvas(e); };
    const up = () => { isDragging.current = false; window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }, [handleCanvas]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded-lg border border-gray-700 cursor-pointer hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => {
            onChange(e.target.value);
            const p = hexToRgb(e.target.value);
            if (p) { const h = rgbToHsl(p.r, p.g, p.b); setHue(h.h); setSat(h.s); setBri(h.l); }
          }}
          className="w-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 font-mono text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>
      {open && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
          <div
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            className="relative w-full h-28 rounded cursor-crosshair overflow-hidden border border-gray-700 mb-2"
            style={{ background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))` }}
          >
            <div
              className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${sat}%`, top: `${100 - bri}%`, backgroundColor: color }}
            />
          </div>
          <input
            type="range" min={0} max={360} value={hue}
            onChange={(e) => update(parseInt(e.target.value), sat, bri)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)" }}
          />
        </div>
      )}
    </div>
  );
}

// --- Gradient directions ---
const DIRECTIONS = [
  { label: "Right", value: "to right" },
  { label: "Left", value: "to left" },
  { label: "Bottom", value: "to bottom" },
  { label: "Top", value: "to top" },
  { label: "BR", value: "to bottom right" },
  { label: "BL", value: "to bottom left" },
  { label: "Radial", value: "radial" },
] as const;

export default function ColorPicker() {
  const [tab, setTab] = useState<"picker" | "gradient">("picker");

  // Picker state
  const [hue, setHue] = useState(217);
  const [saturation, setSaturation] = useState(90);
  const [brightness, setBrightness] = useState(70);
  const [hexInput, setHexInput] = useState("#3B82F6");
  const [copied, setCopied] = useState<string | null>(null);
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog");
  const [previewBgDark, setPreviewBgDark] = useState(true);

  // Load saved colors from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("toolshed-saved-colors");
    if (stored) {
      try { setSavedColors(JSON.parse(stored)); } catch {}
    }
  }, []);

  // Gradient state
  const [gradColor1, setGradColor1] = useState("#3B82F6");
  const [gradColor2, setGradColor2] = useState("#8B5CF6");
  const [gradDirection, setGradDirection] = useState("to right");

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const rgb = hslToRgb(hue, saturation, brightness);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  useEffect(() => { setHexInput(hex); }, [hex]);

  function setFromHex(value: string) {
    setHexInput(value);
    const parsed = hexToRgb(value);
    if (parsed) {
      const newHsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
      setHue(newHsl.h); setSaturation(newHsl.s); setBrightness(newHsl.l);
    }
  }

  function setFromRgb(r: number, g: number, b: number) {
    const newHsl = rgbToHsl(r, g, b);
    setHue(newHsl.h); setSaturation(newHsl.s); setBrightness(newHsl.l);
  }

  function setFromHsl(h: number, s: number, l: number) {
    setHue(h); setSaturation(s); setBrightness(l);
  }

  const handleCanvasInteraction = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setSaturation(Math.round(x * 100));
    setBrightness(Math.round((1 - y) * 100));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    handleCanvasInteraction(e);
    const move = (e: MouseEvent) => { if (isDragging.current) handleCanvasInteraction(e); };
    const up = () => { isDragging.current = false; window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }, [handleCanvasInteraction]);

  function saveColor() {
    if (!savedColors.includes(hex)) {
      const updated = [...savedColors, hex];
      setSavedColors(updated);
      localStorage.setItem("toolshed-saved-colors", JSON.stringify(updated));
    }
  }

  function deleteColor(c: string) {
    const updated = savedColors.filter((s) => s !== c);
    setSavedColors(updated);
    localStorage.setItem("toolshed-saved-colors", JSON.stringify(updated));
  }

  async function copyValue(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hue}, ${saturation}%, ${brightness}%)`;

  const gradientCSS = gradDirection === "radial"
    ? `background: radial-gradient(circle, ${gradColor1}, ${gradColor2});`
    : `background: linear-gradient(${gradDirection}, ${gradColor1}, ${gradColor2});`;
  const gradientStyle = gradDirection === "radial"
    ? `radial-gradient(circle, ${gradColor1}, ${gradColor2})`
    : `linear-gradient(${gradDirection}, ${gradColor1}, ${gradColor2})`;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-gray-700 w-fit">
        <button
          onClick={() => setTab("picker")}
          className={`px-4 py-1.5 text-sm transition-colors ${tab === "picker" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
        >
          Color Picker
        </button>
        <button
          onClick={() => setTab("gradient")}
          className={`px-4 py-1.5 text-sm transition-colors ${tab === "gradient" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
        >
          Gradient
        </button>
      </div>

      {tab === "picker" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">
            <div className="space-y-3">
              <div
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                className="relative w-full h-64 rounded-lg cursor-crosshair overflow-hidden border border-gray-700"
                style={{ background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))` }}
              >
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: `${saturation}%`, top: `${100 - brightness}%`, backgroundColor: hex }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Hue</label>
                <input
                  type="range" min={0} max={360} value={hue}
                  onChange={(e) => setHue(parseInt(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{ background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)" }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="w-full h-32 rounded-xl border-2 border-gray-700 shadow-lg" style={{ backgroundColor: hex }} />
              <button onClick={saveColor} className="w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 text-sm transition-colors">
                Save Color
              </button>
              {savedColors.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {savedColors.map((c) => (
                    <div key={c} className="relative group">
                      <button onClick={() => setFromHex(c)} className="w-7 h-7 rounded-md border border-gray-700 hover:scale-110 transition-transform" style={{ backgroundColor: c }} title={c} />
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteColor(c); }}
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Text preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-500 dark:text-gray-400">Text Preview</label>
              <button
                onClick={() => setPreviewBgDark(!previewBgDark)}
                className="text-xs px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                {previewBgDark ? "Light BG" : "Dark BG"}
              </button>
            </div>
            <div className={`${previewBgDark ? "bg-gray-900" : "bg-white"} border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-colors`}>
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-lg font-medium"
                style={{ color: hex }}
                placeholder="Type to preview color..."
              />
            </div>
          </div>

          {/* Editable values */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-10 shrink-0 font-semibold">HEX</span>
              <input type="text" value={hexInput} onChange={(e) => setFromHex(e.target.value)} className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" spellCheck={false} />
              <button onClick={() => copyValue("hex", hex.toUpperCase())} className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm transition-colors shrink-0">{copied === "hex" ? "Copied!" : "Copy"}</button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-10 shrink-0 font-semibold">RGB</span>
              <div className="flex items-center gap-2 flex-1">
                {(["r", "g", "b"] as const).map((ch) => (
                  <div key={ch} className="flex items-center gap-1 flex-1">
                    <span className="text-xs text-gray-500 uppercase">{ch}</span>
                    <input type="number" min={0} max={255} value={rgb[ch]} onChange={(e) => { const val = Math.min(255, Math.max(0, parseInt(e.target.value) || 0)); const newRgb = { ...rgb, [ch]: val }; setFromRgb(newRgb.r, newRgb.g, newRgb.b); }} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                ))}
              </div>
              <button onClick={() => copyValue("rgb", rgbString)} className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm transition-colors shrink-0">{copied === "rgb" ? "Copied!" : "Copy"}</button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-10 shrink-0 font-semibold">HSL</span>
              <div className="flex items-center gap-2 flex-1">
                {([{ key: "h", max: 360, val: hue }, { key: "s", max: 100, val: saturation }, { key: "l", max: 100, val: brightness }] as const).map(({ key, max, val }) => (
                  <div key={key} className="flex items-center gap-1 flex-1">
                    <span className="text-xs text-gray-500 uppercase">{key}</span>
                    <input type="number" min={0} max={max} value={val} onChange={(e) => { const v = Math.min(max, Math.max(0, parseInt(e.target.value) || 0)); setFromHsl(key === "h" ? v : hue, key === "s" ? v : saturation, key === "l" ? v : brightness); }} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                ))}
              </div>
              <button onClick={() => copyValue("hsl", hslString)} className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm transition-colors shrink-0">{copied === "hsl" ? "Copied!" : "Copy"}</button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Gradient tab */}
          <div className="w-full h-48 rounded-xl border-2 border-gray-700 shadow-lg" style={{ background: gradientStyle }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <MiniPicker color={gradColor1} onChange={setGradColor1} label="Color 1" />
              <MiniPicker color={gradColor2} onChange={setGradColor2} label="Color 2" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm text-gray-500 dark:text-gray-400">Direction</label>
              <div className="flex flex-wrap gap-2">
                {DIRECTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setGradDirection(value)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${gradDirection === value ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-700"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CSS output */}
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">CSS Code</label>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <code className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">{gradientCSS}</code>
            </div>
            <button
              onClick={() => copyValue("gradient", gradientCSS)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors w-full"
            >
              {copied === "gradient" ? "Copied!" : "Copy CSS"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
