import express from 'express';
import ticketRoutes from './tickets.js';
import { dataStore } from '../data.js';

const router = express.Router();

// Masters endpoint
router.get('/masters', (req, res) => {
  res.json(dataStore.masters);
});

// Tools endpoints
router.get('/tools', (req, res) => {
  res.json(dataStore.tools);
});

router.post('/tools', (req, res) => {
  try {
    const { masterId, toolName } = req.body;
    if (!masterId || !toolName) {
      return res.status(400).json({ error: 'masterId and toolName are required' });
    }

    const master = dataStore.masters.find(m => m.id === masterId);
    if (!master) {
      return res.status(404).json({ error: 'Master not found' });
    }

    // Check if tool name already exists for this master
    if (dataStore.tools.some(t => t.masterId === masterId && t.name === toolName)) {
      return res.status(400).json({ error: 'A tool with this name already exists for this master' });
    }

    const newTool = {
      id: `tool-${Date.now()}`,
      name: toolName,
      masterId
    };

    dataStore.tools.push(newTool);
    res.status(201).json(newTool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ticket routes
router.use('/tickets', ticketRoutes);

export default router;
