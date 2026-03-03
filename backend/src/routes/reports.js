const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const Farm = require('../models/Farm');
const Payment = require('../models/Payment');
const Produce = require('../models/Produce');
const FISP = require('../models/FISP');
const { protect, authorize } = require('../middleware/auth');
const { Parser } = require('json2csv');

// Dashboard statistics
router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalFarmers = await Farmer.countDocuments({ isActive: true });
    const verifiedFarmers = await Farmer.countDocuments({ verificationStatus: 'verified' });
    const totalFarms = await Farm.countDocuments({ isActive: true });
    const totalPayments = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const produceInTransit = await Produce.countDocuments({ 'logistics.status': 'in_transit' });
    const fispBeneficiaries = await FISP.countDocuments({ eligibilityStatus: 'eligible' });

    const farmersByProvince = await Farmer.aggregate([
      { $group: { _id: '$address.province', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalFarmers,
        verifiedFarmers,
        totalFarms,
        totalPaymentsAmount: totalPayments[0]?.total || 0,
        pendingPayments,
        produceInTransit,
        fispBeneficiaries,
        farmersByProvince
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export farmers to CSV
router.get('/farmers/export', protect, authorize('admin'), async (req, res) => {
  try {
    const farmers = await Farmer.find().populate('userId');
    
    const fields = [
      'nationalId',
      'personalInfo.firstName',
      'personalInfo.lastName',
      'personalInfo.phone',
      'address.province',
      'address.district',
      'verificationStatus',
      'registrationDate'
    ];
    
    const parser = new Parser({ fields });
    const csv = parser.parse(farmers);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('farmers.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Payment report
router.get('/payments', protect, authorize('admin', 'finance'), async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (status) query.status = status;

    const payments = await Payment.find(query).populate('farmerId');
    
    const summary = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({ success: true, data: { payments, summary } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
