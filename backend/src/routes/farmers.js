const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Register farmer
router.post('/', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const { nationalId, personalInfo, address, bankDetails, mobileMoneyAccounts, biometricData } = req.body;

    const existingFarmer = await Farmer.findOne({ nationalId });
    if (existingFarmer) {
      return res.status(400).json({ success: false, message: 'Farmer already registered' });
    }

    // Create user account
    const user = await User.create({
      email: personalInfo.email || `${nationalId}@fra.zm`,
      password: nationalId,
      role: 'farmer',
      phone: personalInfo.phone,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName
    });

    const farmer = await Farmer.create({
      userId: user._id,
      nationalId,
      personalInfo,
      address,
      bankDetails,
      mobileMoneyAccounts,
      biometricData
    });

    res.status(201).json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all farmers
router.get('/', protect, async (req, res) => {
  try {
    const { province, district, verificationStatus, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (province) query['address.province'] = province;
    if (district) query['address.district'] = district;
    if (verificationStatus) query.verificationStatus = verificationStatus;

    const farmers = await Farmer.find(query)
      .populate('userId', 'email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ registrationDate: -1 });

    const count = await Farmer.countDocuments(query);

    res.json({
      success: true,
      data: farmers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get farmer by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).populate('userId');
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update farmer
router.put('/:id', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }
    
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify farmer
router.patch('/:id/verify', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const { verificationStatus } = req.body;
    
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { verificationStatus },
      { new: true }
    );
    
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }
    
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
