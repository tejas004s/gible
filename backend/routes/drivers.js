const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const verifyToken = require('../middleware/auth');

// Create Driver (Admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admin only' });
    }
    const { name, phone, vehicleId } = req.body;
    const driver = new Driver({ name, phone, vehicleId });
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Drivers (Admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admin only' });
    }
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;