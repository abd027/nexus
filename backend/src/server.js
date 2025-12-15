import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow Vercel domains and localhost
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    /\.vercel\.app$/, // All Vercel deployments (including preview URLs)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
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
