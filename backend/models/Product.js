const mongoose = require('mongoose');

const UpdateSchema = new mongoose.Schema({
  location: { type: String, required: true },
  condition: { type: String, required: true },
  notes: { type: String },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  productType: { type: String, required: true },
  harvestDate: { type: Date, required: true },
  farmLocation: { type: String, required: true },
  organicCertification: { type: Boolean, default: false },
  batchNumber: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  blockchainTx: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updates: [UpdateSchema],
  currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  price: { type: Number },
  forSale: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);