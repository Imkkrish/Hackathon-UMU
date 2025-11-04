import express from 'express';
import { getUserActivity, getActivityStats } from '../services/activity.service.js';

const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const activities = getUserActivity(userId, limit);

    res.json({
      success: true,
      userId: userId,
      count: activities.length,
      activities: activities
    });
  } catch (error) {
    console.error('Activity fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = getActivityStats();

    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Activity stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
