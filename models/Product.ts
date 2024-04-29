import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
      type: {
        image_url: {
          type: String,
        },
        cloudinary_public_id: {
          type: String,
        },
      },
      required: true,
    },
    status: { type: Boolean, required: true },
    number: { type: Number, required: true },
    description: { type: String },
    model: {
      type: {
        model_url: {
          type: String,
        },
        cloudinary_public_id: {
          type: String,
        },
      },
    },
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    brand: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
  },
  { collection: "Product" }
);

ProductSchema.virtual("url").get(function () {
  return "/api/product/" + this._id;
});
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema, "Product");
