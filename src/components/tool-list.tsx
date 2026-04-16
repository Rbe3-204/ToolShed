"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { tools } from "@/lib/registry";
import { ToolCategory } from "@/types/tool";
import { categories } from "@/lib/categories";
import CategoryGrid from "@/components/category-grid";
import ToolCard from "@/components/tool-card";

const fuse = new Fuse(tools, {
  keys: ["name", "description", "keywords", "category"],
  threshold: 0.3,
});

export default function ToolList() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | null>(
    null
  );

  const filteredTools = useMemo(() => {
    let result = query
      ? fuse.search(query).map((r) => r.item)
      : [...tools];

    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }

    return result;
  }, [query, activeCategory]);

  function handleCategoryClick(category: ToolCategory) {
    setActiveCategory((prev) => (prev === category ? null : category));
    setQuery("");
  }

  return (
    <div className="space-y-10">
      {/* Search */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) setActiveCategory(null);
            }}
            placeholder="Search tools..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Categories
        </h2>
        <CategoryGrid onCategoryClick={handleCategoryClick} />
      </div>

      {/* Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-100">All Tools</h2>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              !activeCategory
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeCategory === cat.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No tools found{query ? ` for "${query}"` : ""}.
          </p>
        )}
      </div>
    </div>
  );
}
