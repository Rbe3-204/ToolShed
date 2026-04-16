import Link from "next/link";
import { ToolDefinition } from "@/types/tool";
import { categories } from "@/lib/categories";

export default function RelatedTools({ tools }: { tools: ToolDefinition[] }) {
  if (tools.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Related Tools
      </h3>
      <div className="space-y-2">
        {tools.map((tool) => {
          const cat = categories.find((c) => c.name === tool.category);
          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="block p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{tool.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {cat?.emoji} {tool.category}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
