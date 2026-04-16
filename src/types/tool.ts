import { ComponentType } from "react";

export type ToolCategory =
  | "Text"
  | "Developer"
  | "Converters"
  | "Generators"
  | "Design";

export interface ToolDefinition {
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  component: ComponentType;
}
