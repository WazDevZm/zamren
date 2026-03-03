const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
  facilityName: {
    type: String,
    required: true
  },
  facilityCode: {
    type: String,
    unique: true,
    required: true
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: String,
    province: String,
    district: String
  },
  capacity: {
    total: { type: Number, required: true },
    unit: { type: String, default: 'metric_tons' },
    available: Number
  },
  storageType: {
    type: String,
    enum: ['warehouse', 'silo', 'cold_storage', 'open_yard']
  },
  inventory: [{
    produceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produce'
    },
    cropType: String,
    quantity: Number,
    binNumber: String,
    storageDate: Date,
    condition: String,
    lastInspection: Date
  }],
  manager: {
    name: String,
    phone: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

storageSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Storage', storageSchema);
