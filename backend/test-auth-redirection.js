#!/usr/bin/env node

console.log('🧪 TraceHerbss Authentication & Redirection Test');
console.log('================================================\n');

const testUsers = [
  { 
    email: 'admin@traceherbss.com', 
    password: 'Admin123!', 
    role: 'admin',
    expectedRoute: '/admin/pending-approvals',
    description: 'Admin User - Should redirect to pending approvals'
  },
  { 
    email: 'farmer@traceherbss.com', 
    password: 'Farmer123!', 
    role: 'farmer',
    expectedRoute: '/farmer/crop-upload',
    description: 'Farmer User - Should redirect to crop upload'
  },
  { 
    email: 'processor@traceherbss.com', 
    password: 'Processor123!', 
    role: 'processor',
    expectedRoute: '/processor/receive-batches',
    description: 'Processor User - Should redirect to receive batches'
  },
  { 
    email: 'consumer@traceherbss.com', 
    password: 'Consumer123!', 
    role: 'consumer',
    expectedRoute: '/consumer-portal',
    description: 'Consumer User - Should redirect to consumer portal'
  },
  { 
    email: 'regulator@traceherbss.com', 
    password: 'Regulator123!', 
    role: 'regulator',
    expectedRoute: '/analytics',
    description: 'Regulator User - Should redirect to analytics'
  }
];

async function testAuthentication() {
  console.log('🔐 Testing Backend Authentication...\n');
  
  let successCount = 0;
  let totalTests = testUsers.length;

  for (const user of testUsers) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      });

      const result = await response.json();

      if (result.success && result.user && result.user.role === user.role) {
        console.log(`✅ ${user.description}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👤 Role: ${result.user.role}`);
        console.log(`   🎯 Expected Route: ${user.expectedRoute}`);
        console.log(`   🔑 Token: ${result.token.substring(0, 50)}...`);
        successCount++;
      } else {
        console.log(`❌ ${user.description}`);
        console.log(`   Error: ${result.message || 'Authentication failed'}`);
      }
      console.log('');
    } catch (error) {
      console.log(`❌ ${user.description}`);
      console.log(`   Error: ${error.message}`);
      console.log('');
    }
  }

  console.log(`📊 Test Results: ${successCount}/${totalTests} tests passed\n`);

  if (successCount === totalTests) {
    console.log('🎉 All authentication tests passed!');
    console.log('');
    console.log('🌐 Frontend Testing Instructions:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Try logging in with any of the above credentials');
    console.log('3. Verify you are redirected to the correct route for your role');
    console.log('');
    console.log('📋 Role-Based Redirection Map:');
    testUsers.forEach(user => {
      console.log(`   ${user.role.toUpperCase()}: ${user.expectedRoute}`);
    });
  } else {
    console.log('⚠️  Some authentication tests failed. Please check the backend server and database.');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires Node.js 18+ with built-in fetch support');
  console.log('   Or run: npm install node-fetch');
  process.exit(1);
}

testAuthentication();