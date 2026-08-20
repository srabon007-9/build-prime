const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Project = require('./models/Project');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

function createDefaultStages(costs) {
  return [
    {
      name: 'Land Purchase',
      targetAmount: costs.land,
      collectedAmount: costs.land,
      status: 'Completed'
    },
    {
      name: 'Foundation Work',
      targetAmount: Math.round(costs.material * 0.25 + costs.equipment * 0.25 + costs.labor * 0.25),
      collectedAmount: Math.round(costs.material * 0.25 + costs.equipment * 0.25 + costs.labor * 0.25),
      status: 'Completed'
    },
    {
      name: 'Structure Work',
      targetAmount: Math.round(costs.material * 0.45 + costs.equipment * 0.45 + costs.labor * 0.45),
      collectedAmount: Math.round(costs.material * 0.20),
      status: 'Ongoing'
    },
    {
      name: 'Finishing and Handover',
      targetAmount: Math.round(costs.material * 0.30 + costs.equipment * 0.30 + costs.labor * 0.30 + costs.permit),
      collectedAmount: 0,
      status: 'Pending'
    }
  ];
}

function generateUnits({ totalFloors, flatsPerFloor, defaultAreaSqFt, pricePerSqFt }) {
  const units = [];
  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const facings = ['South', 'South-East', 'South-West', 'East', 'West', 'North-East'];

  for (let floor = 1; floor <= totalFloors; floor++) {
    for (let flat = 0; flat < flatsPerFloor; flat++) {
      const label = labels[flat] || String(flat + 1);
      const flatNumber = `${floor}${label}`;
      const floorPremium = 1 + (floor - 1) * 0.025;
      const area = Math.round(defaultAreaSqFt * (1 + (flat * 0.05)));
      const price = Math.round(area * pricePerSqFt * floorPremium);

      units.push({
        _id: new mongoose.Types.ObjectId(),
        flatNumber,
        floor,
        type: floor === totalFloors ? 'Penthouse Deluxe' : area > 1600 ? '4 Bed Executive' : '3 Bed Family Unit',
        areaSqFt: area,
        beds: area >= 1800 ? 4 : 3,
        baths: area >= 1800 ? 4 : 3,
        balconies: area >= 1800 ? 3 : 2,
        facing: facings[(floor + flat) % facings.length],
        priceBDT: price,
        status: 'Available',
        bookedBy: null,
        bookedAt: null
      });
    }
  }
  return units;
}

const projectsData = [
  {
    name: 'Shanta Garden',
    location: 'Gulshan 2, Dhaka',
    projectType: 'Residential',
    status: 'Ongoing',
    progressPercentage: 65,
    description: 'Ultra-luxury residential skyscraper featuring 360° lakeside views, underground automated parking, smart home automation, and rooftop infinity pool.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 8,
    flatsPerFloor: 3,
    defaultAreaSqFt: 1850,
    pricePerSqFt: 12500,
    landPrice: 150000000,
    materialCost: 85000000,
    equipmentCost: 25000000,
    laborCost: 35000000,
    permitCost: 10000000,
    contingencyPercent: 10,
    investorCount: 12
  },
  {
    name: 'Swapno Kutir',
    location: 'Dhanmondi Road 27, Dhaka',
    projectType: 'Residential',
    status: 'Ongoing',
    progressPercentage: 45,
    description: 'Modern eco-friendly residential complex designed for urban families. Features solar-powered common areas and lush courtyard gardens.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 6,
    flatsPerFloor: 3,
    defaultAreaSqFt: 1650,
    pricePerSqFt: 9800,
    landPrice: 90000000,
    materialCost: 55000000,
    equipmentCost: 18000000,
    laborCost: 22000000,
    permitCost: 6000000,
    contingencyPercent: 10,
    investorCount: 8
  },
  {
    name: 'Jamuna Commercial Center',
    location: 'Banani Block D, Dhaka',
    projectType: 'Commercial',
    status: 'Ongoing',
    progressPercentage: 80,
    description: 'State-of-the-art commercial high-rise with premium glass façade, high-speed elevators, central HVAC, and LEED Gold sustainability certification.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 10,
    flatsPerFloor: 3,
    defaultAreaSqFt: 2200,
    pricePerSqFt: 16000,
    landPrice: 220000000,
    materialCost: 110000000,
    equipmentCost: 40000000,
    laborCost: 45000000,
    permitCost: 15000000,
    contingencyPercent: 12,
    investorCount: 15
  },
  {
    name: 'Purbachal Green Villa',
    location: 'Bashundhara R/A Block I, Dhaka',
    projectType: 'Residential',
    status: 'Upcoming',
    progressPercentage: 15,
    description: 'Exclusive gated community of luxury duplex apartments with private terrace gardens, 24/7 biometric security, and dedicated sports complex.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 5,
    flatsPerFloor: 3,
    defaultAreaSqFt: 2100,
    pricePerSqFt: 11000,
    landPrice: 110000000,
    materialCost: 65000000,
    equipmentCost: 20000000,
    laborCost: 28000000,
    permitCost: 8000000,
    contingencyPercent: 10,
    investorCount: 9
  },
  {
    name: 'Niribili Tower',
    location: 'Uttara Sector 7, Dhaka',
    projectType: 'Residential',
    status: 'Ongoing',
    progressPercentage: 55,
    description: 'Premium family residences near Uttara Metro Station. Modern layout, open balconies, gym, and children playground.',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 7,
    flatsPerFloor: 3,
    defaultAreaSqFt: 1550,
    pricePerSqFt: 8800,
    landPrice: 85000000,
    materialCost: 48000000,
    equipmentCost: 15000000,
    laborCost: 20000000,
    permitCost: 5000000,
    contingencyPercent: 8,
    investorCount: 7
  },
  {
    name: 'Surma Heights',
    location: 'Zindabazar, Sylhet',
    projectType: 'Residential',
    status: 'Completed',
    progressPercentage: 100,
    description: 'Completed signature residential tower featuring luxurious interiors, 100% generator backup, water purification plant, and underground car wash.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 6,
    flatsPerFloor: 3,
    defaultAreaSqFt: 1600,
    pricePerSqFt: 8500,
    landPrice: 70000000,
    materialCost: 42000000,
    equipmentCost: 12000000,
    laborCost: 18000000,
    permitCost: 4000000,
    contingencyPercent: 10,
    investorCount: 6
  },
  {
    name: 'Kollol Residency',
    location: 'Panchlaish, Chittagong',
    projectType: 'Residential',
    status: 'Upcoming',
    progressPercentage: 10,
    description: 'Scenic residential complex with panoramic hill views, earthquake-resistant structure, double-height lobby, and private community hall.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 8,
    flatsPerFloor: 3,
    defaultAreaSqFt: 1750,
    pricePerSqFt: 9200,
    landPrice: 95000000,
    materialCost: 52000000,
    equipmentCost: 16000000,
    laborCost: 22000000,
    permitCost: 6000000,
    contingencyPercent: 10,
    investorCount: 10
  },
  {
    name: 'Prashanti Haven',
    location: 'Mirpur DOHS, Dhaka',
    projectType: 'Residential',
    status: 'Ongoing',
    progressPercentage: 70,
    description: 'Tranquil security-ensured residential apartments overlooking lakes and green parkways in Mirpur DOHS zone.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 6,
    flatsPerFloor: 3,
    defaultAreaSqFt: 1900,
    pricePerSqFt: 9500,
    landPrice: 88000000,
    materialCost: 50000000,
    equipmentCost: 16000000,
    laborCost: 21000000,
    permitCost: 5500000,
    contingencyPercent: 10,
    investorCount: 8
  },
  {
    name: 'Borno Heritage Plaza',
    location: 'Lalbagh, Puran Dhaka',
    projectType: 'Mixed-Use',
    status: 'Upcoming',
    progressPercentage: 20,
    description: 'Mixed-use landmark project combining ground-floor commercial shops with traditional heritage-themed executive apartments.',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 7,
    flatsPerFloor: 3,
    defaultAreaSqFt: 1400,
    pricePerSqFt: 9000,
    landPrice: 75000000,
    materialCost: 45000000,
    equipmentCost: 14000000,
    laborCost: 19000000,
    permitCost: 5000000,
    contingencyPercent: 10,
    investorCount: 6
  },
  {
    name: 'Meghna Industrial Park',
    location: 'Jatrabari Highway, Dhaka',
    projectType: 'Industrial',
    status: 'Ongoing',
    progressPercentage: 35,
    description: 'Modern light-industrial and logistics hub with heavy-load concrete flooring, wide container access, and automated freight loading bays.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    totalFloors: 4,
    flatsPerFloor: 3,
    defaultAreaSqFt: 3000,
    pricePerSqFt: 6500,
    landPrice: 120000000,
    materialCost: 70000000,
    equipmentCost: 35000000,
    laborCost: 30000000,
    permitCost: 10000000,
    contingencyPercent: 10,
    investorCount: 14
  }
];

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await Project.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing projects and users.');

    // 1. Create Admin Account
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'BuildPrime Admin',
      email: 'admin@buildprime.com',
      password: adminHashedPassword,
      role: 'admin'
    });

    // 2. Create Sample Customer Accounts (Buyer / Owner)
    const buyerHashedPassword = await bcrypt.hash('buyer123', 10);
    const buyerUser = await User.create({
      name: 'Tanvir Rahman',
      email: 'buyer@gmail.com',
      password: buyerHashedPassword,
      role: 'user'
    });

    const customer2HashedPassword = await bcrypt.hash('customer123', 10);
    const customer2User = await User.create({
      name: 'Nusrat Jahan',
      email: 'customer2@gmail.com',
      password: customer2HashedPassword,
      role: 'user'
    });

    console.log('Users created:');
    console.log(' - Admin: admin@buildprime.com / admin123');
    console.log(' - Buyer: buyer@gmail.com / buyer123 (Name: Tanvir Rahman)');
    console.log(' - Buyer 2: customer2@gmail.com / customer123 (Name: Nusrat Jahan)');

    // 3. Seed 10 Projects
    for (let index = 0; index < projectsData.length; index++) {
      const p = projectsData[index];
      const direct = p.landPrice + p.materialCost + p.equipmentCost + p.laborCost + p.permitCost;
      const estimatedPrice = Math.round(direct + (direct * p.contingencyPercent / 100));

      const units = generateUnits({
        totalFloors: p.totalFloors,
        flatsPerFloor: p.flatsPerFloor,
        defaultAreaSqFt: p.defaultAreaSqFt,
        pricePerSqFt: p.pricePerSqFt
      });

      const customerPayments = [];

      // Assign specific flats to Tanvir Rahman (buyer@gmail.com) on Project 1 & 2 for immediate testing!
      if (index === 0) {
        // Flat 2A on Horizon Heights
        const flat2A = units.find(u => u.flatNumber === '2A');
        if (flat2A) {
          flat2A.status = 'Booked';
          flat2A.bookedBy = buyerUser._id;
          flat2A.bookedAt = new Date();

          const bookingFee = Math.round(flat2A.priceBDT * 0.10);
          const installment1 = 1500000;

          customerPayments.push({
            unitId: flat2A._id,
            flatNumber: flat2A.flatNumber,
            userId: buyerUser._id,
            customerName: buyerUser.name,
            milestone: 'Booking Money',
            amount: bookingFee,
            paymentDate: new Date('2026-06-15'),
            paymentMethod: 'Bank Transfer',
            note: '10% initial booking deposit verified',
            verifiedByAdmin: true
          });

          customerPayments.push({
            unitId: flat2A._id,
            flatNumber: flat2A.flatNumber,
            userId: buyerUser._id,
            customerName: buyerUser.name,
            milestone: '1st Installment',
            amount: installment1,
            paymentDate: new Date('2026-07-20'),
            paymentMethod: 'Cheque',
            note: 'Sonali Bank Cheque #982341 cleared',
            verifiedByAdmin: true
          });
        }

        // Flat 4C on Horizon Heights for Nusrat Jahan
        const flat4C = units.find(u => u.flatNumber === '4C');
        if (flat4C) {
          flat4C.status = 'Sold';
          flat4C.bookedBy = customer2User._id;
          flat4C.bookedAt = new Date();

          customerPayments.push({
            unitId: flat4C._id,
            flatNumber: flat4C.flatNumber,
            userId: customer2User._id,
            customerName: customer2User.name,
            milestone: 'Full Payment',
            amount: flat4C.priceBDT,
            paymentDate: new Date('2026-05-10'),
            paymentMethod: 'Bank Transfer',
            note: 'Full settlement via City Bank WIRE',
            verifiedByAdmin: true
          });
        }
      }

      if (index === 1) {
        // Flat 3B on Crestline Residency for Tanvir Rahman
        const flat3B = units.find(u => u.flatNumber === '3B');
        if (flat3B) {
          flat3B.status = 'Booked';
          flat3B.bookedBy = buyerUser._id;
          flat3B.bookedAt = new Date();

          const bookingFee = Math.round(flat3B.priceBDT * 0.10);
          customerPayments.push({
            unitId: flat3B._id,
            flatNumber: flat3B.flatNumber,
            userId: buyerUser._id,
            customerName: buyerUser.name,
            milestone: 'Booking Money',
            amount: bookingFee,
            paymentDate: new Date('2026-07-01'),
            paymentMethod: 'bKash',
            note: 'bKash merchant payment verified',
            verifiedByAdmin: true
          });
        }
      }

      const stages = createDefaultStages({
        land: p.landPrice,
        material: p.materialCost,
        equipment: p.equipmentCost,
        labor: p.laborCost,
        permit: p.permitCost
      });

      const transactions = [
        { investorName: 'BuildPrime Equity Fund', stageName: 'Land Purchase', amount: Math.round(p.landPrice * 0.6), note: 'Initial equity disbursement' },
        { investorName: 'City Bank Project Financing', stageName: 'Foundation Work', amount: Math.round(p.materialCost * 0.3), note: 'Tranche A release' }
      ];

      const totalCollected = transactions.reduce((acc, t) => acc + t.amount, 0) + customerPayments.reduce((acc, cp) => acc + cp.amount, 0);

      await Project.create({
        name: p.name,
        projectId: `BP-${String(index + 1).padStart(4, '0')}`,
        location: p.location,
        projectType: p.projectType,
        status: p.status,
        description: p.description,
        image: p.image,
        landPrice: p.landPrice,
        materialCost: p.materialCost,
        equipmentCost: p.equipmentCost,
        laborCost: p.laborCost,
        permitCost: p.permitCost,
        contingencyPercent: p.contingencyPercent,
        estimatedPrice,
        budgetBDT: estimatedPrice,
        totalCollected,
        progressPercentage: p.progressPercentage,
        investorCount: p.investorCount,
        landPaymentPerInvestor: p.investorCount ? Math.round(p.landPrice / p.investorCount) : 0,
        totalFloors: p.totalFloors,
        flatsPerFloor: p.flatsPerFloor,
        defaultAreaSqFt: p.defaultAreaSqFt,
        bookingFeePercent: 10,
        stages,
        transactions,
        units,
        customerPayments,
        startDate: new Date('2025-01-10'),
        expectedCompletionDate: new Date('2027-12-30')
      });

      console.log(`Created project ${index + 1}/10: ${p.name}`);
    }

    console.log('\n🎉 Successfully seeded 10 realistic projects into BuildPrime!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding projects:', err);
    process.exit(1);
  }
}

seed();
