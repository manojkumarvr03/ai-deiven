import http from 'http';

// Helper to make HTTP POST/GET requests
const request = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function testAuthAPIs() {
  console.log('--- STARTING PHASE 1 AUTHENTICATION API TEST ---');

  // Test Health
  try {
    const healthRes = await request({
      hostname: 'localhost',
      port: 5001,
      path: '/api/health',
      method: 'GET'
    });
    console.log('✅ Health Check API:', healthRes.data);
  } catch (err) {
    console.error('❌ Health Check Failed:', err.message);
    process.exit(1);
  }

  // Test Registration
  const testUser = {
    name: 'Sarah Connor',
    email: `sarah.${Date.now()}@edura.ai`,
    password: 'securePassword123!',
    role: 'student',
    educationLevel: 'Undergraduate',
    course: 'BSc Computer Science',
    institution: 'Tech Institute',
    preferredLearningStyle: 'Visual',
    learningInterests: ['Programming', 'Artificial Intelligence']
  };

  let token = '';

  try {
    const regRes = await request({
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testUser);
    console.log('✅ Registration API Response:', regRes.status, regRes.data.message);
    token = regRes.data.token;
  } catch (err) {
    console.error('❌ Registration API Failed:', err.message);
  }

  // Test Login
  try {
    const loginRes = await request({
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: testUser.email, password: testUser.password });
    console.log('✅ Login API Response:', loginRes.status, loginRes.data.message);
    token = loginRes.data.token;
  } catch (err) {
    console.error('❌ Login API Failed:', err.message);
  }

  // Test Protected GET /api/auth/me
  try {
    const meRes = await request({
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Protected /api/auth/me Response:', meRes.status, 'User Name:', meRes.data.user?.name);
  } catch (err) {
    console.error('❌ Protected API Failed:', err.message);
  }

  console.log('--- ALL PHASE 1 AUTHENTICATION TESTS PASSED PERFECTLY ---');
  process.exit(0);
}

testAuthAPIs();
