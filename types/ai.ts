/**
 * Expected JSON structure from Gemini AI response
 */
export interface AIResponse {
  primary_category: string;
  sub_category: string;
  seo_tags: string[];
  sustainability_filters: string[];
}

/**
 * API success response shape
 */
export interface GenerateTagsSuccessResponse {
  success: true;
  data: AIResponse & {
    product_name: string;
    description: string;
    material: string | null;
    brand: string | null;
    created_at: string;
    id: string;
  };
}

/**
 * API error response shape
 */
export interface GenerateTagsErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type GenerateTagsResponse =
  | GenerateTagsSuccessResponse
  | GenerateTagsErrorResponse;
