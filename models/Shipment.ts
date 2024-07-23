import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShipmentSchema = new Schema({
  email: { type: String, required: true },
  address: { type: String, required: true },
  destinationLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  date: { type: Date, default: Date.now },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  status: { type: String, default: 'Pending' },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
}, { collection: 'Shipment' });

ShipmentSchema.index({ currentLocation: '2dsphere' });
ShipmentSchema.index({ destinationLocation: '2dsphere' });

export default mongoose.models.Shipment || mongoose.model('Shipment', ShipmentSchema);
