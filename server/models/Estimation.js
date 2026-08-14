const mongoose = require('mongoose');

const EstimationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  buildingType: { type: String, required: true },
  area: { type: Number, required: true },
  floors: { type: String, required: true },
  location: { type: String, required: true },
  materialQuality: { type: String, required: true },
  baseRate: { type: Number, required: true },
  locationMultiplier: { type: Number, required: true },
  estimatedCost: { type: Number, required: true }
}, {
  timestamps: true   // replaces manual createdAt, adds updatedAt too
});

module.exports = mongoose.model('Estimation', EstimationSchema);
