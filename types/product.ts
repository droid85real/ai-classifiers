/**
 * User input for product classification request
 */
export interface ProductInput {
  product_name: string;
  description: string;
  material?: string | null;
  brand?: string | null;
}

/**
 * Stored document shape (e.g. API response or DB view)
 */
export interface ProductDocument {
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

/**
 * Product input validation - all required fields present
 */
export function isProductInput(body: unknown): body is ProductInput {
  if (typeof body !== "object" || body === null) return false;
  const o = body as Record<string, unknown>;
  return (
    typeof o.product_name === "string" &&
    o.product_name.trim().length > 0 &&
    typeof o.description === "string" &&
    o.description.trim().length > 0 &&
    (o.material === undefined ||
      o.material === null ||
      typeof o.material === "string") &&
    (o.brand === undefined || o.brand === null || typeof o.brand === "string")
  );
}
