const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: String,
  projectId: String,
  location: String,
  projectType: String,
  status: String,
  description: String,
  budgetBDT: Number,
  progressPercentage: Number,
  startDate: Date,
  expectedCompletionDate: Date,
  image: String
});

module.exports = mongoose.model('Project', ProjectSchema);
