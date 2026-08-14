const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  projectType: String,
  location: String,
  budget: String,
  message: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
