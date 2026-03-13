# AI Auto Category & Tag Generator

A full-stack application that automatically classifies products and generates SEO metadata using **Google Gemini AI**. Users submit product information; the system assigns a primary category, suggests a sub category, generates 5–10 SEO tags, suggests sustainability filters, and stores the result in **MongoDB**.

<br />
<br />

## 🎥 Demo


![Demo](demo/ai-classifiers.gif)

<br />

### Watch on youtube

[![Watch the demo](https://img.youtube.com/vi/3lgJ0VO1g_M/0.jpg)](https://youtu.be/3lgJ0VO1g_M)

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, React Server Components
- **Backend:** Next.js API routes, TypeScript
- **Database:** MongoDB with Mongoose
- **AI:** Google Gemini API

## Features

- Product form: name, description, material (optional), brand (optional)
- AI-driven classification with a **predefined primary category list**
- Structured JSON output: `primary_category`, `sub_category`, `seo_tags`, `sustainability_filters`
- Results persisted in MongoDB
- Reusable UI components and clear error handling

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Google Gemini API key](https://aistudio.google.com/apikey)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example env file and set your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

- **MONGODB_URI** – Your MongoDB connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority` for Atlas).
- **GEMINI_API_KEY** – Your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Submit a product (e.g. name: **Bamboo Toothbrush**, description: **Eco-friendly toothbrush made from biodegradable bamboo with soft BPA-free bristles.**). The AI will return categories, SEO tags, and sustainability filters, and the result will be saved to MongoDB.

## MongoDB setup

- **Local:** Install MongoDB and use e.g. `MONGODB_URI=mongodb://localhost:27017/ai-tag-generator`.
- **Atlas:** Create a cluster, get the connection string, and set it as `MONGODB_URI`. Ensure your IP is allowed in Network Access and the database user has read/write permissions.

The app uses a collection named `product_metadata` (created automatically by Mongoose).

## Gemini API integration

- The app uses **Gemini** (via `@google/genai`) to turn product name, description, material, and brand into structured JSON.
- The prompt instructs the model to:
  - Choose **primary_category** only from the predefined list (Home & Kitchen, Electronics, Clothing, etc.).
  - Suggest a **sub_category** (e.g. Oral Care).
  - Generate **5–10 SEO tags**.
  - Suggest **sustainability_filters** (e.g. plastic-free, biodegradable, eco-friendly) when relevant.
- The API route requests JSON-only output, then validates and normalizes the response (including primary category) before saving to MongoDB.

## Project structure

```
/app
  /api/generate-tags
    route.ts          # POST handler: validate → Gemini → validate → MongoDB → response
  page.tsx            # Main page with ProductForm
  layout.tsx
  globals.css
/components
  ProductForm.tsx     # Form + submit → /api/generate-tags, shows ResultCard
  ResultCard.tsx      # Displays primary/sub category, SEO tags, sustainability filters
  TagBadge.tsx        # Reusable tag chip (seo / sustainability)
/lib
  mongodb.ts          # Mongoose connection (cached)
  gemini.ts           # Gemini client + prompt + generateCategoryAndTags()
  categoryList.ts     # PRIMARY_CATEGORIES and type guard
/models
  ProductMetadata.ts  # Mongoose schema
/types
  ai.ts               # AIResponse, API response types
  product.ts          # ProductInput, isProductInput
/utils
  jsonValidator.ts    # Parse and validate AI JSON (primary category, 5–10 tags)
```

## API

### `POST /api/generate-tags`

**Body (JSON):**

```json
{
  "product_name": "string (required)",
  "description": "string (required)",
  "material": "string | null (optional)",
  "brand": "string | null (optional)"
}
```

**Success (200):**

```json
{
  "success": true,
  "data": {
    "id": "mongodb_id",
    "product_name": "...",
    "description": "...",
    "material": null,
    "brand": null,
    "primary_category": "Health",
    "sub_category": "Oral Care",
    "seo_tags": ["bamboo toothbrush", "eco friendly toothbrush", ...],
    "sustainability_filters": ["plastic-free", "biodegradable", "eco-friendly"],
    "created_at": "2025-03-11T..."
  }
}
```

**Error (4xx/5xx):**

```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "VALIDATION_ERROR | DB_ERROR | AI_ERROR | INTERNAL_ERROR"
}
```

## Error handling

- **Validation:** Missing or invalid `product_name` / `description` → 400 with `VALIDATION_ERROR`.
- **Invalid JSON from AI:** Treated as AI error → 502 and optional retry.
- **Gemini API errors:** 502 with `AI_ERROR`; ensure `GEMINI_API_KEY` is set and valid.
- **MongoDB connection issues:** 503 with `DB_ERROR`; check `MONGODB_URI` and network.

## Scripts

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run start` – Run production server
- `npm run lint` – Run ESLint

## License

MIT
