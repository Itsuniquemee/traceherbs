const http = require('http');

const testEndpoint = (path, method = 'GET') => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          path: path,
          success: res.statusCode < 400
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'ERROR',
        path: path,
        success: false,
        error: err.message
      });
    });

    req.end();
  });
};

async function runTests() {
  console.log('🧪 Testing TraceHerbss Backend API Endpoints...\n');

  const endpoints = [
    '/api/health',
    '/api/auth/me',
    '/api/farmer/dashboard',
    '/api/processor/dashboard', 
    '/api/consumer/verify/test123',
    '/api/admin/users',
    '/api/analytics/overview',
    '/api/qr/batch123',
    '/api/trace/test123',
    '/api/notifications',
    '/nonexistent-route'
  ];

  for (const endpoint of endpoints) {
    try {
      const result = await testEndpoint(endpoint);
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${endpoint} - Status: ${result.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }

  console.log('\n🎉 API endpoint testing completed!');
  console.log('💡 Note: Some endpoints may return 401/403 as expected (authentication required)');
}

// Add delay to ensure server is running
setTimeout(runTests, 2000);