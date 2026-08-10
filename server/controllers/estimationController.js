const Estimation = require('../models/Estimation');

// Simple, easy-to-read pricing config
const BASE_RATES = {
  Economy: 4000,
  Standard: 4900,
  Premium: 6000
};

const LOCATION_MULTIPLIER = {
  Gulshan: 1.15,
  Banani: 1.15,
  Dhanmondi: 1.10,
  Bashundhara: 1.08,
  Uttara: 1.07,
  Purbachal: 1.02,
  Mirpur: 1.03,
  Khilgaon: 1.00,
  Chattogram: 1.04,
  Sylhet: 1.02,
  Rajshahi: 0.97,
  Khulna: 0.97
};

const FLOOR_MULTIPLIER = {
  '1': 1.0,
  '2': 1.08,
  '3': 1.15,
  '4': 1.22,
  '5+': 1.30
};

exports.calculateAndSave = async (req, res) => {
  try {
    const { buildingType, area, floors, location, materialQuality, save } = req.body;
    if (!buildingType || !area || !floors || !location || !materialQuality) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const baseRate = BASE_RATES[materialQuality] || BASE_RATES.Standard;
    const locationMultiplier = LOCATION_MULTIPLIER[location] || 1.0;
    const floorMultiplier = FLOOR_MULTIPLIER[floors] || 1.0;

    // Estimated Cost = Area × Base Rate × Location Multiplier × Floor Multiplier
    const estimatedCost = Math.round(area * baseRate * locationMultiplier * floorMultiplier);

    const result = {
      buildingType,
      area,
      floors,
      location,
      materialQuality,
      baseRate,
      locationMultiplier,
      floorMultiplier,
      estimatedCost
    };

    // If the user wants to save, and is authenticated, save it
    if (save && req.userId) {
      const est = new Estimation({
        user: req.userId,
        buildingType,
        area,
        floors,
        location,
        materialQuality,
        baseRate,
        locationMultiplier,
        estimatedCost
      });
      await est.save();
      result.saved = true;
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyEstimates = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    const list = await Estimation.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
