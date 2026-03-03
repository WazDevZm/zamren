const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  paymentType: {
    type: String,
    enum: ['produce_payment', 'subsidy', 'bonus', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ZMW'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'mobile_money', 'cash', 'digital_wallet'],
    required: true
  },
  paymentDetails: {
    provider: String,
    accountNumber: String,
    phoneNumber: String,
    reference: String
  },
  produceDetails: {
    produceId: mongoose.Schema.Types.ObjectId,
    cropType: String,
    quantity: Number,
    pricePerUnit: Number,
    qualityGrade: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  gatewayResponse: mongoose.Schema.Types.Mixed,
  receipt: {
    receiptNumber: String,
    receiptUrl: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  completedAt: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
