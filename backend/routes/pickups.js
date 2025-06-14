const express = require('express');
const router = express.Router();
const Pickup = require('../models/Pickup');

// Create Pickup
router.post('/', async (req, res) => {
  try {
    const { userId, date, time, wasteType, quantity } = req.body;
    const pickup = new Pickup({ userId, date, time, wasteType, quantity });
    await pickup.save();
    res.status(201).json(pickup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

