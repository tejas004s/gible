const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  pickupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pickup', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  route: { type: String },
});

module.exports = mongoose.model('Schedule', scheduleSchema);