import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import * as mlService from '../services/ml.service.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV files are allowed.'));
    }
  }
});

router.post('/process', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No CSV file provided'
      });
    }

    const { top_k = 1 } = req.body;
    const addresses = [];
    const errors = [];

    const stream = Readable.from(req.file.buffer);
    
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          if (row.address) {
            addresses.push({
              original: row,
              address: row.address
            });
          } else {
            errors.push({
              row: row,
              error: 'Missing address column'
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (addresses.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid addresses found in CSV. CSV must have an "address" column.'
      });
    }

    const batchSize = 10;
    const results = [];

    for (let i = 0; i < addresses.length; i += batchSize) {
      const batch = addresses.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(
        batch.map(async (item) => {
          try {
            const result = await mlService.matchAddress(item.address, {
              top_k: parseInt(top_k),
              include_digipin: true
            });

            return {
              ...item.original,
              matched_data: result.matches && result.matches.length > 0 ? result.matches : null,
              status: result.matches && result.matches.length > 0 ? 'success' : 'no_match'
            };
          } catch (error) {
            return {
              ...item.original,
              matched_data: null,
              status: 'error',
              error: error.message
            };
          }
        })
      );

      results.push(...batchResults.map(r => r.status === 'fulfilled' ? r.value : r.reason));
    }

    const summary = {
      total: addresses.length,
      successful: results.filter(r => r.status === 'success').length,
      no_match: results.filter(r => r.status === 'no_match').length,
      errors: results.filter(r => r.status === 'error').length
    };

    res.json({
      success: true,
      summary: summary,
      results: results
    });

  } catch (error) {
    console.error('Batch processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
