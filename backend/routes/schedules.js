const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const Pickup = require('../models/Pickup');
const Driver = require('../models/Driver');
const verifyToken = require('../middleware/auth');

// Create Schedule (Admin only, already implemented)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admin only' });
    }
    const { pickupId, driverId, date, time, route } = req.body;
    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(400).json({ error: 'Pickup not found' });
    }
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(400).json({ error: 'Driver not found' });
    }
    const schedule = new Schedule({ pickupId, driverId, date, time, route });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Schedule (Admin only)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admin only' });
    }
    const { pickupId, driverId, date, time, route } = req.body;
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { pickupId, driverId, date, time, route },
      { new: true }
    );
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Schedules (Admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admin only' });
    }
    const schedules = await Schedule.find()
      .populate('pickupId', 'userId date time wasteType')
      .populate('driverId', 'name');
    res.json(schedules);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;