const express = require('express');
const router = express.Router();
const FISP = require('../models/FISP');
const Farmer = require('../models/Farmer');
const Farm = require('../models/Farm');
const { protect, authorize } = require('../middleware/auth');
const QRCode = require('qrcode');

// Check eligibility
router.post('/check-eligibility', protect, async (req, res) => {
  try {
    const { farmerId, season, year } = req.body;
    
    const farmer = await Farmer.findById(farmerId);
    const farms = await Farm.find({ farmerId, isActive: true });
    
    if (!farmer || farms.length === 0) {
      return res.json({
        success: true,
        eligible: false,
        reason: 'No active farms found'
      });
    }

    const totalFarmSize = farms.reduce((sum, farm) => sum + farm.farmSize.value, 0);
    const previousBeneficiary = await FISP.findOne({
      farmerId,
      year: year - 1,
      eligibilityStatus: 'eligible'
    });

    const eligibilityCriteria = {
      farmSizeCheck: totalFarmSize >= 0.5 && totalFarmSize <= 20,
      previousBeneficiary: !previousBeneficiary,
      activeStatus: farmer.isActive && farmer.verificationStatus === 'verified',
      documentationComplete: !!farmer.nationalId && !!farmer.personalInfo.phone
    };

    const eligible = Object.values(eligibilityCriteria).every(v => v);

    res.json({
      success: true,
      eligible,
      eligibilityCriteria,
      totalFarmSize
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Apply for FISP
router.post('/apply', protect, async (req, res) => {
  try {
    const { farmerId, season, year } = req.body;
    
    const existing = await FISP.findOne({ farmerId, season, year });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Application already exists for this season'
      });
    }

    const fisp = await FISP.create({
      farmerId,
      season,
      year,
      eligibilityStatus: 'pending'
    });

    res.status(201).json({ success: true, data: fisp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate voucher
router.post('/:id/vouchers', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const { inputType, quantity, value, expiryDate } = req.body;
    
    const voucherCode = `FISP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const qrCode = await QRCode.toDataURL(voucherCode);

    const fisp = await FISP.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          vouchers: {
            voucherCode,
            inputType,
            quantity,
            value,
            expiryDate,
            status: 'issued'
          }
        },
        $inc: { totalValue: value }
      },
      { new: true }
    );

    if (!fisp) {
      return res.status(404).json({ success: false, message: 'FISP record not found' });
    }

    res.json({ success: true, data: fisp, qrCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Redeem voucher
router.post('/vouchers/redeem', protect, async (req, res) => {
  try {
    const { voucherCode, agrodealerId, actualQuantity } = req.body;
    
    const fisp = await FISP.findOne({ 'vouchers.voucherCode': voucherCode });
    if (!fisp) {
      return res.status(404).json({ success: false, message: 'Voucher not found' });
    }

    const voucher = fisp.vouchers.find(v => v.voucherCode === voucherCode);
    
    if (voucher.status !== 'issued') {
      return res.status(400).json({
        success: false,
        message: `Voucher already ${voucher.status}`
      });
    }

    if (new Date() > voucher.expiryDate) {
      voucher.status = 'expired';
      await fisp.save();
      return res.status(400).json({ success: false, message: 'Voucher expired' });
    }

    voucher.status = 'redeemed';
    voucher.redemptionDetails = {
      agrodealerId,
      redemptionDate: new Date(),
      actualQuantity
    };

    await fisp.save();
    res.json({ success: true, data: fisp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get FISP records
router.get('/', protect, async (req, res) => {
  try {
    const { farmerId, season, year, eligibilityStatus } = req.query;
    const query = {};
    
    if (farmerId) query.farmerId = farmerId;
    if (season) query.season = season;
    if (year) query.year = year;
    if (eligibilityStatus) query.eligibilityStatus = eligibilityStatus;

    const records = await FISP.find(query).populate('farmerId');
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
