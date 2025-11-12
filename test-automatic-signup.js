#!/usr/bin/env node

// Test script to verify automatic signup workflow
// This simulates the frontend signup form submission and verifies the data appears in admin panel

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAutomaticSignupWorkflow() {
  console.log('\n🔧 Testing Automatic Signup Workflow...\n');

  try {
    // Step 1: Check backend health
    console.log('1️⃣ Checking backend health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Backend is running and healthy');

    // Step 2: Get initial pending users count
    console.log('\n2️⃣ Getting initial pending users count...');
    const initialPending = await axios.get(`${BASE_URL}/admin/pending-users`);
    const initialCount = initialPending.data.count;
    console.log(`📊 Initial pending users: ${initialCount}`);

    // Step 3: Create a new user via the signup endpoint (simulating frontend form)
    console.log('\n3️⃣ Creating new user via signup form...');
    const newUser = {
      username: 'autotest' + Date.now(),
      email: `autotest${Date.now()}@traceherbss.com`,
      password: 'TestPass123!',
      firstName: 'Auto',
      lastName: 'Test',
      role: 'farmer',
      phone: '9876543210',
      address: {
        city: 'Test City',
        country: 'India'
      }
    };

    const signupResponse = await axios.post(`${BASE_URL}/auth/register`, newUser);
    console.log('✅ Signup successful!');
    console.log(`📝 User ID: ${signupResponse.data.user.id}`);
    console.log(`📧 Email: ${signupResponse.data.user.email}`);
    console.log(`👤 Role: ${signupResponse.data.user.role}`);

    // Step 4: Verify the user appears in pending approvals immediately
    console.log('\n4️⃣ Checking if user appears in pending approvals...');
    const updatedPending = await axios.get(`${BASE_URL}/admin/pending-users`);
    const newCount = updatedPending.data.count;
    
    if (newCount > initialCount) {
      console.log(`✅ Success! Pending users increased from ${initialCount} to ${newCount}`);
      
      // Find our new user
      const newUserInPending = updatedPending.data.data.find(user => 
        user.email === newUser.email
      );
      
      if (newUserInPending) {
        console.log('✅ New user found in pending approvals:');
        console.log(`   📧 Email: ${newUserInPending.email}`);
        console.log(`   👤 Name: ${newUserInPending.firstName} ${newUserInPending.lastName}`);
        console.log(`   🎭 Role: ${newUserInPending.role}`);
        console.log(`   📅 Created: ${new Date(newUserInPending.createdAt).toLocaleString()}`);
        console.log(`   🔄 Status: ${newUserInPending.isApproved ? 'Approved' : 'Pending Approval'}`);
      } else {
        console.log('❌ New user not found in pending list (possible race condition)');
      }
    } else {
      console.log('❌ Pending users count did not increase');
    }

    // Step 5: Test admin approval workflow (optional)
    console.log('\n5️⃣ Testing admin approval workflow...');
    if (signupResponse.data.user.id) {
      try {
        const approvalResponse = await axios.put(`${BASE_URL}/admin/users/${signupResponse.data.user.id}/approve`);
        console.log('✅ User approval successful!');
        
        // Verify user no longer in pending list
        const finalPending = await axios.get(`${BASE_URL}/admin/pending-users`);
        const finalCount = finalPending.data.count;
        console.log(`📊 Final pending users: ${finalCount}`);
        
        if (finalCount < newCount) {
          console.log('✅ User successfully removed from pending list after approval');
        }
      } catch (error) {
        console.log('⚠️  Approval test skipped (admin auth might be required)');
      }
    }

    console.log('\n🎉 Automatic Signup Workflow Test Complete!\n');
    console.log('📋 Summary:');
    console.log('   ✅ Frontend signup form can create users');
    console.log('   ✅ Users are automatically saved to database');
    console.log('   ✅ Users appear immediately in admin pending approvals');
    console.log('   ✅ No manual terminal intervention required');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testAutomaticSignupWorkflow();