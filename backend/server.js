const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Sample data for demonstration
const products = {
  'batch123': {
    name: 'Ashwagandha Root',
    timeline: [
      { label: 'Harvested', date: '2025-09-01', status: 'complete', icon: '🌱' },
      { label: 'Lab Tested', date: '2025-09-05', status: 'complete', icon: '🧪' },
      { label: 'Packaged', date: '2025-09-10', status: 'complete', icon: '📦' },
      { label: 'Shipped', date: '2025-09-12', status: 'pending', icon: '🚚' }
    ],
    geoPath: [
      [19.076, 72.877], [19.218, 73.164], [19.997, 73.789], [20.5937, 78.9629]
    ],
    labResults: [
      { test: 'Purity', value: 98 },
      { test: 'Moisture', value: 12 },
      { test: 'Heavy Metals', value: 0.2 }
    ],
    farmer: {
      name: 'Ravi Patil',
      region: 'Nashik, Maharashtra',
      story: 'Ravi has been cultivating Ashwagandha for 15 years using organic methods.',
      photo: ''
    },
    badges: ['Organic', 'Fair Trade', 'Geo-Tagged']
  }
  // Add more batches as needed
};

// Dummy collections data
const collections = [
  { id: 1, batchId: 'batch123', date: '2025-09-01', farmer: 'Ravi Patil', amount: 100 },
];

// Dummy quality tests data
const qualityTests = [
  { id: 1, batchId: 'batch123', test: 'Purity', value: 98 },
];

// Dummy processing steps data
const processingSteps = [
  { id: 1, batchId: 'batch123', step: 'Drying', date: '2025-09-02' },
];

// Dummy users for auth
const users = [
  { username: 'demo', password: 'demo123' }
];

app.get('/api/products/:batchId', (req, res) => {
  const { batchId } = req.params;
  const product = products[batchId];
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/collection', (req, res) => {
  res.json(collections);
});

app.get('/api/qualitytest', (req, res) => {
  res.json(qualityTests);
});

app.get('/api/processingstep', (req, res) => {
  res.json(processingSteps);
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) return res.json({ success: true, username });
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.post('/api/auth/signup', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ success: false, message: 'User exists' });
  }
  users.push({ username, password });
  res.json({ success: true, username });
});

app.post('/api/collection', (req, res) => {
  const data = req.body;
  collections.push({ ...data, id: collections.length + 1 });
  res.json({ success: true });
});

app.post('/api/recall', (req, res) => {
  const { batchId } = req.body;
  // Simulate recall
  res.json({ success: true, recalled: batchId });
});

app.listen(PORT, () => {
  console.log(`Traceherbs backend running on http://localhost:${PORT}`);
});
