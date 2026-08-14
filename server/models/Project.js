const mongoose = require('mongoose');

const StageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetAmount: { type: Number, default: 0 },
  collectedAmount: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' }
}, { _id: false });

const TransactionSchema = new mongoose.Schema({
  investorName: { type: String, required: true },
  stageName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { _id: true });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectId: { type: String, unique: true },
  location: { type: String, required: true },
  projectType: { type: String, required: true },
  status: { type: String, default: 'Upcoming', enum: ['Upcoming', 'Ongoing', 'Completed', 'On Hold'] },
  description: { type: String, required: true },
  image: { type: String, default: '' },

  // Cost inputs
  landPrice: { type: Number, default: 0 },
  materialCost: { type: Number, default: 0 },
  equipmentCost: { type: Number, default: 0 },
  laborCost: { type: Number, default: 0 },
  permitCost: { type: Number, default: 0 },
  contingencyPercent: { type: Number, default: 10 },

  // Computed totals
  estimatedPrice: { type: Number, default: 0 },
  budgetBDT: { type: Number, default: 0 },
  totalCollected: { type: Number, default: 0 },
  progressPercentage: { type: Number, default: 0, min: 0, max: 100 },

  // Investor split
  investorCount: { type: Number, default: 0 },
  landPaymentPerInvestor: { type: Number, default: 0 },

  stages: [StageSchema],
  transactions: [TransactionSchema],

  startDate: { type: Date },
  expectedCompletionDate: { type: Date }
}, {
  timestamps: true   // adds createdAt + updatedAt automatically
});

module.exports = mongoose.model('Project', ProjectSchema);
