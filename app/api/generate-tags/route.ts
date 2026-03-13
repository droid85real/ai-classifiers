import { NextRequest, NextResponse } from "next/server";
import { isProductInput } from "@/types/product";
import type { GenerateTagsErrorResponse } from "@/types/ai";
import { connectDB } from "@/lib/mongodb";
import { generateCategoryAndTags } from "@/lib/gemini";
import { ProductMetadata } from "@/models/ProductMetadata";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!isProductInput(body)) {
      const error: GenerateTagsErrorResponse = {
        success: false,
        error:
          "Invalid request. Required: product_name (string), description (string). Optional: material, brand (strings or null).",
        code: "VALIDATION_ERROR",
      };
      return NextResponse.json(error, { status: 400 });
    }

    const product_name = body.product_name.trim();
    const description = body.description.trim();
    const material = body.material?.trim() ?? null;
    const brand = body.brand?.trim() ?? null;

    const aiResult = await generateCategoryAndTags({
      product_name,
      description,
      material,
      brand,
    });

    await connectDB();

    const doc = await ProductMetadata.create({
      product_name,
      description,
      material,
      brand,
      primary_category: aiResult.primary_category,
      sub_category: aiResult.sub_category,
      seo_tags: aiResult.seo_tags,
      sustainability_filters: aiResult.sustainability_filters,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: doc._id.toString(),
        product_name: doc.product_name,
        description: doc.description,
        material: doc.material,
        brand: doc.brand,
        primary_category: doc.primary_category,
        sub_category: doc.sub_category,
        seo_tags: doc.seo_tags,
        sustainability_filters: doc.sustainability_filters,
        created_at: doc.created_at.toISOString(),
      },
    });
  } catch (err) {
    console.error("[generate-tags]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    const code =
      err instanceof Error && "code" in err ? String((err as { code?: string }).code) : undefined;
    const status = typeof (err as { status?: number }).status === "number" ? (err as { status: number }).status : undefined;

    if (message.includes("MONGODB") || message.includes("connection")) {
      const error: GenerateTagsErrorResponse = {
        success: false,
        error: "Database connection failed. Please try again later.",
        code: "DB_ERROR",
      };
      return NextResponse.json(error, { status: 503 });
    }

    if (status === 429 || message.includes("429") || message.includes("quota") || message.includes("RESOURCE_EXHAUSTED")) {
      const error: GenerateTagsErrorResponse = {
        success: false,
        error:
          "Gemini API quota exceeded. Wait a minute and try again, or check your plan at https://ai.google.dev/gemini-api/docs/rate-limits",
        code: "QUOTA_EXCEEDED",
      };
      return NextResponse.json(error, { status: 429 });
    }

    if (
      message.includes("Gemini") ||
      message.includes("API") ||
      message.includes("invalid") ||
      code === "ECONNREFUSED"
    ) {
      const error: GenerateTagsErrorResponse = {
        success: false,
        error: "AI service error. Please check GEMINI_API_KEY in .env.local and try again.",
        code: "AI_ERROR",
      };
      return NextResponse.json(error, { status: 502 });
    }

    const error: GenerateTagsErrorResponse = {
      success: false,
      error: message || "An unexpected error occurred",
      code: "INTERNAL_ERROR",
    };
    return NextResponse.json(error, { status: 500 });
  }
}
