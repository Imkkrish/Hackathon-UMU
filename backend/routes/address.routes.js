import express from 'express';
import multer from 'multer';
import * as mlService from '../services/ml.service.js';
import * as dataService from '../services/data.service.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  }
});

router.post('/match', async (req, res) => {
  try {
    const { text, top_k = 5, include_digipin = true } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text is required and must be a string'
      });
    }

    const result = await mlService.matchAddress(text, { top_k, include_digipin });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Address match error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const result = await mlService.extractTextFromImage(req.file.buffer);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/ocr-match', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const { top_k = 5 } = req.body;

    const result = await mlService.ocrAndMatch(req.file.buffer, { top_k });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('OCR+Match error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/normalize', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text is required and must be a string'
      });
    }

    const result = await mlService.normalizeText(text);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Text normalization error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { address, expectedPincode, expectedOffice } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    const result = await mlService.matchAddress(address, {
      top_k: 3,
      include_digipin: false
    });

    if (!result.matches || result.matches.length === 0) {
      return res.json({
        valid: false,
        message: 'No matching post offices found'
      });
    }

    const topMatch = result.matches[0];

    const pincodeMatches = expectedPincode ? 
      topMatch.pincode === expectedPincode : true;

    const officeMatches = expectedOffice ? 
      topMatch.officename.toLowerCase().includes(expectedOffice.toLowerCase()) : true;

    res.json({
      valid: pincodeMatches && officeMatches,
      confidence: topMatch.confidence,
      match: {
        officename: topMatch.officename,
        pincode: topMatch.pincode,
        district: topMatch.district,
        state: topMatch.state
      },
      checks: {
        pincodeMatches,
        officeMatches
      }
    });

  } catch (error) {
    console.error('Address validation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
