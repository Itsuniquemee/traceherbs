#!/usr/bin/env node

// Test script to verify admin pending approvals functionality

console.log('🧪 Testing Admin Pending Approvals Functionality');
console.log('=============================================\n');

async function testAdminLogin() {
  try {
    console.log('1. Testing Admin Login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@traceherbss.com',
        password: 'Admin123!'
      })
    });

    const loginResult = await loginResponse.json();
    
    if (loginResult.success) {
      console.log('✅ Admin login successful');
      console.log(`   Token: ${loginResult.token.substring(0, 30)}...`);
      return loginResult.token;
    } else {
      throw new Error('Admin login failed');
    }
  } catch (error) {
    console.log('❌ Admin login failed:', error.message);
    return null;
  }
}

async function testPendingUsers(adminToken) {
  try {
    console.log('\n2. Testing Pending Users Endpoint...');
    const response = await fetch('http://localhost:3001/api/admin/pending-users', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Found ${result.count} pending users:`);
      result.data.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`);
      });
      return result.data;
    } else {
      throw new Error('Failed to fetch pending users');
    }
  } catch (error) {
    console.log('❌ Failed to fetch pending users:', error.message);
    return [];
  }
}

async function testUserApproval(adminToken, userId, userName) {
  try {
    console.log(`\n3. Testing User Approval for ${userName}...`);
    const response = await fetch(`http://localhost:3001/api/admin/users/${userId}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ User ${userName} approved successfully`);
      return true;
    } else {
      throw new Error(`Failed to approve user: ${result.message}`);
    }
  } catch (error) {
    console.log(`❌ Failed to approve user ${userName}:`, error.message);
    return false;
  }
}

async function testUserLogin(email, password) {
  try {
    console.log(`\n4. Testing login for newly approved user: ${email}...`);
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ User ${email} can now login successfully`);
      console.log(`   Role: ${result.user.role}`);
      return true;
    } else {
      throw new Error(`Login failed: ${result.message}`);
    }
  } catch (error) {
    console.log(`❌ Login failed for ${email}:`, error.message);
    return false;
  }
}

async function runFullTest() {
  console.log('🚀 Starting comprehensive admin approval test...\n');
  
  // Step 1: Login as admin
  const adminToken = await testAdminLogin();
  if (!adminToken) {
    console.log('💥 Test failed: Cannot proceed without admin token');
    return;
  }
  
  // Step 2: Get pending users
  const pendingUsers = await testPendingUsers(adminToken);
  if (pendingUsers.length === 0) {
    console.log('ℹ️  No pending users found');
    return;
  }
  
  // Step 3: Approve the first pending user (Raju)
  const firstUser = pendingUsers[0];
  const approved = await testUserApproval(adminToken, firstUser._id, `${firstUser.firstName} ${firstUser.lastName}`);
  
  if (approved) {
    // Step 4: Test if the approved user can now login
    await testUserLogin(firstUser.email, 'Raju123!');
  }
  
  // Step 5: Check pending users again
  console.log('\n5. Checking pending users after approval...');
  const remainingPendingUsers = await testPendingUsers(adminToken);
  
  console.log(`\n📊 Test Summary:`);
  console.log(`   Initial pending users: ${pendingUsers.length}`);
  console.log(`   Remaining pending users: ${remainingPendingUsers.length}`);
  console.log(`   Users approved: ${pendingUsers.length - remainingPendingUsers.length}`);
  
  if (approved) {
    console.log('\n🎉 Full admin approval workflow test completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Open http://localhost:3000');
    console.log('   2. Login as admin: admin@traceherbss.com / Admin123!');
    console.log('   3. Navigate to Admin > Pending Approvals');
    console.log('   4. You should see the updated pending users list');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires Node.js 18+ with built-in fetch support');
  process.exit(1);
}

runFullTest();