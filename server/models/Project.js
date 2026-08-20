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

// ── Flat / Unit sub-schema ──────────────────────────────────────────
// Each unit represents a single flat in the building (e.g. 1A, 1B, 1C)
const UnitSchema = new mongoose.Schema({
  flatNumber: { type: String, required: true },   // e.g. '1A', '2C'
  floor: { type: Number, required: true },          // e.g. 1, 2, 3
  type: { type: String, default: 'Standard Apartment' },
  areaSqFt: { type: Number, required: true },
  beds: { type: Number, default: 3 },
  baths: { type: Number, default: 2 },
  balconies: { type: Number, default: 2 },
  facing: { type: String, default: 'South' },
  priceBDT: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Booked', 'Sold'], default: 'Available' },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bookedAt: { type: Date, default: null }
});

// ── Offline payment tracking per flat ───────────────────────────────
// Admin records or verifies each installment after customer payment
const CustomerPaymentSchema = new mongoose.Schema({
  unitId: { type: mongoose.Schema.Types.ObjectId, required: true },
  flatNumber: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  milestone: { type: String, required: true },        // e.g. 'Booking Money', '1st Installment'
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'Bank Transfer' },
  note: { type: String, default: '' },
  verifiedByAdmin: { type: Boolean, default: true },
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Verified' }
});

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

  // ── Building configuration (admin sets when creating project) ─────
  totalFloors: { type: Number, default: 6 },
  flatsPerFloor: { type: Number, default: 3 },
  defaultAreaSqFt: { type: Number, default: 1200 },
  bookingFeePercent: { type: Number, default: 10 },

  stages: [StageSchema],
  transactions: [TransactionSchema],
  units: [UnitSchema],
  customerPayments: [CustomerPaymentSchema],

  startDate: { type: Date },
  expectedCompletionDate: { type: Date }
}, {
  timestamps: true   // adds createdAt + updatedAt automatically
});

module.exports = mongoose.model('Project', ProjectSchema);
