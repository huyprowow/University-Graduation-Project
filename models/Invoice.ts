import mongoose from "mongoose";
const Schema = mongoose.Schema;
const InvoiceSchema = new Schema(
  {
    email: { type: String, required: true },
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    date: { type: Date, default: Date.now },
    paid: { type: Boolean,require:true},
    geolocation: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    shipment: { type: Schema.Types.ObjectId, ref: 'Shipment' },
  },
  { collection: "Invoice" }
);

InvoiceSchema.virtual("url").get(function () {
  return "/api/invoice/" + this._id;
});
export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema, "Invoice");
