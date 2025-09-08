// Application configuration
export const APP_CONFIG = {
  NAME: 'Disaster Prediction Dashboard',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  DESCRIPTION: 'ระบบทำนายภัยแล้งและน้ำท่วมโดยใช้ข้อมูลจาก API ต่างๆ',
  AUTHOR: 'Disaster Prediction Team',
  SUPPORT_EMAIL: 'support@disaster-prediction.com',
  WEBSITE: 'https://disaster-prediction.com',
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: process.env.REACT_APP_ENABLE_DEBUG === 'true',
  ENABLE_MOCK_DATA: process.env.REACT_APP_ENABLE_MOCK_DATA !== 'false',
  ENABLE_PREDICTION: process.env.REACT_APP_ENABLE_PREDICTION !== 'false',
  ENABLE_EXPORT: process.env.REACT_APP_ENABLE_EXPORT === 'true',
} as const;

// UI configuration
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#3b82f6',
    SECONDARY_COLOR: '#6b7280',
    SUCCESS_COLOR: '#10b981',
    WARNING_COLOR: '#f59e0b',
    DANGER_COLOR: '#ef4444',
  },
  LAYOUT: {
    HEADER_HEIGHT: 64,
    SIDEBAR_WIDTH: 256,
    FOOTER_HEIGHT: 48,
  },
  ANIMATION: {
    DURATION: 300,
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
} as const;

// Chart configuration
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#6b7280',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#06b6d4',
  },
  DIMENSIONS: {
    HEIGHT: 256,
    MARGIN: { top: 20, right: 30, left: 20, bottom: 20 },
  },
  ANIMATION: {
    DURATION: 750,
    EASING: 'ease-out',
  },
} as const;

// Validation rules
export const VALIDATION_RULES = {
  COORDINATES: {
    LATITUDE: { min: -90, max: 90 },
    LONGITUDE: { min: -180, max: 180 },
  },
  PREDICTION: {
    MIN_FEATURES: 2,
    MAX_FEATURES: 5,
  },
  DATA: {
    MIN_POINTS: 1,
    MAX_POINTS: 1000,
  },
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  TTL: {
    API_RESPONSE: 5 * 60 * 1000, // 5 minutes
    PREDICTION_RESULT: 30 * 60 * 1000, // 30 minutes
    CHART_DATA: 10 * 60 * 1000, // 10 minutes
  },
  KEYS: {
    API_RESPONSE: 'api_response',
    PREDICTION_RESULT: 'prediction_result',
    CHART_DATA: 'chart_data',
    USER_PREFERENCES: 'user_preferences',
  },
} as const;
