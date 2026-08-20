const Project = require('../models/Project');
const User = require('../models/User');
const Estimation = require('../models/Estimation');
const Consultation = require('../models/Consultation');

// Get all flats booked by the logged-in customer, with payment summaries
exports.getMyFlats = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all projects that have units booked by this user
    const projects = await Project.find({ 'units.bookedBy': userId });

    const myFlats = [];

    for (const project of projects) {
      const bookedUnits = project.units.filter(
        unit => unit.bookedBy && unit.bookedBy.toString() === userId
      );

      for (const unit of bookedUnits) {
        // Gather all payments for this specific unit by this user
        const payments = (project.customerPayments || []).filter(
          p => p.unitId.toString() === unit._id.toString() && p.userId.toString() === userId
        );

        // Total paid only sums verified payments
        const verifiedPayments = payments.filter(p => p.verifiedByAdmin === true && p.status !== 'Rejected');
        const totalPaid = verifiedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const remaining = Math.max(0, unit.priceBDT - totalPaid);
        const progressPercent = unit.priceBDT > 0 ? Math.round((totalPaid / unit.priceBDT) * 100) : 0;

        myFlats.push({
          projectId: project._id,
          projectName: project.name,
          projectLocation: project.location,
          projectImage: project.image,
          projectStatus: project.status,
          bookingFeePercent: project.bookingFeePercent || 10,

          unitId: unit._id,
          flatNumber: unit.flatNumber,
          floor: unit.floor,
          type: unit.type,
          areaSqFt: unit.areaSqFt,
          beds: unit.beds,
          baths: unit.baths,
          balconies: unit.balconies,
          facing: unit.facing,
          priceBDT: unit.priceBDT,
          unitStatus: unit.status,
          bookedAt: unit.bookedAt,

          totalPaid,
          remaining,
          progressPercent,
          payments: payments.map(p => ({
            _id: p._id,
            milestone: p.milestone,
            amount: p.amount,
            paymentDate: p.paymentDate,
            paymentMethod: p.paymentMethod,
            note: p.note,
            verifiedByAdmin: p.verifiedByAdmin !== false,
            status: p.status || (p.verifiedByAdmin ? 'Verified' : 'Pending')
          }))
        });
      }
    }

    res.json(myFlats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Customer submits a payment request for their booked flat (needs admin verification)
exports.submitPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { projectId, unitId, milestone, amount, paymentMethod, note } = req.body;

    if (!projectId || !unitId || !milestone || !amount) {
      return res.status(400).json({ message: 'Project, flat, milestone and amount are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const unit = project.units.id(unitId);
    if (!unit) return res.status(404).json({ message: 'Flat not found' });

    if (!unit.bookedBy || unit.bookedBy.toString() !== userId) {
      return res.status(403).json({ message: 'You are not assigned to this flat' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User profile not found' });

    const payAmount = Number(amount) || 0;
    if (payAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    project.customerPayments.push({
      unitId: unit._id,
      flatNumber: unit.flatNumber,
      userId: user._id,
      customerName: user.name,
      milestone,
      amount: payAmount,
      paymentDate: new Date(),
      paymentMethod: paymentMethod || 'Bank Transfer',
      note: note || '',
      verifiedByAdmin: false,
      status: 'Pending'
    });

    await project.save();
    res.json({ message: 'Payment request submitted! Admin will verify soon.', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Complete Customer Portfolio view (Personal Info, Owned Flats, Estimates, Quote Requests)
exports.getCustomerPortfolio = async (req, res) => {
  try {
    let targetUserId = req.userId;

    // Admin can query any customer portfolio via query params
    if (req.userRole === 'admin' && (req.query.userId || req.query.email)) {
      if (req.query.userId) {
        targetUserId = req.query.userId;
      } else if (req.query.email) {
        const foundUser = await User.findOne({ email: req.query.email.toLowerCase().trim() });
        if (foundUser) targetUserId = foundUser._id;
      }
    }

    const user = await User.findById(targetUserId).select('-password');
    if (!user) return res.status(401).json({ message: 'User profile not found. Please log in again.' });

    // 1. Fetch flats booked by this customer
    const projects = await Project.find({ 'units.bookedBy': user._id });
    const ownedFlats = [];
    let totalCommitted = 0;
    let totalPaid = 0;

    for (const project of projects) {
      const bookedUnits = project.units.filter(u => u.bookedBy && u.bookedBy.toString() === user._id.toString());
      for (const unit of bookedUnits) {
        const payments = (project.customerPayments || []).filter(
          p => p.unitId.toString() === unit._id.toString() && p.userId.toString() === user._id.toString()
        );
        const verifiedPayments = payments.filter(p => p.verifiedByAdmin === true && p.status !== 'Rejected');
        const unitPaid = verifiedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const remaining = Math.max(0, unit.priceBDT - unitPaid);
        const progress = unit.priceBDT > 0 ? Math.round((unitPaid / unit.priceBDT) * 100) : 0;

        totalCommitted += unit.priceBDT;
        totalPaid += unitPaid;

        ownedFlats.push({
          projectId: project._id,
          projectName: project.name,
          location: project.location,
          projectStatus: project.status,
          flatNumber: unit.flatNumber,
          floor: unit.floor,
          type: unit.type,
          areaSqFt: unit.areaSqFt,
          beds: unit.beds,
          baths: unit.baths,
          priceBDT: unit.priceBDT,
          totalPaid: unitPaid,
          remaining,
          progress,
          bookedAt: unit.bookedAt,
          payments: payments.map(p => ({
            _id: p._id,
            milestone: p.milestone,
            amount: p.amount,
            paymentDate: p.paymentDate,
            paymentMethod: p.paymentMethod,
            note: p.note,
            status: p.status || (p.verifiedByAdmin ? 'Verified' : 'Pending')
          }))
        });
      }
    }

    // 2. Fetch saved estimates & quote requests by this customer
    const [estimates, quotes] = await Promise.all([
      Estimation.find({ user: user._id }).sort({ createdAt: -1 }),
      Consultation.find({ email: user.email }).sort({ createdAt: -1 })
    ]);

    res.json({
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        nidPassport: user.nidPassport || '',
        role: user.role,
        memberSince: user.createdAt
      },
      summary: {
        totalFlats: ownedFlats.length,
        totalCommitted,
        totalPaid,
        totalDue: Math.max(0, totalCommitted - totalPaid),
        overallProgress: totalCommitted > 0 ? Math.round((totalPaid / totalCommitted) * 100) : 0,
        totalEstimates: estimates.length,
        totalQuotes: quotes.length
      },
      flats: ownedFlats,
      estimates,
      quotes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
