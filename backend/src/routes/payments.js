const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Farmer = require('../models/Farmer');
const { protect, authorize } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendSMS, sendEmail } = require('../services/notification');
const { processMobileMoneyPayment } = require('../services/mobileMoney');

// Initiate payment
router.post('/', protect, authorize('admin', 'finance'), async (req, res) => {
  try {
    const { farmerId, amount, paymentType, paymentMethod, paymentDetails, produceDetails } = req.body;
    
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const payment = await Payment.create({
      farmerId,
      transactionId,
      paymentType,
      amount,
      paymentMethod,
      paymentDetails,
      produceDetails,
      initiatedBy: req.user._id,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Process payment
router.post('/:id/process', protect, authorize('admin', 'finance'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('farmerId');
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    payment.status = 'processing';
    await payment.save();

    let result;
    
    if (payment.paymentMethod === 'bank_transfer') {
      // Bank API integration
      result = { success: true, reference: `BANK-${Date.now()}` };
    } else if (payment.paymentMethod === 'mobile_money') {
      result = await processMobileMoneyPayment(payment);
    } else if (payment.paymentMethod === 'digital_wallet') {
      // Stripe integration
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(payment.amount * 100),
        currency: payment.currency.toLowerCase(),
        metadata: { transactionId: payment.transactionId }
      });
      result = { success: true, paymentIntent };
    }

    if (result.success) {
      payment.status = 'completed';
      payment.completedAt = new Date();
      payment.gatewayResponse = result;
      payment.receipt = {
        receiptNumber: `RCP-${Date.now()}`,
        receiptUrl: `/receipts/${payment.transactionId}.pdf`
      };
      
      await sendSMS(payment.farmerId.personalInfo.phone, 
        `Payment of ${payment.currency} ${payment.amount} has been processed. Ref: ${payment.transactionId}`);
      
      if (payment.farmerId.personalInfo.email) {
        await sendEmail(payment.farmerId.personalInfo.email,
          'Payment Confirmation',
          `Your payment of ${payment.currency} ${payment.amount} has been successfully processed.`);
      }
    } else {
      payment.status = 'failed';
      payment.gatewayResponse = result;
    }

    await payment.save();
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get payments
router.get('/', protect, async (req, res) => {
  try {
    const { farmerId, status, paymentType, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (farmerId) query.farmerId = farmerId;
    if (status) query.status = status;
    if (paymentType) query.paymentType = paymentType;

    const payments = await Payment.find(query)
      .populate('farmerId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get payment by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('farmerId');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
