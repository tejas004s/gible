const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'scheduled', 'completed', 'canceled'], default: 'pending' },
  wasteType: { type: String, enum: ['recyclable', 'organic', 'hazardous', 'general'], required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Pickup', pickupSchema);