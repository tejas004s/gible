const express = require('express');
const router = express.Router();
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const mongoose = require('mongoose');
const verifyToken = require('../middleware/auth');

// Create Pickup (Authenticated, already implemented)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { date, time, wasteType, quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const pickup = new Pickup({
      userId: req.user.userId,
      date,
      time,
      wasteType,
      quantity,
    });
    await pickup.save();
    res.status(201).json(pickup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Pickups (User sees own, Admin sees all)
router.get('/', verifyToken, async (req, res) => {
  try {
    let pickups;
    if (req.user.role === 'admin') {
      pickups = await Pickup.find().populate('userId', 'name email');
    } else {
      pickups = await Pickup.find({ userId: req.user.userId });
    }
    res.json(pickups);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Pickup Status (Admin or Driver, already implemented)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Access denied' });
    }
    const { status } = req.body;
    const pickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup not found' });
    }
    req.app.get('io').emit('statusUpdate', { pickupId: pickup._id, status });
    res.json(pickup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;