import mongoose from "mongoose";
const Schema = mongoose.Schema;
const InvoiceSchema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    number: { type: Number, required: true },
    address: { type: String, required: true },
  },
  { collection: "Invoice" }
);

InvoiceSchema.virtual("url").get(function () {
  return "/api/invoice/" + this._id;
});
export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema, "Invoice");
