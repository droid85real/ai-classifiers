/**
 * Predefined primary categories. AI must select ONLY from this list.
 */
export const PRIMARY_CATEGORIES = [
  "Home & Kitchen",
  "Electronics",
  "Clothing",
  "Beauty & Personal Care",
  "Health",
  "Food & Beverages",
  "Office Supplies",
  "Toys & Games",
  "Sports & Outdoors",
  "Automotive",
] as const;

export type PrimaryCategory = (typeof PRIMARY_CATEGORIES)[number];

export function isPrimaryCategory(value: string): value is PrimaryCategory {
  return (PRIMARY_CATEGORIES as readonly string[]).includes(value);
}
