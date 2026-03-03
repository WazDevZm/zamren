const express = require('express');
const router = express.Router();
const Produce = require('../models/Produce');
const { protect, authorize } = require('../middleware/auth');
const QRCode = require('qrcode');

// Create produce record
router.post('/', protect, async (req, res) => {
  try {
    const trackingCode = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const qrCode = await QRCode.toDataURL(trackingCode);

    const produce = await Produce.create({
      ...req.body,
      trackingCode,
      qrCode
    });

    res.status(201).json({ success: true, data: produce, qrCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update logistics status
router.patch('/:id/logistics', protect, authorize('admin', 'logistics'), async (req, res) => {
  try {
    const { status, vehicleId, driverId, pickupDate, deliveryDate, route } = req.body;
    
    const produce = await Produce.findByIdAndUpdate(
      req.params.id,
      {
        'logistics.status': status,
        'logistics.vehicleId': vehicleId,
        'logistics.driverId': driverId,
        'logistics.pickupDate': pickupDate,
        'logistics.deliveryDate': deliveryDate,
        'logistics.route': route
      },
      { new: true }
    );

    if (!produce) {
      return res.status(404).json({ success: false, message: 'Produce not found' });
    }

    res.json({ success: true, data: produce });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Track produce
router.get('/track/:trackingCode', async (req, res) => {
  try {
    const produce = await Produce.findOne({ trackingCode: req.params.trackingCode })
      .populate('farmerId')
      .populate('farmId')
      .populate('storage.facilityId');

    if (!produce) {
      return res.status(404).json({ success: false, message: 'Tracking code not found' });
    }

    res.json({ success: true, data: produce });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all produce
router.get('/', protect, async (req, res) => {
  try {
    const { farmerId, status, cropType, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (farmerId) query.farmerId = farmerId;
    if (status) query['logistics.status'] = status;
    if (cropType) query.cropType = cropType;

    const produce = await Produce.find(query)
      .populate('farmerId')
      .populate('farmId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Produce.countDocuments(query);

    res.json({
      success: true,
      data: produce,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
