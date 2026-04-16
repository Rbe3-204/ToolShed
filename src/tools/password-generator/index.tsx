"use client";

import { useState, useCallback } from "react";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generatePassword(
  length: number,
  useLowercase: boolean,
  useUppercase: boolean,
  useNumbers: boolean,
  useSymbols: boolean
): string {
  let chars = "";
  if (useLowercase) chars += LOWERCASE;
  if (useUppercase) chars += UPPERCASE;
  if (useNumbers) chars += NUMBERS;
  if (useSymbols) chars += SYMBOLS;
  if (!chars) chars = LOWERCASE;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => chars[n % chars.length]).join("");
}

function getStrength(password: string): {
  label: string;
  color: string;
  width: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (score <= 3) return { label: "Fair", color: "bg-yellow-500", width: "w-2/4" };
  if (score <= 4) return { label: "Strong", color: "bg-blue-500", width: "w-3/4" };
  return { label: "Very Strong", color: "bg-green-500", width: "w-full" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [lowercase, setLowercase] = useState(true);
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setPassword(
      generatePassword(length, lowercase, uppercase, numbers, symbols)
    );
    setCopied(false);
  }, [length, lowercase, uppercase, numbers, symbols]);

  async function copyPassword() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const strength = password ? getStrength(password) : null;

  return (
    <div className="space-y-4">
      {/* Output */}
      {password && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <code className="font-mono text-lg text-gray-100 flex-1 break-all select-all">
              {password}
            </code>
            <button
              onClick={copyPassword}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 text-sm transition-colors shrink-0"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {strength && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Strength</span>
                <span className="text-xs text-gray-400">{strength.label}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${strength.color} ${strength.width}`}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">
              Length: <span className="text-gray-100 font-semibold">{length}</span>
            </label>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Lowercase (a-z)", checked: lowercase, set: setLowercase },
            { label: "Uppercase (A-Z)", checked: uppercase, set: setUppercase },
            { label: "Numbers (0-9)", checked: numbers, set: setNumbers },
            { label: "Symbols (!@#$)", checked: symbols, set: setSymbols },
          ].map(({ label, checked, set }) => (
            <label
              key={label}
              className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => set(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              {label}
            </label>
          ))}
        </div>

        <button
          onClick={generate}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-sm transition-colors w-full"
        >
          Generate Password
        </button>
      </div>
    </div>
  );
}
