import mongoose from "mongoose";
const Schema = mongoose.Schema;
const InvoiceSchema = new Schema(
  {
    email: { type: String, required: true },
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    date: { type: Date, default: Date.now },
    paid: { type: Boolean,require:true},
    product: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { collection: "Invoice" }
);

InvoiceSchema.virtual("url").get(function () {
  return "/api/invoice/" + this._id;
});
export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema, "Invoice");
