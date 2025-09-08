// API endpoints
export const API_ENDPOINTS = {
  SOIL_MOISTURE: '/api/soil-moisture',
  GLACIER: '/api/glacier',
  SURFACE_TEMPERATURE: '/api/surface-temperature',
  FIRE_INDEX: '/api/fire-index',
  SEA_LEVEL: '/api/sea-level',
  PREDICTION: '/api/prediction',
};

// Risk levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  EXTREME: 'extreme',
} as const;

// Risk level labels in Thai
export const RISK_LEVEL_LABELS = {
  [RISK_LEVELS.LOW]: 'ต่ำ',
  [RISK_LEVELS.MEDIUM]: 'ปานกลาง',
  [RISK_LEVELS.HIGH]: 'สูง',
  [RISK_LEVELS.EXTREME]: 'สูงมาก',
} as const;

// Model types
export const MODEL_TYPES = {
  LINEAR: 'linear',
  NEURAL: 'neural',
  ENSEMBLE: 'ensemble',
  RANDOM_FOREST: 'random_forest',
} as const;

// Model labels
export const MODEL_LABELS = {
  [MODEL_TYPES.LINEAR]: 'Linear Regression',
  [MODEL_TYPES.NEURAL]: 'Neural Network',
  [MODEL_TYPES.ENSEMBLE]: 'Ensemble Model',
  [MODEL_TYPES.RANDOM_FOREST]: 'Random Forest',
} as const;

// Feature types
export const FEATURE_TYPES = {
  SOIL_MOISTURE: 'soilMoisture',
  GLACIER_MELTING: 'glacierMelting',
  SURFACE_TEMPERATURE: 'surfaceTemperature',
  FIRE_INDEX: 'fireIndex',
  SEA_LEVEL: 'seaLevel',
} as const;

// Feature labels
export const FEATURE_LABELS = {
  [FEATURE_TYPES.SOIL_MOISTURE]: 'ความชื้นในดิน',
  [FEATURE_TYPES.GLACIER_MELTING]: 'การละลายของธารน้ำแข็ง',
  [FEATURE_TYPES.SURFACE_TEMPERATURE]: 'อุณหภูมิพื้นผิวโลก',
  [FEATURE_TYPES.FIRE_INDEX]: 'ดัชนีจุดไฟป่า',
  [FEATURE_TYPES.SEA_LEVEL]: 'ระดับน้ำทะเล',
} as const;

// Chart colors
export const CHART_COLORS = {
  [FEATURE_TYPES.SOIL_MOISTURE]: '#3b82f6',
  [FEATURE_TYPES.GLACIER_MELTING]: '#06b6d4',
  [FEATURE_TYPES.SURFACE_TEMPERATURE]: '#ef4444',
  [FEATURE_TYPES.FIRE_INDEX]: '#f97316',
  [FEATURE_TYPES.SEA_LEVEL]: '#6366f1',
} as const;

// Default values
export const DEFAULT_VALUES = {
  LATITUDE: 13.7563, // Bangkok
  LONGITUDE: 100.5018, // Bangkok
  MIN_FEATURES_FOR_PREDICTION: 2,
  CHART_HEIGHT: 256,
  DEBOUNCE_DELAY: 300,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INSUFFICIENT_FEATURES: 'กรุณาเลือกข้อมูลอย่างน้อย 2 ตัวเพื่อการทำนาย',
  API_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ API',
  PREDICTION_ERROR: 'เกิดข้อผิดพลาดในการทำนาย',
  DATA_LOAD_ERROR: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
  INVALID_LOCATION: 'ตำแหน่งไม่ถูกต้อง',
} as const;
