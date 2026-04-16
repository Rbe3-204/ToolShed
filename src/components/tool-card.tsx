import Link from "next/link";
import { ToolDefinition } from "@/types/tool";
import { categories } from "@/lib/categories";

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  const cat = categories.find((c) => c.name === tool.category);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block p-5 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 hover:border-gray-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-100 group-hover:text-white transition-colors">
          {tool.name}
        </h3>
        <span
          className={`${cat?.color || "bg-gray-500"} text-white text-xs px-2 py-0.5 rounded-full shrink-0 ml-2`}
        >
          {tool.category}
        </span>
      </div>
      <p className="text-sm text-gray-400 line-clamp-2">{tool.description}</p>
    </Link>
  );
}
