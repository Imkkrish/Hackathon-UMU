import { logUserActivity } from '../services/activity.service.js';

export function activityLogger(req, res, next) {
  const userId = req.headers['x-user-id'] || req.session?.userId || 'anonymous';
  const ip = req.ip || req.connection.remoteAddress;

  const originalJson = res.json;
  res.json = function(data) {
    if (req.method !== 'GET' && req.path !== '/api/health/live') {
      logUserActivity(userId, `${req.method} ${req.path}`, {
        ip: ip,
        userAgent: req.headers['user-agent'],
        query: req.query,
        body: req.method === 'POST' ? sanitizeBody(req.body) : undefined,
        responseStatus: res.statusCode,
        success: data?.success
      });
    }

    return originalJson.call(this, data);
  };

  next();
}

function sanitizeBody(body) {
  if (!body) return undefined;
  
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });

  if (sanitized.text && sanitized.text.length > 100) {
    sanitized.text = sanitized.text.substring(0, 100) + '...';
  }

  return sanitized;
}

export default activityLogger;
