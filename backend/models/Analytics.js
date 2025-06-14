const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pickup', required: true },
  wasteType: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Analytics', analyticsSchema);