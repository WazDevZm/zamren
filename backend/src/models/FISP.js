const mongoose = require('mongoose');

const fispSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  season: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  eligibilityStatus: {
    type: String,
    enum: ['eligible', 'ineligible', 'pending'],
    default: 'pending'
  },
  eligibilityCriteria: {
    farmSizeCheck: Boolean,
    previousBeneficiary: Boolean,
    activeStatus: Boolean,
    documentationComplete: Boolean
  },
  vouchers: [{
    voucherCode: {
      type: String,
      unique: true,
      required: true
    },
    inputType: {
      type: String,
      enum: ['seeds', 'fertilizer', 'equipment', 'pesticide'],
      required: true
    },
    quantity: Number,
    value: Number,
    issuedDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: Date,
    status: {
      type: String,
      enum: ['issued', 'redeemed', 'expired', 'cancelled'],
      default: 'issued'
    },
    redemptionDetails: {
      agrodealerId: mongoose.Schema.Types.ObjectId,
      redemptionDate: Date,
      actualQuantity: Number
    }
  }],
  totalValue: Number,
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

fispSchema.index({ farmerId: 1, season: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('FISP', fispSchema);
