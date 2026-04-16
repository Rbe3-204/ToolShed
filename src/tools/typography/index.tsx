"use client";

import { useState, useEffect } from "react";

const FONTS = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
  "Raleway", "Nunito", "Playfair Display", "Merriweather",
  "Source Code Pro", "Fira Code", "JetBrains Mono", "IBM Plex Sans",
  "DM Sans", "Space Grotesk", "Outfit", "Sora", "Manrope", "Geist",
  "PT Sans", "Ubuntu", "Oswald", "Quicksand", "Rubik",
  "Josefin Sans", "Mulish", "Work Sans", "Barlow", "Lexend",
];

const SCALES = [
  { label: "Minor Third", ratio: 1.2 },
  { label: "Major Third", ratio: 1.25 },
  { label: "Perfect Fourth", ratio: 1.333 },
  { label: "Augmented Fourth", ratio: 1.414 },
  { label: "Perfect Fifth", ratio: 1.5 },
  { label: "Golden Ratio", ratio: 1.618 },
];

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

function loadFont(font: string) {
  const id = `font-${font.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

export default function Typography() {
  const [tab, setTab] = useState<"preview" | "scale">("preview");

  // Preview state
  const [font, setFont] = useState("Inter");
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState(400);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textColor, setTextColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#030712");
  const [previewText, setPreviewText] = useState(
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs."
  );
  const [copied, setCopied] = useState(false);

  // Scale state
  const [baseSize, setBaseSize] = useState(16);
  const [scaleRatio, setScaleRatio] = useState(1.25);

  useEffect(() => { loadFont(font); }, [font]);

  const cssOutput = `font-family: '${font}', sans-serif;
font-size: ${fontSize}px;
font-weight: ${fontWeight};
line-height: ${lineHeight};
letter-spacing: ${letterSpacing}px;
color: ${textColor};`;

  const scaleSteps = [
    { label: "h1", power: 5 },
    { label: "h2", power: 4 },
    { label: "h3", power: 3 },
    { label: "h4", power: 2 },
    { label: "h5", power: 1 },
    { label: "h6", power: 0.5 },
    { label: "body", power: 0 },
    { label: "small", power: -1 },
  ];

  const scaleSizes = scaleSteps.map(({ label, power }) => ({
    label,
    size: Math.round(baseSize * Math.pow(scaleRatio, power) * 100) / 100,
  }));

  const scaleCssVars = scaleSizes
    .map(({ label, size }) => `  --font-size-${label}: ${size}px;`)
    .join("\n");

  const scaleTailwind = scaleSizes
    .map(({ label, size }) => `    '${label}': '${size}px',`)
    .join("\n");

  async function copyValue(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 w-fit">
        <button onClick={() => setTab("preview")} className={`px-4 py-1.5 text-sm transition-colors ${tab === "preview" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
          Font Preview
        </button>
        <button onClick={() => setTab("scale")} className={`px-4 py-1.5 text-sm transition-colors ${tab === "scale" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
          Type Scale
        </button>
      </div>

      {tab === "preview" ? (
        <>
          {/* Preview box */}
          <div
            className="rounded-xl border border-gray-200 dark:border-gray-700 p-8 min-h-[200px] transition-colors"
            style={{ backgroundColor: bgColor }}
          >
            <textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full bg-transparent border-none outline-none resize-none min-h-[150px]"
              style={{
                fontFamily: `'${font}', sans-serif`,
                fontSize: `${fontSize}px`,
                fontWeight,
                lineHeight,
                letterSpacing: `${letterSpacing}px`,
                color: textColor,
              }}
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Font selector */}
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Font Family</label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {FONTS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Size</label>
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{fontSize}px</span>
                </div>
                <input type="range" min={8} max={120} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-blue-600" />
              </div>

              {/* Weight */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Weight</label>
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{fontWeight}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {WEIGHTS.map((w) => (
                    <button key={w} onClick={() => setFontWeight(w)} className={`px-2 py-1 text-xs rounded transition-colors ${fontWeight === w ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line height */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Line Height</label>
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{lineHeight}</span>
                </div>
                <input type="range" min={0.8} max={3} step={0.05} value={lineHeight} onChange={(e) => setLineHeight(parseFloat(e.target.value))} className="w-full accent-blue-600" />
              </div>

              {/* Letter spacing */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Letter Spacing</label>
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{letterSpacing}px</span>
                </div>
                <input type="range" min={-5} max={20} step={0.5} value={letterSpacing} onChange={(e) => setLetterSpacing(parseFloat(e.target.value))} className="w-full accent-blue-600" />
              </div>

              {/* Colors */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Text</label>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-7 h-7 rounded border border-gray-700 cursor-pointer bg-transparent" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">BG</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-7 h-7 rounded border border-gray-700 cursor-pointer bg-transparent" />
                </div>
              </div>
            </div>

            {/* CSS output */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">CSS</label>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <pre className="font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{cssOutput}</pre>
              </div>
              <button
                onClick={() => copyValue(cssOutput)}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-sm transition-colors w-full"
              >
                {copied ? "Copied!" : "Copy CSS"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Scale controls */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">Base Size:</label>
              <input
                type="number" min={8} max={32} value={baseSize}
                onChange={(e) => setBaseSize(parseInt(e.target.value) || 16)}
                className="w-20 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 dark:text-gray-400">Scale:</label>
              <select
                value={scaleRatio}
                onChange={(e) => setScaleRatio(parseFloat(e.target.value))}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCALES.map(({ label, ratio }) => (
                  <option key={ratio} value={ratio}>{label} ({ratio})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Font selector for scale preview */}
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Font</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Scale preview */}
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {scaleSizes.map(({ label, size }, i) => (
              <div key={label} className={`flex items-baseline gap-4 px-4 py-3 ${i !== scaleSizes.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""}`}>
                <span className="text-xs text-gray-500 w-12 shrink-0 font-mono">{label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-16 shrink-0 font-mono">{size}px</span>
                <span
                  className="text-gray-900 dark:text-gray-100 truncate"
                  style={{ fontFamily: `'${font}', sans-serif`, fontSize: `${Math.min(size, 64)}px`, lineHeight: 1.2 }}
                >
                  The quick brown fox
                </span>
              </div>
            ))}
          </div>

          {/* Export */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-500 dark:text-gray-400">CSS Variables</label>
                <button onClick={() => copyValue(`:root {\n${scaleCssVars}\n}`)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Copy</button>
              </div>
              <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-xs text-gray-900 dark:text-gray-100 overflow-x-auto">
{`:root {
${scaleCssVars}
}`}
              </pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-500 dark:text-gray-400">Tailwind Config</label>
                <button onClick={() => copyValue(`fontSize: {\n${scaleTailwind}\n}`)} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Copy</button>
              </div>
              <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 font-mono text-xs text-gray-900 dark:text-gray-100 overflow-x-auto">
{`fontSize: {
${scaleTailwind}
}`}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
