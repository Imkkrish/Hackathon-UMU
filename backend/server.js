import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import addressRoutes from './routes/address.routes.js';
import pincodeRoutes from './routes/pincode.routes.js';
import batchRoutes from './routes/batch.routes.js';
import healthRoutes from './routes/health.routes.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import addressRoutes from './routes/address.routes.js';
import pincodeRoutes from './routes/pincode.routes.js';
import batchRoutes from './routes/batch.routes.js';
import healthRoutes from './routes/health.routes.js';
import { initializeDataService } from './services/data.service.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
app.use(helmet());
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/health', healthRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/pincode', pincodeRoutes);
app.use('/api/batch', batchRoutes);
app.get('/', (req, res) => {
  res.json({
    name: 'India Post - AI-Powered Delivery System Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      address: '/api/address',
      pincode: '/api/pincode',
      batch: '/api/batch'
    },
    documentation: 'See README.md for API documentation'
  });
});
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    error: err.name || 'Error',
    message: message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
async function startServer() {
  try {
    await initializeDataService();
    app.listen(PORT, HOST, () => {
      console.log('Server is Running!');
      console.log(`Server URL: http://${HOST}:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`ML API: ${process.env.ML_API_URL || 'http://localhost:8000'}`);
      console.log(`DIGIPIN API: ${process.env.DIGIPIN_API_URL || 'http://localhost:5000'}`);
      console.log(`Dataset: ${process.env.CSV_PATH || '../post/all_india_pincode_directory_2025.csv'}`);
      console.log('Available endpoints:');
      console.log('   GET  /api/health                  - Health check');
      console.log('   POST /api/address/match           - Match single address');
      console.log('   GET  /api/pincode/:pin            - Get PIN code details');
      console.log('   GET  /api/pincode/search          - Search post offices');
      console.log('   POST /api/batch/upload            - Upload CSV for batch processing');
      console.log('   GET  /api/batch/status/:jobId     - Get batch job status');
      console.log('   GET  /api/batch/download/:jobId   - Download batch results');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
startServer();
export default app;
      console.log(`Server URL: http://${HOST}:${PORT}`);
