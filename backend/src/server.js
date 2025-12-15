import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Nexus Portal Backend running on http://localhost:${PORT}`);
  console.log(`📋 API available at http://localhost:${PORT}/api`);
});
