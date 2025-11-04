import express from 'express';
import * as dataService from '../services/data.service.js';
import * as digipinService from '../services/digipin.service.js';

const router = express.Router();

router.get('/:pincode', async (req, res) => {
  try {
    const pincode = req.params.pincode;
    
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        error: 'PIN code must be exactly 6 digits'
      });
    }

    const offices = dataService.getByPincode(pincode);

    if (!offices || offices.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No post offices found for PIN code ${pincode}`
      });
    }

    const officesWithDigipin = await Promise.all(
      offices.map(async (office) => {
        if (office.latitude && office.longitude) {
          const digipin = await digipinService.encodeDigipin(office.latitude, office.longitude);
          return { ...office, digipin };
        }
        return office;
      })
    );

    res.json({
      success: true,
      pincode: pincode,
      count: officesWithDigipin.length,
      offices: officesWithDigipin
    });

  } catch (error) {
    console.error('Pincode lookup error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/search/office', async (req, res) => {
  try {
    const { q: query, limit = 50 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }

    const results = dataService.searchByOfficeName(query, parseInt(limit));

    res.json({
      success: true,
      query: query,
      count: results.length,
      results: results
    });

  } catch (error) {
    console.error('Office search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/search/district', async (req, res) => {
  try {
    const { q: query, limit = 100 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'District name must be at least 2 characters long'
      });
    }

    const results = dataService.getByDistrict(query, parseInt(limit));

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No post offices found in district: ${query}`
      });
    }

    res.json({
      success: true,
      district: query,
      count: results.length,
      results: results
    });

  } catch (error) {
    console.error('District search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/search/state', async (req, res) => {
  try {
    const { q: query, limit = 100 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'State name must be at least 2 characters long'
      });
    }

    const results = dataService.getByState(query, parseInt(limit));

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No post offices found in state: ${query}`
      });
    }

    res.json({
      success: true,
      state: query,
      count: results.length,
      results: results
    });

  } catch (error) {
    console.error('State search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { pincode, officename } = req.body;

    if (!pincode || !officename) {
      return res.status(400).json({
        success: false,
        error: 'Both pincode and officename are required'
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        error: 'PIN code must be exactly 6 digits'
      });
    }

    const result = dataService.validatePinOffice(pincode, officename);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
