const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

async function seed() {
  try {
    await Project.deleteMany({});

    const data = [
      {
        name: 'Bashundhara Residential Tower',
        projectId: 'BP-PRJ-001',
        location: 'Bashundhara R/A, Dhaka',
        projectType: 'Residential',
        status: 'Ongoing',
        description: 'High-rise residential development with modern amenities.',
        budgetBDT: 85000000,
        progressPercentage: 72,
        startDate: new Date('2023-02-01'),
        expectedCompletionDate: new Date('2025-12-31'),
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994'
      },
      {
        name: 'Chattogram Commercial Hub',
        projectId: 'BP-PRJ-002',
        location: 'Agrabad, Chattogram',
        projectType: 'Commercial',
        status: 'Ongoing',
        description: 'A mixed-use commercial center supporting local businesses.',
        budgetBDT: 120000000,
        progressPercentage: 55,
        startDate: new Date('2022-07-01'),
        expectedCompletionDate: new Date('2024-11-30'),
        image: 'https://images.unsplash.com/photo-1505842465776-3d5b8f6c2f9b'
      },
      {
        name: 'Purbachal Green City',
        projectId: 'BP-PRJ-003',
        location: 'Purbachal, Dhaka',
        projectType: 'Infrastructure',
        status: 'Completed',
        description: 'Infrastructure and planning for a green satellite city.',
        budgetBDT: 450000000,
        progressPercentage: 100,
        startDate: new Date('2019-01-01'),
        expectedCompletionDate: new Date('2022-06-30'),
        image: 'https://images.unsplash.com/photo-1526406915891-2f2f9f8a1a1d'
      },
      {
        name: 'Uttara Metro Plaza',
        projectId: 'BP-PRJ-004',
        location: 'Uttara, Dhaka',
        projectType: 'Commercial',
        status: 'Upcoming',
        description: 'New commercial plaza near the upcoming metro line.',
        budgetBDT: 60000000,
        progressPercentage: 5,
        startDate: new Date('2024-09-01'),
        expectedCompletionDate: new Date('2026-08-01'),
        image: 'https://images.unsplash.com/photo-1494526585095-c41746248156'
      },
      {
        name: 'Rajshahi Industrial Park',
        projectId: 'BP-PRJ-005',
        location: 'BSCIC Industrial Area, Rajshahi',
        projectType: 'Industrial',
        status: 'Ongoing',
        description: 'Industrial park to promote light manufacturing and exports.',
        budgetBDT: 95000000,
        progressPercentage: 40,
        startDate: new Date('2023-05-15'),
        expectedCompletionDate: new Date('2025-10-20'),
        image: 'https://images.unsplash.com/photo-1470123808288-8a4d3bfc8aa8'
      },
      {
        name: 'Sylhet Tea Estate Lodges',
        projectId: 'BP-PRJ-006',
        location: 'Malnichhera, Sylhet',
        projectType: 'Residential',
        status: 'Upcoming',
        description: 'Small lodges to support eco-tourism in tea estate areas.',
        budgetBDT: 18000000,
        progressPercentage: 0,
        startDate: new Date('2024-10-01'),
        expectedCompletionDate: new Date('2025-12-01'),
        image: 'https://images.unsplash.com/photo-1507120410856-1f35574c3b45'
      }
    ];

    await Project.insertMany(data);
    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
