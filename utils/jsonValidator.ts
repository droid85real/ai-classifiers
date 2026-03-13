import type { AIResponse } from "@/types/ai";
import { isPrimaryCategory } from "@/lib/categoryList";

const SEO_TAGS_MIN = 1;
const SEO_TAGS_MAX = 10;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/**
 * Parse raw AI response string and validate shape + business rules.
 * Returns validated AIResponse or null if invalid.
 */
export function parseAndValidateAIResponse(raw: string): AIResponse | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    try {
      parsed = JSON.parse(stripped);
    } catch {
      return null;
    }
  }

  if (typeof parsed !== "object" || parsed === null) return null;
  const o = parsed as Record<string, unknown>;

  const primary_category = o.primary_category;
  if (typeof primary_category !== "string" || !isPrimaryCategory(primary_category)) {
    return null;
  }

  const sub_category = o.sub_category;
  if (typeof sub_category !== "string" || !sub_category.trim()) {
    return null;
  }

  const seo_tags = o.seo_tags;
  if (!isStringArray(seo_tags)) return null;
  const tagsFiltered = seo_tags
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter(Boolean);
  if (tagsFiltered.length < SEO_TAGS_MIN || tagsFiltered.length > SEO_TAGS_MAX) {
    return null;
  }

  const sustainability_filters = o.sustainability_filters;
  if (!Array.isArray(sustainability_filters)) return null;
  const filtersFiltered = sustainability_filters
    .filter((f): f is string => typeof f === "string")
    .map((f) => f.trim())
    .filter(Boolean);

  return {
    primary_category,
    sub_category: sub_category.trim(),
    seo_tags: tagsFiltered,
    sustainability_filters: filtersFiltered,
  };
}
