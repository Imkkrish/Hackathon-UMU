import axios from 'axios';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

export async function matchAddress(text, options = {}) {
  try {
    const response = await axios.post(`${ML_API_URL}/api/ml/match`, {
      text: text,
      top_k: options.top_k || 5,
      include_digipin: options.include_digipin !== false
    }, {
      timeout: options.timeout || 30000
    });

    return response.data;
  } catch (error) {
    console.error('ML service error:', error.message);
    throw new Error(`ML service unavailable: ${error.message}`);
  }
}

export async function extractTextFromImage(imageBuffer) {
  try {
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('file', imageBuffer, 'image.jpg');

    const response = await axios.post(`${ML_API_URL}/api/ml/ocr`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('ML OCR error:', error.message);
    throw new Error(`ML OCR service unavailable: ${error.message}`);
  }
}

export async function normalizeText(text) {
  try {
    const response = await axios.post(`${ML_API_URL}/api/ml/normalize`, {
      text: text
    }, {
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    console.error('ML normalization error:', error.message);
    throw new Error(`ML service unavailable: ${error.message}`);
  }
}

export async function ocrAndMatch(imageBuffer, options = {}) {
  try {
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('file', imageBuffer, 'image.jpg');
    formData.append('top_k', options.top_k || 5);

    const response = await axios.post(`${ML_API_URL}/api/ml/ocr_match`, formData, {
      headers: formData.getHeaders(),
      timeout: 40000
    });

    return response.data;
  } catch (error) {
    console.error('ML OCR+Match error:', error.message);
    throw new Error(`ML service unavailable: ${error.message}`);
  }
}

export async function checkMLHealth() {
  try {
    const response = await axios.get(`${ML_API_URL}/health`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

export default {
  matchAddress,
  extractTextFromImage,
  normalizeText,
  ocrAndMatch,
  checkMLHealth
};
