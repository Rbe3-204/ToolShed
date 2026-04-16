import ToolList from "@/components/tool-list";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
          ToolShed
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Free, open-source developer utilities.
          <br />
          100% client-side &mdash; nothing leaves your browser.
        </p>
      </div>

      <ToolList />
    </div>
  );
}
