import { ProductForm } from "@/components/ProductForm";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          AI Auto Category & Tag Generator
        </h1>
        <p className="mt-2 text-slate-600">
          Enter product details below. The AI will assign a primary category,
          suggest a sub category, generate SEO tags, and suggest sustainability
          filters—then save the result to the database.
        </p>
      </header>

      <ProductForm />
    </main>
  );
}
