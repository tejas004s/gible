const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleId: { type: String, required: true },
});

module.exports = mongoose.model('Driver', driverSchema);