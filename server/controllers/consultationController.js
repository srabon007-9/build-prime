const Consultation = require('../models/Consultation');

exports.createConsultation = async (req, res) => {
  try {
    const { name, phone, email, projectType, location, budget, message } = req.body;

    if (!name || !phone || !projectType || !location || !message) {
      return res.status(400).json({ message: 'Please fill in the required fields' });
    }

    const consultation = new Consultation({
      name,
      phone,
      email,
      projectType,
      location,
      budget,
      message
    });

    await consultation.save();
    res.status(201).json({ message: 'Consultation request saved', consultation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
