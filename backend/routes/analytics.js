const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Pickup = require('../models/Pickup');
const verifyToken = require('../middleware/auth');

// POST: Create a new analytics entry (Admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admin only' });
    }

    const { pickupId, wasteType, quantity, date } = req.body;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(400).json({ error: 'Pickup not found' });
    }

    const analytics = new Analytics({
      userId: pickup.userId,
      pickupId,
      wasteType,
      quantity,
      date,
    });

    await analytics.save();
    res.status(201).json(analytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Retrieve analytics with optional filters (Admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied, admin only' });
    }

    const { startDate, endDate, userId } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (userId) {
      filter.userId = userId;
    }

    const analytics = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$wasteType',
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          wasteType: '$_id',
          totalQuantity: 1,
          count: 1,
          _id: 0,
        },
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    res.json(analytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
