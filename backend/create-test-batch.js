const mongoose = require('mongoose');
const Batch = require('./models/Batch');
const User = require('./models/User');

// Connect to MongoDB
async function createTestBatch() {
  try {
    await mongoose.connect('mongodb://localhost:27017/traceherbss');
    console.log('Connected to MongoDB');

    // First, create or find a farmer user
    let farmer = await User.findOne({ role: 'farmer' });
    if (!farmer) {
      farmer = new User({
        username: 'farmer_rajesh',
        email: 'rajesh@example.com',
        password: 'password123', // This will be hashed by the User model
        firstName: 'Rajesh',
        lastName: 'Kumar',
        role: 'farmer',
        phone: '+91-9876543210',
        isActive: true,
        farmerProfile: {
          farmName: 'Kumar Organic Farm',
          farmLocation: 'Rajasthan, India',
          farmSize: '10 acres',
          primaryCrops: ['Turmeric', 'Ginger', 'Neem']
        }
      });
      await farmer.save();
      console.log('Created farmer user:', farmer._id);
    } else {
      console.log('Using existing farmer:', farmer._id);
    }

    // Create a simple test batch with required fields only
    const testBatch = new Batch({
      batchId: 'TUR2024001',
      product: {
        name: 'Organic Turmeric Powder',
        scientificName: 'Curcuma longa',
        category: 'herb',
        variety: 'Traditional',
        description: 'Premium organic turmeric from Rajasthan'
      },
      farmer: {
        farmerId: farmer._id,
        farmerName: 'Rajesh Kumar',
        farmName: 'Kumar Organic Farm',
        location: {
          coordinates: {
            latitude: 26.9124,
            longitude: 75.7873
          },
          address: 'Village Jaipur, District Jaipur',
          region: 'Rajasthan',
          state: 'Rajasthan',
          country: 'India'
        }
      },
      cultivation: {
        harvestDate: new Date('2024-01-10'),
        farmingMethod: 'organic',
        soilType: 'Clay loam',
        certifications: ['Organic Certified', 'FSSAI Approved']
      },
      harvest: {
        quantity: {
          amount: 500,
          unit: 'kg'
        },
        quality: {
          grade: 'A+',
          moistureContent: 8.5,
          notes: 'Excellent quality turmeric with high curcumin content'
        },
        harvestMethod: 'Hand harvested',
        weather: {
          temperature: 25,
          humidity: 65,
          conditions: 'Clear'
        }
      },
      status: 'harvested',
      qualityTests: [
        {
          testType: 'moisture',
          testDate: new Date('2024-01-12'),
          laboratory: {
            name: 'Quality Lab',
            accreditation: 'ISO 17025'
          },
          results: {
            value: 8.5,
            unit: '%',
            status: 'pass',
            notes: 'Within acceptable limits'
          }
        },
        {
          testType: 'purity',
          testDate: new Date('2024-01-12'),
          laboratory: {
            name: 'Quality Lab',
            accreditation: 'ISO 17025'
          },
          results: {
            value: 95,
            unit: '%',
            status: 'pass',
            notes: 'High purity level'
          }
        }
      ]
    });

    const savedBatch = await testBatch.save();
    console.log('Test batch created successfully!');
    console.log('Batch ID:', savedBatch.batchId);
    console.log('MongoDB _id:', savedBatch._id);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

createTestBatch();