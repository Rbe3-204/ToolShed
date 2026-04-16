"use client";

import { categories } from "@/lib/categories";
import { tools } from "@/lib/registry";
import { ToolCategory } from "@/types/tool";

export default function CategoryGrid({
  onCategoryClick,
}: {
  onCategoryClick?: (category: ToolCategory) => void;
}) {
  const toolCounts = categories.reduce(
    (acc, cat) => {
      acc[cat.name] = tools.filter((t) => t.category === cat.name).length;
      return acc;
    },
    {} as Record<ToolCategory, number>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onCategoryClick?.(cat.name)}
          className={`p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left`}
        >
          <span className="text-2xl">{cat.emoji}</span>
          <p className="font-medium text-gray-900 dark:text-gray-100 mt-2 text-sm">{cat.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {toolCounts[cat.name]} tool{toolCounts[cat.name] !== 1 ? "s" : ""}
          </p>
        </button>
      ))}
    </div>
  );
}
