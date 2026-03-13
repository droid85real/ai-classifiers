"use client";

import { useState, useTransition } from "react";
import type { ResultData } from "./ResultCard";
import { ResultCard } from "./ResultCard";

interface GenerateTagsSuccessData {
  id: string;
  product_name: string;
  description: string;
  material: string | null;
  brand: string | null;
  primary_category: string;
  sub_category: string;
  seo_tags: string[];
  sustainability_filters: string[];
  created_at: string;
}

export function ProductForm() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [brand, setBrand] = useState("");
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/generate-tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_name: productName.trim(),
            description: description.trim(),
            material: material.trim() || null,
            brand: brand.trim() || null,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Something went wrong");
          return;
        }

        if (data.success && data.data) {
          const d: GenerateTagsSuccessData = data.data;
          setResult({
            primary_category: d.primary_category,
            sub_category: d.sub_category,
            seo_tags: d.seo_tags,
            sustainability_filters: d.sustainability_filters,
          });
        } else {
          setError("Invalid response from server");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      }
    });
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Product information
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="product_name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Product name <span className="text-red-500">*</span>
            </label>
            <input
              id="product_name"
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="e.g. Bamboo Toothbrush"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Eco-friendly toothbrush made from biodegradable bamboo..."
            />
          </div>

          <div>
            <label
              htmlFor="material"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Material (optional)
            </label>
            <input
              id="material"
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="e.g. Bamboo, BPA-free bristles"
            />
          </div>

          <div>
            <label
              htmlFor="brand"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Brand (optional)
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Brand name"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition hover:bg-primary-700 disabled:opacity-60 sm:w-auto sm:min-w-[160px]"
          >
            {isPending ? "Generating…" : "Generate categories & tags"}
          </button>
        </div>
      </form>

      {result && (
        <ResultCard data={result} />
      )}
    </div>
  );
}
