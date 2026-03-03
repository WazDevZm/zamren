const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  farmName: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String
  },
  farmSize: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['hectares', 'acres'], default: 'hectares' }
  },
  crops: [{
    cropType: String,
    variety: String,
    plantingDate: Date,
    expectedHarvestDate: Date,
    area: Number
  }],
  soilType: String,
  irrigationType: {
    type: String,
    enum: ['rainfed', 'irrigated', 'mixed']
  },
  productionHistory: [{
    season: String,
    year: Number,
    crop: String,
    yield: Number,
    quality: String
  }],
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

farmSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Farm', farmSchema);
