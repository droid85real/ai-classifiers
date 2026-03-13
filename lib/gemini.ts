// import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIResponse } from "@/types/ai";
import { PRIMARY_CATEGORIES } from "@/lib/categoryList";
import { parseAndValidateAIResponse } from "@/utils/jsonValidator";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Please define the GEMINI_API_KEY environment variable inside .env.local"
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

const CATEGORY_LIST_STR = JSON.stringify(PRIMARY_CATEGORIES);

const PROMPT_TEMPLATE = `You are an ecommerce AI classification engine.

Analyze the product information and produce structured JSON.

Rules:
- Select primary_category ONLY from the provided category list (exactly one of these, no other value): ${CATEGORY_LIST_STR}
- Suggest a relevant sub_category (short, e.g. "Oral Care", "Kitchen Appliances")
- Generate 5 to 10 SEO tags (lowercase, hyphenated or single words, relevant to the product)
- Suggest sustainability filters if applicable from: plastic-free, compostable, biodegradable, vegan, recycled, eco-friendly. Use empty array if none apply.

Return ONLY valid JSON in this exact shape, no markdown, no code block, no extra text:
{"primary_category":"string","sub_category":"string","seo_tags":["string"],"sustainability_filters":["string"]}

Product information:
`;

export interface ProductInfoForPrompt {
  product_name: string;
  description: string;
  material?: string | null;
  brand?: string | null;
}

function buildPrompt(input: ProductInfoForPrompt): string {
  const lines = [
    `Product Name: ${input.product_name}`,
    `Description: ${input.description}`,
  ];
  if (input.material?.trim()) {
    lines.push(`Material: ${input.material}`);
  }
  if (input.brand?.trim()) {
    lines.push(`Brand: ${input.brand}`);
  }
  return PROMPT_TEMPLATE + lines.join("\n");
}

export async function generateCategoryAndTags(
  input: ProductInfoForPrompt
): Promise<AIResponse> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
    }
  })
  
  const prompt = buildPrompt(input);

  const result = await model.generateContent(prompt);
  const response = result.response;
  const rawText = response.text(); // This returns the text directly


  // Clean possible markdown fences (even with responseMimeType, sometimes the model wraps in ```json)
  const cleanedText = rawText
    .replace(/^```json\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  const parsed = parseAndValidateAIResponse(cleanedText);
  if (!parsed) {
    throw new Error("Gemini response was not valid JSON or failed validation");
  }

  return parsed;
}
