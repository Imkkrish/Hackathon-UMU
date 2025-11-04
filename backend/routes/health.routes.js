import express from 'express';
import * as dataService from '../services/data.service.js';
import * as mlService from '../services/ml.service.js';
import * as digipinService from '../services/digipin.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        backend: {
          status: 'healthy',
          uptime: process.uptime(),
          memory: process.memoryUsage()
        },
        data: {
          status: dataService.isInitialized ? 'healthy' : 'initializing',
          stats: dataService.isInitialized ? dataService.getStats() : null
        },
        ml: await mlService.checkMLHealth(),
        digipin: await digipinService.checkDigipinHealth()
      }
    };

    const allHealthy = Object.values(health.services).every(
      service => service.status === 'healthy'
    );

    if (!allHealthy) {
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

router.get('/ready', (req, res) => {
  if (dataService.isInitialized) {
    res.json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready', reason: 'Data service initializing' });
  }
});

router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

export default router;
