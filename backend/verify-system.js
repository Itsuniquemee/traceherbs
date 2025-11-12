#!/usr/bin/env node

// System Verification Script for TraceHerbss
// This script tests all major functionality to ensure everything is working

const http = require('http');
const https = require('https');
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

// Demo credentials for testing
const testCredentials = [
  {
    role: 'Admin',
    email: 'admin@traceherbss.com',
    password: 'Admin123!',
    shouldSucceed: true
  },
  {
    role: 'Farmer (Tanvi)',
    email: 'tanvi@traceherbss.com',
    password: 'Tanvi123!',
    shouldSucceed: true
  },
  {
    role: 'Farmer (Demo)',
    email: 'farmer@traceherbss.com',
    password: 'Farmer123!',
    shouldSucceed: true
  },
  {
    role: 'Processor',
    email: 'processor@traceherbss.com',
    password: 'Processor123!',
    shouldSucceed: true
  },
  {
    role: 'Consumer',
    email: 'consumer@traceherbss.com',
    password: 'Consumer123!',
    shouldSucceed: true
  },
  {
    role: 'Regulator',
    email: 'regulator@traceherbss.com',
    password: 'Regulator123!',
    shouldSucceed: true
  },
  {
    role: 'Pending Farmer',
    email: 'pending.farmer@example.com',
    password: 'Pending123!',
    shouldSucceed: false,
    expectedMessage: 'awaiting admin approval'
  },
  {
    role: 'Pending Processor',
    email: 'pending.processor@example.com',
    password: 'Pending123!',
    shouldSucceed: false,
    expectedMessage: 'awaiting admin approval'
  }
];

let adminToken = null;
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, success, details = '') {
  testResults.total++;
  if (success) {
    testResults.passed++;
    log(`✅ ${testName}${details ? ' - ' + details : ''}`, 'green');
  } else {
    testResults.failed++;
    log(`❌ ${testName}${details ? ' - ' + details : ''}`, 'red');
  }
}

async function checkServerStatus() {
  try {
    log('\n🔍 CHECKING SERVER STATUS', 'bold');
    log('=' .repeat(50), 'cyan');

    // Check backend health
    const backendResponse = await axios.get(`${BASE_URL}/api/health`, { timeout: 5000 });
    logTest('Backend Server Health', backendResponse.status === 200 && backendResponse.data.success);

    // Check frontend availability
    const frontendResponse = await axios.get(FRONTEND_URL, { timeout: 5000 });
    logTest('Frontend Server Availability', frontendResponse.status === 200);

    return true;
  } catch (error) {
    logTest('Server Status Check', false, error.message);
    return false;
  }
}

async function testAuthentication() {
  log('\n🔐 TESTING AUTHENTICATION', 'bold');
  log('=' .repeat(50), 'cyan');

  for (const cred of testCredentials) {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: cred.email,
        password: cred.password
      }, { timeout: 5000 });

      if (cred.shouldSucceed) {
        const success = response.data.success && response.data.token;
        logTest(`${cred.role} Login`, success);
        
        // Store admin token for later tests
        if (cred.role === 'Admin' && success) {
          adminToken = response.data.token;
        }
      } else {
        logTest(`${cred.role} Login (Should Fail)`, false, 'Unexpected success');
      }
    } catch (error) {
      if (cred.shouldSucceed) {
        logTest(`${cred.role} Login`, false, error.response?.data?.message || error.message);
      } else {
        const expectedFailure = error.response?.data?.message?.toLowerCase().includes(cred.expectedMessage);
        logTest(`${cred.role} Login Blocked`, expectedFailure, error.response?.data?.message);
      }
    }
  }
}

async function testAdminFunctions() {
  if (!adminToken) {
    log('\n⚠️  Skipping admin tests - no admin token available', 'yellow');
    return;
  }

  log('\n👨‍💼 TESTING ADMIN FUNCTIONS', 'bold');
  log('=' .repeat(50), 'cyan');

  try {
    // Test get pending users
    const pendingResponse = await axios.get(`${BASE_URL}/api/admin/pending-users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      timeout: 5000
    });

    const hasPendingUsers = pendingResponse.data.success && pendingResponse.data.data.length >= 0;
    logTest('Get Pending Users', hasPendingUsers, `Found ${pendingResponse.data.data?.length || 0} pending users`);

    // Test if there are pending users to approve
    if (pendingResponse.data.data && pendingResponse.data.data.length > 0) {
      const pendingUser = pendingResponse.data.data[0];
      
      // Test approve user
      const approveResponse = await axios.put(`${BASE_URL}/api/admin/users/${pendingUser._id}/approve`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
        timeout: 5000
      });

      logTest('Approve Pending User', approveResponse.data.success, `Approved ${pendingUser.email}`);

      // Test login of newly approved user
      try {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: pendingUser.email,
          password: 'Pending123!'
        }, { timeout: 5000 });

        logTest('Newly Approved User Login', loginResponse.data.success, `${pendingUser.email} can now login`);
      } catch (loginError) {
        logTest('Newly Approved User Login', false, loginError.response?.data?.message);
      }
    } else {
      log('ℹ️  No pending users found to test approval workflow', 'blue');
    }

  } catch (error) {
    logTest('Admin Functions', false, error.response?.data?.message || error.message);
  }
}

async function testDatabaseConnection() {
  log('\n💾 TESTING DATABASE CONNECTION', 'bold');
  log('=' .repeat(50), 'cyan');

  try {
    // Use a simple API call that requires database access
    const response = await axios.get(`${BASE_URL}/api/health`, { timeout: 5000 });
    const dbConnected = response.data.database?.status === 'connected';
    logTest('MongoDB Connection', dbConnected, response.data.database?.uri);
  } catch (error) {
    logTest('Database Connection', false, error.message);
  }
}

async function testUserApprovalWorkflow() {
  log('\n⚡ TESTING APPROVAL WORKFLOW', 'bold');
  log('=' .repeat(50), 'cyan');

  // Test 1: Unapproved user cannot login
  let pendingUserBlocked = false;
  try {
    await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'pending.farmer@example.com',
      password: 'Pending123!'
    });
  } catch (error) {
    pendingUserBlocked = error.response?.status === 403 && 
                        error.response?.data?.message?.includes('awaiting admin approval');
  }
  logTest('Pending User Login Blocked', pendingUserBlocked);

  // Test 2: Admin can view pending users
  if (adminToken) {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/pending-users`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      logTest('Admin Can View Pending Users', response.data.success);
    } catch (error) {
      logTest('Admin Can View Pending Users', false, error.message);
    }
  }
}

function printSummary() {
  log('\n📊 TEST SUMMARY', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  
  log(`Total Tests: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 75 ? 'yellow' : 'red');

  if (testResults.failed === 0) {
    log('\n🎉 ALL SYSTEMS OPERATIONAL!', 'green');
    log('✨ TraceHerbss is ready for use with demo credentials', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the details above.', 'yellow');
  }

  log('\n🌐 Access URLs:', 'bold');
  log(`Frontend: ${FRONTEND_URL}`, 'cyan');
  log(`Backend:  ${BASE_URL}`, 'cyan');
  log(`Admin:    ${FRONTEND_URL}/admin`, 'cyan');
}

async function runVerification() {
  log('🚀 TRACEHERBSS SYSTEM VERIFICATION', 'bold');
  log('Starting comprehensive system test...', 'blue');
  
  const serverOk = await checkServerStatus();
  if (!serverOk) {
    log('\n❌ Servers not accessible. Please ensure both frontend and backend are running.', 'red');
    process.exit(1);
  }

  await testDatabaseConnection();
  await testAuthentication();
  await testAdminFunctions();
  await testUserApprovalWorkflow();
  
  printSummary();
}

// Handle axios defaults
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 500; // Don't throw for 4xx errors
};

// Run verification
if (require.main === module) {
  runVerification().catch(error => {
    log(`\n💥 Verification failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runVerification };