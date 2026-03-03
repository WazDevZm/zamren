const express = require('express');
const router = express.Router();
const Storage = require('../models/Storage');
const Produce = require('../models/Produce');
const { protect, authorize } = require('../middleware/auth');

// Create storage facility
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const storage = await Storage.create(req.body);
    res.status(201).json({ success: true, data: storage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all storage facilities
router.get('/', protect, async (req, res) => {
  try {
    const { province, district, storageType } = req.query;
    const query = {};
    
    if (province) query['location.province'] = province;
    if (district) query['location.district'] = district;
    if (storageType) query.storageType = storageType;

    const facilities = await Storage.find(query);
    res.json({ success: true, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Store produce
router.post('/:id/store', protect, authorize('admin', 'logistics'), async (req, res) => {
  try {
    const { produceId, binNumber, condition } = req.body;
    
    const storage = await Storage.findById(req.params.id);
    if (!storage) {
      return res.status(404).json({ success: false, message: 'Storage facility not found' });
    }

    const produce = await Produce.findById(produceId);
    if (!produce) {
      return res.status(404).json({ success: false, message: 'Produce not found' });
    }

    // Update storage inventory
    storage.inventory.push({
      produceId,
      cropType: produce.cropType,
      quantity: produce.quantity.value,
      binNumber,
      storageDate: new Date(),
      condition,
      lastInspection: new Date()
    });

    storage.capacity.available = storage.capacity.total - 
      storage.inventory.reduce((sum, item) => sum + item.quantity, 0);

    await storage.save();

    // Update produce record
    produce.storage = {
      facilityId: storage._id,
      storageDate: new Date(),
      binNumber,
      condition
    };
    produce.logistics.status = 'stored';
    await produce.save();

    res.json({ success: true, data: { storage, produce } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get storage inventory
router.get('/:id/inventory', protect, async (req, res) => {
  try {
    const storage = await Storage.findById(req.params.id).populate('inventory.produceId');
    if (!storage) {
      return res.status(404).json({ success: false, message: 'Storage facility not found' });
    }
    res.json({ success: true, data: storage.inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
