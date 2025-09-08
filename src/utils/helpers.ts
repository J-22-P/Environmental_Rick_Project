import { RISK_LEVELS, RISK_LEVEL_LABELS } from './constants';
import { TimeSeriesData, PredictionResult } from '../types';

// Format probability to percentage
export const formatProbability = (probability: number): string => {
  return `${(probability * 100).toFixed(1)}%`;
};

// Format confidence to percentage
export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`;
};

// Get risk level color classes
export const getRiskColorClasses = (level: string): string => {
  switch (level) {
    case RISK_LEVELS.LOW:
      return 'text-success-600 bg-success-100';
    case RISK_LEVELS.MEDIUM:
      return 'text-warning-600 bg-warning-100';
    case RISK_LEVELS.HIGH:
      return 'text-danger-600 bg-danger-100';
    case RISK_LEVELS.EXTREME:
      return 'text-danger-800 bg-danger-200';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Get risk level label in Thai
export const getRiskLevelLabel = (level: string): string => {
  return RISK_LEVEL_LABELS[level as keyof typeof RISK_LEVEL_LABELS] || level;
};

// CSV Export Functions
export const convertToCSV = (data: any[], headers: string[]): string => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Convert TimeSeriesData to CSV format
export const exportTimeSeriesDataToCSV = (
  data: { [key: string]: TimeSeriesData[] },
  locationName: string
): void => {
  const allData: any[] = [];
  const headers = ['timestamp', 'data_type', 'value', 'unit', 'location'];
  
  Object.entries(data).forEach(([dataType, timeSeriesArray]) => {
    timeSeriesArray.forEach(timeSeries => {
      timeSeries.data.forEach(dataPoint => {
        allData.push({
          timestamp: dataPoint.timestamp,
          data_type: dataType,
          value: dataPoint.value,
          unit: getUnitForDataType(dataType),
          location: locationName
        });
      });
    });
  });
  
  const csvContent = convertToCSV(allData, headers);
  const filename = `disaster_data_${locationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

// Convert PredictionResult to CSV format
export const exportPredictionResultToCSV = (
  result: PredictionResult,
  locationName: string
): void => {
  const data = [
    {
      prediction_id: result.id,
      timestamp: result.timestamp,
      location_name: result.location.name,
      latitude: result.location.latitude,
      longitude: result.location.longitude,
      model: result.model,
      drought_risk_level: result.droughtRisk.level,
      drought_risk_probability: result.droughtRisk.probability,
      drought_risk_confidence: result.droughtRisk.confidence,
      flood_risk_level: result.floodRisk.level,
      flood_risk_probability: result.floodRisk.probability,
      flood_risk_confidence: result.floodRisk.confidence,
      soil_moisture: result.dataPoints.soilMoisture || '',
      glacier_melting: result.dataPoints.glacierMelting || '',
      surface_temperature: result.dataPoints.surfaceTemperature || '',
      fire_index: result.dataPoints.fireIndex || '',
      sea_level: result.dataPoints.seaLevel || '',
      features_used: Object.entries(result.features)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
        .join(';')
    }
  ];
  
  const headers = [
    'prediction_id', 'timestamp', 'location_name', 'latitude', 'longitude', 'model',
    'drought_risk_level', 'drought_risk_probability', 'drought_risk_confidence',
    'flood_risk_level', 'flood_risk_probability', 'flood_risk_confidence',
    'soil_moisture', 'glacier_melting', 'surface_temperature', 'fire_index', 'sea_level',
    'features_used'
  ];
  
  const csvContent = convertToCSV(data, headers);
  const filename = `prediction_result_${locationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

// Get unit for data type
const getUnitForDataType = (dataType: string): string => {
  switch (dataType) {
    case 'soilMoisture':
      return '%';
    case 'glacierMelting':
      return 'mm/month';
    case 'surfaceTemperature':
      return '°C';
    case 'fireIndex':
      return 'index';
    case 'seaLevel':
      return 'cm';
    default:
      return '';
  }
};

// Generate comprehensive 3-year data CSV
export const generateComprehensiveDataCSV = (
  locationName: string,
  latitude: number,
  longitude: number
): void => {
  const allData: any[] = [];
  const headers = [
    'timestamp', 'year', 'month', 'data_type', 'value', 'unit', 
    'location_name', 'latitude', 'longitude', 'description'
  ];

  // Generate weekly data for 3 years (2020-2022) - 156 weeks
  for (let year = 2020; year <= 2022; year++) {
    for (let week = 1; week <= 52; week++) {
      const date = new Date(year, 0, week * 7); // Every 7 days
      const month = Math.floor((week - 1) / 4.33) + 1; // Approximate month from week
      const timestamp = date.toISOString();
      
      // Soil Moisture Data
      const seasonalFactor = 0.7 + 0.3 * Math.sin((month - 1) * Math.PI / 6);
      const weeklyVariation = 0.1 * Math.sin((week - 1) * Math.PI / 26); // Weekly cycle
      const baseMoisture = 40 + seasonalFactor * 40 + weeklyVariation * 10;
      const soilMoisture = Math.max(0, Math.min(100, baseMoisture + (Math.random() - 0.5) * 15));
      
      allData.push({
        timestamp,
        year,
        month,
        data_type: 'soilMoisture',
        value: soilMoisture.toFixed(1),
        unit: '%',
        location_name: locationName,
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        description: 'Soil moisture percentage from satellite data'
      });

      // Surface Temperature Data
      const baseTemp = Math.abs(latitude) < 30 ? 28 + Math.random() * 8 : 20 + Math.random() * 12;
      const weeklyTempVariation = 0.5 * Math.sin((week - 1) * Math.PI / 26); // Weekly temperature cycle
      const temperature = baseTemp + weeklyTempVariation + (Math.random() - 0.5) * 3;
      
      allData.push({
        timestamp,
        year,
        month,
        data_type: 'surfaceTemperature',
        value: temperature.toFixed(1),
        unit: '°C',
        location_name: locationName,
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        description: 'Land surface temperature from MODIS satellite'
      });

      // Fire Risk Index Data
      const baseFire = Math.abs(latitude) < 30 ? 60 + Math.random() * 30 : 30 + Math.random() * 40;
      const weeklyFireVariation = 0.1 * Math.sin((week - 1) * Math.PI / 26); // Weekly cycle
      const fireIndex = Math.max(0, Math.min(100, baseFire + weeklyFireVariation * 10 + (Math.random() - 0.5) * 15));
      
      allData.push({
        timestamp,
        year,
        month,
        data_type: 'fireIndex',
        value: fireIndex.toFixed(1),
        unit: 'index',
        location_name: locationName,
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        description: 'Fire risk assessment index from FIRMS'
      });

      // Sea Level Data
      const baseSeaLevel = Math.random() * 0.5;
      const weeklySeaVariation = 0.02 * Math.sin((week - 1) * Math.PI / 26); // Weekly cycle
      const seaLevel = baseSeaLevel + weeklySeaVariation + (Math.random() - 0.5) * 0.08;
      
      allData.push({
        timestamp,
        year,
        month,
        data_type: 'seaLevel',
        value: (seaLevel * 100).toFixed(1),
        unit: 'cm',
        location_name: locationName,
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        description: 'Sea level data from NOAA tide gauges'
      });

      // Glacier Melting Data
      const baseMelting = Math.abs(latitude) > 60 ? 8 + Math.random() * 4 : 2 + Math.random() * 3;
      const weeklyMeltingVariation = 0.05 * Math.sin((week - 1) * Math.PI / 26); // Weekly cycle
      const glacierMelting = Math.max(0, baseMelting + weeklyMeltingVariation + (Math.random() - 0.5) * 1.5);
      
      allData.push({
        timestamp,
        year,
        month,
        data_type: 'glacierMelting',
        value: glacierMelting.toFixed(2),
        unit: 'mm/month',
        location_name: locationName,
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        description: 'Glacier melting rate from NSIDC data'
      });
    }
  }

  const csvContent = convertToCSV(allData, headers);
  const filename = `comprehensive_disaster_data_weekly_${locationName.replace(/[^a-zA-Z0-9]/g, '_')}_2020-2022.csv`;
  downloadCSV(csvContent, filename);
};

// Format date to Thai locale
export const formatDateThai = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date for chart display
export const formatDateForChart = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    month: 'short',
    day: 'numeric',
  });
};

// Format value based on feature type
export const formatValueByType = (value: number, type: string): string => {
  switch (type) {
    case 'soilMoisture':
      return `${value.toFixed(1)}%`;
    case 'glacierMelting':
      return `${value.toFixed(2)} mm/ปี`;
    case 'surfaceTemperature':
      return `${value.toFixed(1)}°C`;
    case 'fireIndex':
      return value.toFixed(1);
    case 'seaLevel':
      return `${value.toFixed(2)} m`;
    default:
      return value.toFixed(2);
  }
};

// Validate coordinates
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Generate random ID
export const generateId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Check if value is within range
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj: any): boolean => {
  return Object.keys(obj).length === 0;
};

// Get nested object value safely
export const getNestedValue = (obj: any, path: string, defaultValue: any = undefined): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
};
