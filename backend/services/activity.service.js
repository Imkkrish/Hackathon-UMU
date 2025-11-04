import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACTIVITY_LOG_DIR = path.join(__dirname, '../logs');
const ACTIVITY_LOG_FILE = path.join(ACTIVITY_LOG_DIR, 'user-activity.json');

if (!fs.existsSync(ACTIVITY_LOG_DIR)) {
  fs.mkdirSync(ACTIVITY_LOG_DIR, { recursive: true });
}

let activityData = [];

function loadActivityLog() {
  try {
    if (fs.existsSync(ACTIVITY_LOG_FILE)) {
      const data = fs.readFileSync(ACTIVITY_LOG_FILE, 'utf8');
      activityData = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading activity log:', error);
    activityData = [];
  }
}

function saveActivityLog() {
  try {
    fs.writeFileSync(ACTIVITY_LOG_FILE, JSON.stringify(activityData, null, 2));
  } catch (error) {
    console.error('Error saving activity log:', error);
  }
}

export function logUserActivity(userId, action, details = {}) {
  const activity = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: userId || 'anonymous',
    action: action,
    details: details,
    timestamp: new Date().toISOString(),
    ip: details.ip || null
  };

  activityData.push(activity);

  if (activityData.length > 10000) {
    activityData = activityData.slice(-10000);
  }

  saveActivityLog();
  return activity;
}

export function getUserActivity(userId, limit = 100) {
  if (!userId) {
    return activityData.slice(-limit);
  }
  
  return activityData
    .filter(activity => activity.userId === userId)
    .slice(-limit);
}

export function getActivityStats() {
  const stats = {
    totalActivities: activityData.length,
    uniqueUsers: new Set(activityData.map(a => a.userId)).size,
    actionCounts: {},
    recentActivity: activityData.slice(-10)
  };

  activityData.forEach(activity => {
    stats.actionCounts[activity.action] = (stats.actionCounts[activity.action] || 0) + 1;
  });

  return stats;
}

export function clearOldActivity(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const originalLength = activityData.length;
  activityData = activityData.filter(activity => 
    new Date(activity.timestamp) > cutoffDate
  );

  saveActivityLog();
  return originalLength - activityData.length;
}

loadActivityLog();

export default {
  logUserActivity,
  getUserActivity,
  getActivityStats,
  clearOldActivity
};
