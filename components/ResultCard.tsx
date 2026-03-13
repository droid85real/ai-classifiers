"use client";

import { TagBadge } from "./TagBadge";

export interface ResultData {
  primary_category: string;
  sub_category: string;
  seo_tags: string[];
  sustainability_filters: string[];
}

interface ResultCardProps {
  data: ResultData;
}

export function ResultCard({ data }: ResultCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Classification result
      </h2>

      <div className="space-y-4">
        <div>
          <span className="text-sm font-medium text-slate-500">
            Primary category
          </span>
          <p className="mt-0.5 text-slate-900">{data.primary_category}</p>
        </div>

        <div>
          <span className="text-sm font-medium text-slate-500">
            Sub category
          </span>
          <p className="mt-0.5 text-slate-900">{data.sub_category}</p>
        </div>

        <div>
          <span className="text-sm font-medium text-slate-500">SEO tags</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.seo_tags.map((tag) => (
              <TagBadge key={tag} label={tag} variant="seo" />
            ))}
          </div>
        </div>

        {data.sustainability_filters.length > 0 && (
          <div>
            <span className="text-sm font-medium text-slate-500">
              Sustainability filters
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.sustainability_filters.map((filter) => (
                <TagBadge key={filter} label={filter} variant="sustainability" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
