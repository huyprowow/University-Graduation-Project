import mongoose from "mongoose";
const Schema = mongoose.Schema;
const BrandSchema = new Schema(
  {
    name: { type: String, required: true },
    product: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { collection: "Brand" }
);

BrandSchema.virtual("url").get(function () {
  return "/api/brand/" + this._id;
});
export default mongoose.models.Brand ||
  mongoose.model("Brand", BrandSchema, "Brand");
