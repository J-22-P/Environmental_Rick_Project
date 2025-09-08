// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.disaster-prediction.global',
  TIMEOUT: 15000, // Increased for global data
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 300000, // 5 minutes cache for global data
};

// API endpoints
export const ENDPOINTS = {
  SOIL_MOISTURE: '/v1/global/soil-moisture',
  GLACIER: '/v1/global/glacier',
  SURFACE_TEMPERATURE: '/v1/global/surface-temperature',
  FIRE_INDEX: '/v1/global/fire-index',
  SEA_LEVEL: '/v1/global/sea-level',
  PREDICTION: '/v1/global/prediction',
  HEALTH: '/v1/health',
  REGIONS: '/v1/global/regions',
  COUNTRIES: '/v1/global/countries',
  TIMEZONES: '/v1/global/timezones',
} as const;

// Request headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Unable to connect to network',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Connection timeout',
  [ERROR_CODES.SERVER_ERROR]: 'Server error occurred',
  [ERROR_CODES.VALIDATION_ERROR]: 'Invalid data provided',
  [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized access',
  [ERROR_CODES.FORBIDDEN]: 'Access denied',
  [ERROR_CODES.NOT_FOUND]: 'Data not found',
} as const;
