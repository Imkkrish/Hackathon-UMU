import axios from 'axios';

const DIGIPIN_API_URL = process.env.DIGIPIN_API_URL || 'http://localhost:5002';

export async function encodeDigipin(latitude, longitude) {
  try {
    const response = await axios.post(`${DIGIPIN_API_URL}/api/digipin/encode`, {
      latitude: latitude,
      longitude: longitude
    }, {
      timeout: 5000
    });

    return response.data.digipin;
  } catch (error) {
    console.error('DIGIPIN encode error:', error.message);
    return null; // Return null if DIGIPIN service is unavailable
  }
}

export async function decodeDigipin(digipin) {
  try {
    const response = await axios.post(`${DIGIPIN_API_URL}/api/digipin/decode`, {
      digipin: digipin
    }, {
      timeout: 5000
    });

    return {
      latitude: parseFloat(response.data.latitude),
      longitude: parseFloat(response.data.longitude)
    };
  } catch (error) {
    console.error('DIGIPIN decode error:', error.message);
    return null;
  }
}

export async function checkDigipinHealth() {
  try {
    const response = await axios.get(`${DIGIPIN_API_URL}/`, {
      timeout: 5000
    });
    return { status: 'healthy', data: response.data };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

export async function batchEncodeDigipin(coordinates) {
  const results = await Promise.allSettled(
    coordinates.map(({ latitude, longitude }) => 
      encodeDigipin(latitude, longitude)
    )
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      return {
        ...coordinates[index],
        digipin: result.value
      };
    }
    return {
      ...coordinates[index],
      digipin: null
    };
  });
}

export default {
  encodeDigipin,
  decodeDigipin,
  checkDigipinHealth,
  batchEncodeDigipin
};
