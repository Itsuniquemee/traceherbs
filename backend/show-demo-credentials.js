#!/usr/bin/env node

// Display Demo Credentials Script
console.log('\n🎉 TraceHerbss Demo Credentials Successfully Added!\n');
console.log('=' .repeat(60));
console.log('📋 DEMO LOGIN CREDENTIALS');
console.log('=' .repeat(60));

const credentials = [
  {
    role: 'ADMIN',
    email: 'admin@traceherbss.com',
    password: 'Admin123!',
    status: '✅ Approved',
    description: 'Full system access, manage user approvals'
  },
  {
    role: 'FARMER (Tanvi)',
    email: 'tanvi@traceherbss.com', 
    password: 'Tanvi123!',
    status: '✅ Approved',
    description: 'Tanvi Organic Farms, Bulandshahr'
  },
  {
    role: 'FARMER (Demo)',
    email: 'farmer@traceherbss.com',
    password: 'Farmer123!',
    status: '✅ Approved', 
    description: 'Green Valley Farms, Meerut'
  },
  {
    role: 'PROCESSOR',
    email: 'processor@traceherbss.com',
    password: 'Processor123!',
    status: '✅ Approved',
    description: 'HerbalTech Processing Ltd, Ghaziabad'
  },
  {
    role: 'CONSUMER',
    email: 'consumer@traceherbss.com',
    password: 'Consumer123!',
    status: '✅ Approved',
    description: 'End consumer, Delhi'
  },
  {
    role: 'REGULATOR',
    email: 'regulator@traceherbss.com',
    password: 'Regulator123!',
    status: '✅ Approved',
    description: 'Regulatory Officer, New Delhi'
  }
];

credentials.forEach((cred, index) => {
  console.log(`${index + 1}. 👤 ${cred.role}`);
  console.log(`   📧 Email: ${cred.email}`);
  console.log(`   🔒 Password: ${cred.password}`);
  console.log(`   📊 Status: ${cred.status}`);
  console.log(`   📝 Info: ${cred.description}`);
  console.log('');
});

console.log('⏳ PENDING APPROVAL DEMO ACCOUNTS:');
console.log('─'.repeat(40));
console.log('👤 FARMER (Pending)');
console.log('   📧 Email: pending.farmer@example.com');
console.log('   🔒 Password: Pending123!');
console.log('   📊 Status: ⏳ Awaiting Approval');
console.log('');
console.log('👤 PROCESSOR (Pending)');
console.log('   📧 Email: pending.processor@example.com');
console.log('   🔒 Password: Pending123!');  
console.log('   📊 Status: ⏳ Awaiting Approval');
console.log('');

console.log('🌐 APPLICATION URLS:');
console.log('─'.repeat(40));
console.log('🖥️  Frontend: http://localhost:3000');
console.log('⚙️  Backend API: http://localhost:3001');
console.log('👨‍💼 Admin Panel: http://localhost:3000/admin');
console.log('📊 API Health: http://localhost:3001/api/health');
console.log('');

console.log('🧪 TESTING SCENARIOS:');
console.log('─'.repeat(40));
console.log('1. 🔐 User Authentication: Login with any approved account');
console.log('2. ✅ Admin Approval: Login as admin → approve pending users');
console.log('3. 🌾 Farmer Features: Login as farmer → create batches, QR codes');
console.log('4. 🏭 Processor Features: Login as processor → update batch status');
console.log('5. 👤 Consumer Features: Login as consumer → verify products');
console.log('6. 🏛️ Regulatory Features: Login as regulator → compliance checks');
console.log('');

console.log('📋 NEXT STEPS:');
console.log('─'.repeat(40));
console.log('1. 🚀 Start frontend: cd frontend && npm start');
console.log('2. ⚙️  Backend is running on port 3001');
console.log('3. 🌐 Access app at http://localhost:3000');
console.log('4. 📖 See DEMO_CREDENTIALS.md for detailed instructions');
console.log('');

console.log('✨ Happy Testing! ✨');
console.log('=' .repeat(60));