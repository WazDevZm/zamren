const mongoose = require('mongoose');

const produceSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  variety: String,
  harvestDate: Date,
  quantity: {
    value: { type: Number, required: true },
    unit: { type: String, default: 'kg' }
  },
  qualityGrade: {
    type: String,
    enum: ['A', 'B', 'C', 'Rejected'],
    required: true
  },
  moistureContent: Number,
  trackingCode: {
    type: String,
    unique: true,
    required: true
  },
  qrCode: String,
  collectionPoint: {
    name: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number]
    },
    collectionDate: Date
  },
  logistics: {
    vehicleId: String,
    driverId: mongoose.Schema.Types.ObjectId,
    pickupDate: Date,
    deliveryDate: Date,
    route: String,
    status: {
      type: String,
      enum: ['pending', 'collected', 'in_transit', 'delivered', 'stored'],
      default: 'pending'
    }
  },
  storage: {
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Storage'
    },
    storageDate: Date,
    binNumber: String,
    condition: String
  },
  pricing: {
    marketPrice: Number,
    finalPrice: Number,
    totalValue: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'paid'],
    default: 'pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Produce', produceSchema);
