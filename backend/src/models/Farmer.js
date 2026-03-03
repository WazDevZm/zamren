const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nationalId: {
    type: String,
    required: true,
    unique: true
  },
  biometricData: {
    fingerprint: String,
    photo: String
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    phone: { type: String, required: true },
    alternatePhone: String,
    email: String
  },
  address: {
    province: String,
    district: String,
    ward: String,
    village: String,
    chiefdom: String
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String,
    branchCode: String
  },
  mobileMoneyAccounts: [{
    provider: { type: String, enum: ['MTN', 'Airtel', 'Zamtel'] },
    phoneNumber: String,
    accountName: String
  }],
  registrationDate: {
    type: Date,
    default: Date.now
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Farmer', farmerSchema);
