import { logUserActivity } from '../services/activity.service.js';

export function activityLogger(req, res, next) {
  const userId = req.headers['x-user-id'] || req.session?.userId || 'anonymous';
  const ip = req.ip || req.connection.remoteAddress;

  const originalJson = res.json;
  res.json = function(data) {
    if (req.method !== 'GET' && req.path !== '/api/health/live') {
      // Extract meaningful details from the response
      const details = {
        ip: ip,
        userAgent: req.headers['user-agent'],
        query: req.query,
        responseStatus: res.statusCode,
        success: data?.success
      };

      // Add meaningful data based on the endpoint
      if (req.path.includes('/address/match') && data?.matches && data.matches.length > 0) {
        const match = data.matches[0];
        details.matchedOffice = match.officename;
        details.district = match.district;
        details.state = match.state;
        details.pincode = match.pincode;
        details.confidence = match.confidence;
        details.queryText = data.query || req.body?.address || req.body?.text;
      } else if (req.path.includes('/batch/upload') && data?.jobId) {
        details.batchJobId = data.jobId;
        details.totalRows = data.total || 'Unknown';
      } else if (req.path.includes('/pincode/') && data?.pincode) {
        details.pincode = data.pincode;
        details.officeCount = data.count || data.offices?.length;
      } else if (req.method === 'POST' && req.body) {
        details.requestBody = sanitizeBody(req.body);
      }

      logUserActivity(userId, `${req.method} ${req.path}`, details);
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
