#!/usr/bin/env node

// Simple System Verification Script for TraceHerbss
// Uses curl commands to test the system functionality

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

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

let testResults = { passed: 0, failed: 0, total: 0 };

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

async function checkHealth() {
  try {
    log('\n🔍 CHECKING SERVER HEALTH', 'bold');
    log('=' .repeat(50), 'cyan');

    // Check backend health
    const { stdout: backendHealth } = await execAsync(`curl -s -w "%{http_code}" ${BASE_URL}/api/health`, { timeout: 10000 });
    const backendWorking = backendHealth.includes('"success":true') && backendHealth.includes('200');
    logTest('Backend Health Check', backendWorking);

    // Check frontend
    const { stdout: frontendCheck } = await execAsync(`curl -s -I ${FRONTEND_URL} | head -1`, { timeout: 10000 });
    const frontendWorking = frontendCheck.includes('200 OK');
    logTest('Frontend Availability', frontendWorking);

    return backendWorking;
  } catch (error) {
    logTest('Server Health Check', false, error.message);
    return false;
  }
}

async function testLogin(email, password, shouldSucceed, roleName) {
  try {
    const loginData = JSON.stringify({ email, password });
    const curlCmd = `curl -s -w "\\n%{http_code}" -X POST ${BASE_URL}/api/auth/login -H "Content-Type: application/json" -d '${loginData}'`;
    
    const { stdout } = await execAsync(curlCmd, { timeout: 10000 });
    const lines = stdout.trim().split('\n');
    const statusCode = lines[lines.length - 1];
    const response = lines.slice(0, -1).join('\n');

    if (shouldSucceed) {
      const success = statusCode === '200' && response.includes('"success":true');
      logTest(`${roleName} Login`, success);
      
      // Return token for admin if successful
      if (success && roleName.includes('Admin')) {
        try {
          const data = JSON.parse(response);
          return data.token;
        } catch (e) {
          return null;
        }
      }
    } else {
      const blocked = statusCode === '403' && response.includes('awaiting admin approval');
      logTest(`${roleName} Login (Should be Blocked)`, blocked);
    }
  } catch (error) {
    logTest(`${roleName} Login`, false, error.message);
  }
  return null;
}

async function testAuthentication() {
  log('\n🔐 TESTING AUTHENTICATION', 'bold');
  log('=' .repeat(50), 'cyan');

  // Test approved users
  const adminToken = await testLogin('admin@traceherbss.com', 'Admin123!', true, 'Admin');
  await testLogin('tanvi@traceherbss.com', 'Tanvi123!', true, 'Farmer (Tanvi)');
  await testLogin('farmer@traceherbss.com', 'Farmer123!', true, 'Farmer (Demo)');
  await testLogin('processor@traceherbss.com', 'Processor123!', true, 'Processor');
  await testLogin('consumer@traceherbss.com', 'Consumer123!', true, 'Consumer');
  await testLogin('regulator@traceherbss.com', 'Regulator123!', true, 'Regulator');

  // Test pending users (should fail)
  await testLogin('pending.farmer@example.com', 'Pending123!', false, 'Pending Farmer');
  await testLogin('pending.processor@example.com', 'Pending123!', false, 'Pending Processor');

  return adminToken;
}

async function testAdminFunctions(adminToken) {
  if (!adminToken) {
    log('\n⚠️  Skipping admin tests - no admin token available', 'yellow');
    return;
  }

  log('\n👨‍💼 TESTING ADMIN FUNCTIONS', 'bold');
  log('=' .repeat(50), 'cyan');

  try {
    // Test get pending users
    const curlCmd = `curl -s -w "\\n%{http_code}" -H "Authorization: Bearer ${adminToken}" ${BASE_URL}/api/admin/pending-users`;
    const { stdout } = await execAsync(curlCmd, { timeout: 10000 });
    const lines = stdout.trim().split('\n');
    const statusCode = lines[lines.length - 1];
    const response = lines.slice(0, -1).join('\n');

    const success = statusCode === '200' && response.includes('"success":true');
    logTest('Get Pending Users', success);

    if (success) {
      try {
        const data = JSON.parse(response);
        const pendingCount = data.data ? data.data.length : 0;
        log(`ℹ️  Found ${pendingCount} pending users`, 'blue');
      } catch (e) {
        // Ignore parsing errors
      }
    }
  } catch (error) {
    logTest('Admin Functions', false, error.message);
  }
}

function printSummary() {
  log('\n📊 TEST SUMMARY', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  
  log(`Total Tests: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  
  let rateColor = 'green';
  if (successRate < 75) rateColor = 'red';
  else if (successRate < 90) rateColor = 'yellow';
  log(`Success Rate: ${successRate}%`, rateColor);

  if (testResults.failed === 0) {
    log('\n🎉 ALL SYSTEMS OPERATIONAL!', 'green');
    log('✨ TraceHerbss is ready for use with demo credentials', 'green');
  } else if (testResults.passed > testResults.failed) {
    log('\n⚠️  Mostly working with some issues. Check details above.', 'yellow');
  } else {
    log('\n❌ Multiple issues detected. Review system configuration.', 'red');
  }

  log('\n🌐 Access Information:', 'bold');
  log(`📱 Frontend:    ${FRONTEND_URL}`, 'cyan');
  log(`⚙️  Backend:     ${BASE_URL}`, 'cyan');
  log(`👨‍💼 Admin Panel: ${FRONTEND_URL}/admin`, 'cyan');
  log(`📊 Health Check: ${BASE_URL}/api/health`, 'cyan');
}

async function runVerification() {
  log('🚀 TRACEHERBSS SYSTEM VERIFICATION', 'bold');
  log('Testing system functionality with demo credentials...', 'blue');
  
  const serversOk = await checkHealth();
  if (!serversOk) {
    log('\n❌ Backend server not accessible. Please ensure it\'s running on port 3001.', 'red');
    log('💡 Try: cd backend && node working-server.js', 'yellow');
    process.exit(1);
  }

  const adminToken = await testAuthentication();
  await testAdminFunctions(adminToken);
  
  printSummary();
  
  log('\n📋 Quick Demo Test Commands:', 'bold');
  log('curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d \'{"email":"admin@traceherbss.com","password":"Admin123!"}\'', 'cyan');
  log('curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d \'{"email":"tanvi@traceherbss.com","password":"Tanvi123!"}\'', 'cyan');
}

// Run verification
if (require.main === module) {
  runVerification().catch(error => {
    log(`\n💥 Verification failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runVerification };