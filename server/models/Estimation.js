const mongoose = require('mongoose');

const EstimationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buildingType: String,
  area: Number,
  floors: String,
  location: String,
  materialQuality: String,
  baseRate: Number,
  locationMultiplier: Number,
  estimatedCost: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Estimation', EstimationSchema);
