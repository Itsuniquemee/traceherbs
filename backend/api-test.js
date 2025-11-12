const http = require('http');

async function testAPI() {
  console.log('🧪 Testing TraceHerbss Backend API...\n');

  const testEndpoint = (path, method = 'GET', data = null) => {
    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve({
              status: res.statusCode,
              path: path,
              success: res.statusCode < 400,
              data: parsed
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              path: path,
              success: res.statusCode < 400,
              data: responseData
            });
          }
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

      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  };

  // Test endpoints
  const tests = [
    { path: '/api/health', method: 'GET' },
    { path: '/api/routes', method: 'GET' },
    { path: '/api/auth/test', method: 'POST', data: { test: 'data' } },
    { path: '/nonexistent', method: 'GET' }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.method} ${test.path}...`);
      const result = await testEndpoint(test.path, test.method, test.data);
      
      if (result.success) {
        console.log(`✅ ${test.path} - Status: ${result.status}`);
        if (result.data && typeof result.data === 'object') {
          console.log(`   Response: ${result.data.message || 'OK'}`);
        }
      } else {
        console.log(`❌ ${test.path} - Status: ${result.status}`);
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
      }
      console.log('');
    } catch (error) {
      console.log(`❌ ${test.path} - Error: ${error.message}\n`);
    }
  }

  console.log('🎉 API testing completed!\n');
}

// Run tests after a delay to ensure server is ready
setTimeout(testAPI, 3000);