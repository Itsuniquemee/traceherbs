#!/usr/bin/env node

// Demo User Seeding Script for TraceHerbss
// This script adds demo credentials to the database

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const demoUsers = [
  {
    username: 'adminuser',
    email: 'admin@traceherbss.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1234567890',
    isApproved: true,
    isActive: true,
    isVerified: true
  },
  {
    username: 'tanvi',
    email: 'tanvi@traceherbss.com',
    password: 'Tanvi123!',
    firstName: 'Tanvi',
    lastName: 'Farmer',
    role: 'farmer',
    phone: '+9876543210',
    address: {
      street: 'Farm Street 123',
      city: 'Bulandshahr',
      state: 'Uttar Pradesh',
      country: 'India',
      postalCode: '203001'
    },
    farmerProfile: {
      farmName: 'Tanvi Organic Farms',
      farmSize: 25,
      farmingType: 'organic',
      certifications: ['Organic Certified', 'Fair Trade'],
      specializations: ['Herbs', 'Medicinal Plants', 'Spices'],
      experienceYears: 8,
      registrationNumber: 'TF2024001'
    },
    isApproved: true, // Pre-approved for demo
    isActive: true,
    isVerified: true
  },
  {
    username: 'demofarmer',
    email: 'farmer@traceherbss.com',
    password: 'Farmer123!',
    firstName: 'Demo',
    lastName: 'Farmer',
    role: 'farmer',
    phone: '+9988776655',
    address: {
      street: 'Rural Road 456',
      city: 'Meerut',
      state: 'Uttar Pradesh',
      country: 'India',
      postalCode: '250001'
    },
    farmerProfile: {
      farmName: 'Green Valley Farms',
      farmSize: 40,
      farmingType: 'sustainable',
      certifications: ['Sustainable Agriculture'],
      specializations: ['Turmeric', 'Ginger', 'Basil'],
      experienceYears: 12,
      registrationNumber: 'GV2024002'
    },
    isApproved: true,
    isActive: true,
    isVerified: true
  },
  {
    username: 'processoruser',
    email: 'processor@traceherbss.com',
    password: 'Processor123!',
    firstName: 'Processor',
    lastName: 'Demo',
    role: 'processor',
    phone: '+9876543211',
    address: {
      street: 'Industrial Area',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh',
      country: 'India',
      postalCode: '201001'
    },
    processorProfile: {
      companyName: 'HerbalTech Processing Ltd',
      facilityType: 'processing',
      capacity: 1000,
      certifications: ['ISO 9001', 'FSSAI'],
      licenseNumber: 'HP2024001',
      processingMethods: ['Drying', 'Extraction', 'Packaging']
    },
    isApproved: true,
    isActive: true,
    isVerified: true
  },
  {
    username: 'consumer',
    email: 'consumer@traceherbss.com',
    password: 'Consumer123!',
    firstName: 'Consumer',
    lastName: 'User',
    role: 'consumer',
    phone: '+9988776644',
    address: {
      street: 'Market Street 789',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110001'
    },
    consumerProfile: {
      preferences: ['Organic Products', 'Herbal Medicine'],
      allergies: ['Nuts'],
      interests: ['Health & Wellness', 'Natural Products']
    },
    isApproved: true, // Consumers are auto-approved
    isActive: true,
    isVerified: true
  },
  {
    username: 'regulator',
    email: 'regulator@traceherbss.com',
    password: 'Regulator123!',
    firstName: 'Regulatory',
    lastName: 'Officer',
    role: 'regulator',
    phone: '+9876543212',
    address: {
      street: 'Government Complex',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110002'
    },
    isApproved: true,
    isActive: true,
    isVerified: true
  },
  // Additional test users for pending approval demo
  {
    username: 'pendingfarmer',
    email: 'pending.farmer@example.com',
    password: 'Pending123!',
    firstName: 'Pending',
    lastName: 'Farmer',
    role: 'farmer',
    phone: '+9876543213',
    address: {
      street: 'Test Farm Road',
      city: 'Agra',
      state: 'Uttar Pradesh',
      country: 'India',
      postalCode: '282001'
    },
    farmerProfile: {
      farmName: 'Pending Approval Farms',
      farmSize: 15,
      farmingType: 'conventional',
      specializations: ['Mint', 'Coriander'],
      experienceYears: 5,
      registrationNumber: 'PA2024003'
    },
    isApproved: false, // Pending approval for demo
    isActive: true,
    isVerified: false
  },
  {
    username: 'pendingprocessor',
    email: 'pending.processor@example.com',
    password: 'Pending123!',
    firstName: 'Pending',
    lastName: 'Processor',
    role: 'processor',
    phone: '+9876543214',
    address: {
      street: 'Processing Zone',
      city: 'Noida',
      state: 'Uttar Pradesh',
      country: 'India',
      postalCode: '201301'
    },
    processorProfile: {
      companyName: 'Pending Processing Co.',
      facilityType: 'packaging',
      capacity: 500,
      licenseNumber: 'PP2024002',
      processingMethods: ['Packaging', 'Labeling']
    },
    isApproved: false, // Pending approval for demo
    isActive: true,
    isVerified: false
  }
];

async function seedDemoUsers() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/traceherbss');
    console.log('✅ Connected to MongoDB');

    console.log('🧹 Checking for existing demo users...');
    
    // Create or update users
    for (const userData of demoUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
          $or: [
            { email: userData.email },
            { username: userData.username }
          ]
        });

        if (existingUser) {
          // Update existing user with new data (except password if it's already set)
          const updateData = { ...userData };
          if (existingUser.password) {
            delete updateData.password; // Don't overwrite existing password
          }
          
          await User.findByIdAndUpdate(existingUser._id, updateData, { new: true });
          console.log(`🔄 Updated existing user: ${userData.email}`);
        } else {
          // Create new user
          const user = new User(userData);
          await user.save();
          console.log(`✅ Created new user: ${userData.email}`);
        }
      } catch (userError) {
        console.error(`❌ Error processing user ${userData.email}:`, userError.message);
      }
    }

    console.log('\n🎉 Demo user seeding completed!');
    console.log('\n📋 Available Demo Credentials:');
    console.log('=====================================');
    
    demoUsers.forEach(user => {
      console.log(`👤 ${user.role.toUpperCase()}: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Status: ${user.isApproved ? 'Approved' : 'Pending Approval'}`);
      console.log('');
    });

    console.log('📝 Login URLs:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend API: http://localhost:3001/api/auth/login');
    console.log('   Admin Dashboard: http://localhost:3000/admin (use admin@traceherbss.com)');
    console.log('');

    const totalUsers = await User.countDocuments();
    const approvedUsers = await User.countDocuments({ isApproved: true });
    const pendingUsers = await User.countDocuments({ isApproved: false });
    
    console.log('📊 Database Statistics:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Approved Users: ${approvedUsers}`);
    console.log(`   Pending Approval: ${pendingUsers}`);

  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding script
if (require.main === module) {
  console.log('🚀 Starting TraceHerbss Demo User Seeding...\n');
  seedDemoUsers();
}

module.exports = { seedDemoUsers, demoUsers };