import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, getAllSlugs, getRelatedTools } from "@/lib/registry";
import RelatedTools from "@/components/related-tools";
import AdUnit from "@/components/ad-unit";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};
  return {
    title: `${tool.name} \u2014 ToolShed`,
    description: tool.description,
  };
}

export default function ToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const related = getRelatedTools(params.slug);
  const Component = tool.component;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-100 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to all tools
      </Link>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">{tool.name}</h1>
          <p className="text-gray-400 mb-6">{tool.description}</p>
          <Component />
        </div>
        <aside className="w-64 shrink-0 hidden lg:block">
          <RelatedTools tools={related} />
          <AdUnit />
        </aside>
      </div>
    </div>
  );
}
