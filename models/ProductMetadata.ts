import mongoose, { Schema, model, models } from "mongoose";

export interface IProductMetadata {
  _id: mongoose.Types.ObjectId;
  product_name: string;
  description: string;
  material: string | null;
  brand: string | null;
  primary_category: string;
  sub_category: string;
  seo_tags: string[];
  sustainability_filters: string[];
  created_at: Date;
}

const ProductMetadataSchema = new Schema<IProductMetadata>(
  {
    product_name: { type: String, required: true },
    description: { type: String, required: true },
    material: { type: String, default: null },
    brand: { type: String, default: null },
    primary_category: { type: String, required: true },
    sub_category: { type: String, required: true },
    seo_tags: { type: [String], required: true, default: [] },
    sustainability_filters: { type: [String], required: true, default: [] },
    created_at: { type: Date, default: () => new Date() },
  },
  { collection: "product_metadata", timestamps: false }
);

const ProductMetadata =
  models.ProductMetadata ??
  model<IProductMetadata>("ProductMetadata", ProductMetadataSchema);

export { ProductMetadata };
