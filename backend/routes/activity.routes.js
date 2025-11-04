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

// Clear activities older than X days
router.delete('/clear-old', async (req, res) => {
  try {
    const daysOld = parseInt(req.query.days) || 30;
    const { clearOldActivity } = await import('../services/activity.service.js');
    const deletedCount = clearOldActivity(daysOld);

    res.json({
      success: true,
      message: `Cleared ${deletedCount} old activities`,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('Activity clear error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Clear ALL activities (for testing/debugging)
router.delete('/clear-all', async (req, res) => {
  try {
    const { clearAllActivities } = await import('../services/activity.service.js');
    const deletedCount = clearAllActivities();

    res.json({
      success: true,
      message: `Cleared all ${deletedCount} activities`,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('Activity clear error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
