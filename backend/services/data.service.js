import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let postOfficeData = [];
let pincodeIndex = new Map();
let officeNameIndex = new Map();
let districtIndex = new Map();
let stateIndex = new Map();
let isInitialized = false;

export async function initializeDataService() {
  if (isInitialized) {
    return;
  }
  const csvPath = process.env.CSV_PATH || path.join(__dirname, '../../post/all_india_pincode_directory_2025.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at: ${csvPath}`);
  }
  return new Promise((resolve, reject) => {
    let recordCount = 0;
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        const record = {
          circlename: row.circlename || '',
          regionname: row.regionname || '',
          divisionname: row.divisionname || '',
          officename: row.officename || '',
          pincode: row.pincode || '',
          officetype: row.officetype || '',
          delivery: row.delivery || '',
          district: row.district || '',
          statename: row.statename || '',
          latitude: row.latitude && row.latitude !== 'NA' ? parseFloat(row.latitude) : null,
          longitude: row.longitude && row.longitude !== 'NA' ? parseFloat(row.longitude) : null
        };
        if (!record.latitude || !record.longitude || record.delivery === 'Non-Delivery') {
          return;
        }
        postOfficeData.push(record);
        recordCount++;
        if (!pincodeIndex.has(record.pincode)) {
          pincodeIndex.set(record.pincode, []);
        }
        pincodeIndex.get(record.pincode).push(record);
        const officeKey = record.officename.toLowerCase();
        if (!officeNameIndex.has(officeKey)) {
          officeNameIndex.set(officeKey, []);
        }
        officeNameIndex.get(officeKey).push(record);
        const districtKey = record.district.toLowerCase();
        if (!districtIndex.has(districtKey)) {
          districtIndex.set(districtKey, []);
        }
        districtIndex.get(districtKey).push(record);
        const stateKey = record.statename.toLowerCase();
        if (!stateIndex.has(stateKey)) {
          stateIndex.set(stateKey, []);
        }
        stateIndex.get(stateKey).push(record);
      })
      .on('end', () => {
        isInitialized = true;
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Get all post office records
 */
export function getAllRecords() {
  return postOfficeData;
}

/**
 * Get post offices by PIN code
 */
export function getByPincode(pincode) {
  return pincodeIndex.get(pincode) || [];
}

/**
 * Search post offices by query (office name, district, or state)
 */
export function searchPostOffices(query, limit = 50) {
  if (!query) return [];
  
  const searchTerm = query.toLowerCase().trim();
  const results = new Set();

  // Search in office names
  for (const [key, records] of officeNameIndex.entries()) {
    if (key.includes(searchTerm)) {
      records.forEach(r => results.add(r));
    }
  }

  // Search in districts
  for (const [key, records] of districtIndex.entries()) {
    if (key.includes(searchTerm)) {
      records.forEach(r => results.add(r));
    }
  }

  // Search in states
  for (const [key, records] of stateIndex.entries()) {
    if (key.includes(searchTerm)) {
      records.forEach(r => results.add(r));
    }
  }

  // Convert Set to Array and limit results
  return Array.from(results).slice(0, limit);
}

/**
 * Get statistics about the dataset
 */
export function getDataStats() {
  return {
    totalRecords: postOfficeData.length,
    uniquePincodes: pincodeIndex.size,
    uniqueOffices: officeNameIndex.size,
    uniqueDistricts: districtIndex.size,
    uniqueStates: stateIndex.size,
    isInitialized: isInitialized
  };
}

/**
 * Validate if a PIN code and office combination exists
 */
export function validatePinOffice(pincode, officename) {
  const offices = getByPincode(pincode);
  if (!offices || offices.length === 0) {
    return { valid: false, message: 'PIN code not found' };
  }

  const officeLower = officename.toLowerCase();
  const match = offices.find(o => o.officename.toLowerCase() === officeLower);
  
  if (match) {
    return { valid: true, office: match };
  } else {
    return { 
      valid: false, 
      message: 'Office name does not match PIN code',
      availableOffices: offices.map(o => o.officename)
    };
  }
}

/**
 * Get post offices by district
 */
export function getByDistrict(district, limit = 100) {
  const districtKey = district.toLowerCase();
  const offices = districtIndex.get(districtKey) || [];
  return offices.slice(0, limit);
}

/**
 * Get post offices by state
 */
export function getByState(state, limit = 100) {
  const stateKey = state.toLowerCase();
  const offices = stateIndex.get(stateKey) || [];
  return offices.slice(0, limit);
}

export default {
  initializeDataService,
  getAllRecords,
  getByPincode,
  searchPostOffices,
  getDataStats,
  validatePinOffice,
  getByDistrict,
  getByState
};
