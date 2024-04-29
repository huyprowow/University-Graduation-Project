import mongoose from "mongoose";
const Schema = mongoose.Schema;
const CategorySchema = new Schema(
  {
    name: { type: String, required: true},
    brand: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
  },
  { collection: "Category" }
);

CategorySchema.virtual("url").get(function () {
  return "/api/category/" + this._id;
});
export default mongoose.models.Category || mongoose.model("Category", CategorySchema, "Category");