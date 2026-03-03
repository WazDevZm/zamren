const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const farm = await Farm.create(req.body);
    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const { farmerId, page = 1, limit = 20 } = req.query;
    const query = farmerId ? { farmerId } : {};
    
    const farms = await Farm.find(query)
      .populate('farmerId')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Farm.countDocuments(query);
    
    res.json({
      success: true,
      data: farms,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('farmerId');
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    res.json({ success: true, data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    res.json({ success: true, data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
