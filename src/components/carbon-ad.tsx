"use client";

import { useEffect, useRef } from "react";

export default function CarbonAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carbon Ads script injection
    // Replace CARBON_SERVE_ID and CARBON_PLACEMENT_ID with your actual IDs
    // after signing up at https://www.carbonads.net/
    const CARBON_SERVE_ID = ""; // e.g., "CEAICKJY"
    const CARBON_PLACEMENT_ID = ""; // e.g., "toolsheddev"

    const container = containerRef.current;
    if (!CARBON_SERVE_ID || !container) return;

    const script = document.createElement("script");
    script.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE_ID}&placement=${CARBON_PLACEMENT_ID}`;
    script.id = "_carbonads_js";
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="mt-6">
      <div ref={containerRef} className="carbon-ads-container">
        {/* Placeholder shown until Carbon Ads is configured */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Sponsored
          </p>
          <div className="w-full h-[100px] bg-gray-800/50 rounded flex items-center justify-center mb-2">
            <span className="text-xs text-gray-600">Ad space</span>
          </div>
          <p className="text-xs text-gray-600">
            Support ToolShed through our sponsors
          </p>
        </div>
      </div>
    </div>
  );
}
