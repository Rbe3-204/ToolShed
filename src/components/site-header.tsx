import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold text-gray-100">ToolShed</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
          >
            All Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
