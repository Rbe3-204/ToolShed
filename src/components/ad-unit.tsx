"use client";

import { useEffect } from "react";

export default function AdUnit() {
  useEffect(() => {
    try {
      ((window as unknown as Record<string, unknown[]>).adsbygoogle =
        (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded (e.g., ad blocker)
    }
  }, []);

  return (
    <div className="mt-6">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2586936095307690"
        data-ad-slot=""
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
