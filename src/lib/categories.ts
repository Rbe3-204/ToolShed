import { ToolCategory } from "@/types/tool";

export interface CategoryMeta {
  name: ToolCategory;
  emoji: string;
  description: string;
  color: string;
}

export const categories: CategoryMeta[] = [
  {
    name: "Text",
    emoji: "\u{1F4DD}",
    description: "Text manipulation tools",
    color: "bg-blue-500",
  },
  {
    name: "Developer",
    emoji: "\u{1F6E0}\uFE0F",
    description: "Developer productivity tools",
    color: "bg-green-500",
  },
  {
    name: "Converters",
    emoji: "\u{1F504}",
    description: "Format conversion tools",
    color: "bg-purple-500",
  },
  {
    name: "Generators",
    emoji: "\u26A1",
    description: "Generate data and identifiers",
    color: "bg-amber-500",
  },
  {
    name: "Design",
    emoji: "\u{1F3A8}",
    description: "Design and visual tools",
    color: "bg-pink-500",
  },
];
