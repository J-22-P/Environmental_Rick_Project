// Data types for environmental APIs
export interface SoilMoistureData {
  timestamp: string;
  latitude: number;
  longitude: number;
  soilMoisture: number; // 0-100%
  depth: number; // cm
}

export interface GlacierData {
  timestamp: string;
  latitude: number;
  longitude: number;
  glacierArea: number; // km²
  iceThickness: number; // meters
  meltingRate: number; // mm/year
}

export interface SurfaceTemperatureData {
  timestamp: string;
  latitude: number;
  longitude: number;
  temperature: number; // Celsius
  anomaly: number; // Temperature anomaly from baseline
}

export interface FireIndexData {
  timestamp: string;
  latitude: number;
  longitude: number;
  fireIndex: number; // 0-100 scale
  vegetationType: string;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

export interface SeaLevelData {
  timestamp: string;
  latitude: number;
  longitude: number;
  seaLevel: number; // meters above sea level
  trend: number; // mm/year
}

// Prediction models
export type PredictionModel = 'linear' | 'neural' | 'ensemble' | 'random_forest';

// Data features for prediction
export interface DataFeatures {
  soilMoisture: boolean;
  glacierMelting: boolean;
  surfaceTemperature: boolean;
  fireIndex: boolean;
  seaLevel: boolean;
}

// Prediction result
export interface PredictionResult {
  id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  droughtRisk: {
    level: 'low' | 'medium' | 'high' | 'extreme';
    probability: number; // 0-1
    confidence: number; // 0-1
  };
  floodRisk: {
    level: 'low' | 'medium' | 'high' | 'extreme';
    probability: number; // 0-1
    confidence: number; // 0-1
  };
  model: PredictionModel;
  features: DataFeatures;
  dataPoints: {
    soilMoisture?: number;
    glacierMelting?: number;
    surfaceTemperature?: number;
    fireIndex?: number;
    seaLevel?: number;
  };
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  name: string;
  data: ChartDataPoint[];
  color: string;
}

// Dashboard state
export interface DashboardState {
  selectedModel: PredictionModel;
  selectedFeatures: DataFeatures;
  selectedLocation: {
    latitude: number;
    longitude: number;
    name: string;
  };
  predictionResults: PredictionResult[];
  isLoading: boolean;
  error: string | null;
}
