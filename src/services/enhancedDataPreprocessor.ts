import { 
  SoilMoistureData, 
  SurfaceTemperatureData, 
  FireIndexData, 
  SeaLevelData, 
  GlacierData 
} from '../types';
import { FeatureEngineer } from './enhancedMLModels';

// Enhanced data preprocessing interfaces
export interface EnhancedProcessedFeatures {
  basicFeatures: number[];
  temporalFeatures: number[];
  volatilityFeatures: number[];
  interactionFeatures: number[];
  seasonalFeatures: number[];
  extremeFeatures: number[];
  allFeatures: number[];
  quality: number;
  completeness: number;
  dataRichness: number;
}

export interface EnhancedDataStatistics {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  count: number;
  outliers: number[];
  trend: number;
  volatility: number;
  seasonality: number;
  extremeValues: number;
}

export interface EnhancedNormalizedData {
  features: number[];
  statistics: EnhancedDataStatistics[];
  quality: number;
  completeness: number;
  dataRichness: number;
  featureNames: string[];
}

// Enhanced Data Preprocessing Service
export class EnhancedDataPreprocessor {
  
  // 1. Enhanced Data Cleaning and Validation
  static cleanAndValidateData<T extends { timestamp: string; latitude: number; longitude: number }>(
    data: T[]
  ): { cleanData: T[]; quality: number; completeness: number } {
    const originalCount = data.length;
    const cleanData = data.filter(item => {
      // Remove invalid data points
      if (!item.timestamp || !item.latitude || !item.longitude) {
        return false;
      }
      
      // Check for reasonable coordinate ranges
      if (item.latitude < -90 || item.latitude > 90) {
        return false;
      }
      if (item.longitude < -180 || item.longitude > 180) {
        return false;
      }
      
      // Check for valid timestamp
      const date = new Date(item.timestamp);
      if (isNaN(date.getTime())) {
        return false;
      }
      
      // Check for reasonable date range (not too old or future)
      const now = new Date();
      const dataDate = new Date(item.timestamp);
      const yearsDiff = Math.abs(now.getFullYear() - dataDate.getFullYear());
      if (yearsDiff > 10) {
        return false;
      }
      
      return true;
    });
    
    const quality = cleanData.length / originalCount;
    const completeness = Math.min(1, cleanData.length / 50); // Target minimum 50 data points
    
    return { cleanData, quality, completeness };
  }

  // 2. Enhanced Data Aggregation with Time Series Analysis
  static aggregateDataWithTimeSeries(
    soilMoisture: SoilMoistureData[],
    temperature: SurfaceTemperatureData[],
    fireIndex: FireIndexData[],
    seaLevel: SeaLevelData[],
    glacierMelting: GlacierData[]
  ): EnhancedProcessedFeatures {
    
    // Clean all datasets
    const { cleanData: cleanSoilMoisture, quality: smQuality, completeness: smCompleteness } = 
      this.cleanAndValidateData(soilMoisture);
    const { cleanData: cleanTemperature, quality: tempQuality, completeness: tempCompleteness } = 
      this.cleanAndValidateData(temperature);
    const { cleanData: cleanFireIndex, quality: fireQuality, completeness: fireCompleteness } = 
      this.cleanAndValidateData(fireIndex);
    const { cleanData: cleanSeaLevel, quality: seaQuality, completeness: seaCompleteness } = 
      this.cleanAndValidateData(seaLevel);
    const { cleanData: cleanGlacierMelting, quality: glacierQuality, completeness: glacierCompleteness } = 
      this.cleanAndValidateData(glacierMelting);

    // Extract time series data
    const soilMoistureTS = cleanSoilMoisture.map(item => item.soilMoisture);
    const temperatureTS = cleanTemperature.map(item => item.temperature);
    const fireIndexTS = cleanFireIndex.map(item => item.fireIndex);
    const seaLevelTS = cleanSeaLevel.map(item => item.seaLevel);
    const glacierMeltingTS = cleanGlacierMelting.map(item => item.meltingRate);

    // Create enhanced features using FeatureEngineer
    const allFeatures = FeatureEngineer.createTemporalFeatures(
      soilMoistureTS,
      temperatureTS,
      fireIndexTS,
      seaLevelTS,
      glacierMeltingTS
    );

    // Separate features by type
    const basicFeatures = allFeatures.slice(0, 5); // First 5 are basic means
    const temporalFeatures = allFeatures.slice(5, 10); // Next 5 are trends
    const volatilityFeatures = allFeatures.slice(10, 15); // Next 5 are volatility
    const interactionFeatures = allFeatures.slice(15, 19); // Next 4 are interactions
    const seasonalFeatures = allFeatures.slice(19, 22); // Next 3 are seasonality
    const extremeFeatures = allFeatures.slice(22, 25); // Last 3 are extreme values

    // Calculate overall quality metrics
    const qualities = [smQuality, tempQuality, fireQuality, seaQuality, glacierQuality];
    const completenesses = [smCompleteness, tempCompleteness, fireCompleteness, seaCompleteness, glacierCompleteness];
    
    const quality = qualities.reduce((sum, q) => sum + q, 0) / qualities.length;
    const completeness = completenesses.reduce((sum, c) => sum + c, 0) / completenesses.length;
    const dataRichness = Math.min(1, (soilMoistureTS.length + temperatureTS.length + fireIndexTS.length + seaLevelTS.length + glacierMeltingTS.length) / 250);

    return {
      basicFeatures,
      temporalFeatures,
      volatilityFeatures,
      interactionFeatures,
      seasonalFeatures,
      extremeFeatures,
      allFeatures,
      quality,
      completeness,
      dataRichness
    };
  }

  // 3. Enhanced Feature Normalization with Multiple Scaling Methods
  static normalizeFeaturesEnhanced(features: EnhancedProcessedFeatures): EnhancedNormalizedData {
    // Define normalization ranges based on real-world data and enhanced features
    const normalizationRanges = {
      // Basic features
      soilMoisture: { min: 0, max: 100 },
      temperature: { min: -50, max: 60 },
      fireIndex: { min: 0, max: 100 },
      seaLevel: { min: 0, max: 1 },
      glacierMelting: { min: 0, max: 20 },
      
      // Temporal features (trends)
      soilMoistureTrend: { min: -10, max: 10 },
      temperatureTrend: { min: -5, max: 5 },
      fireIndexTrend: { min: -20, max: 20 },
      seaLevelTrend: { min: -0.1, max: 0.1 },
      glacierMeltingTrend: { min: -2, max: 2 },
      
      // Volatility features
      soilMoistureVolatility: { min: 0, max: 30 },
      temperatureVolatility: { min: 0, max: 15 },
      fireIndexVolatility: { min: 0, max: 25 },
      seaLevelVolatility: { min: 0, max: 0.2 },
      glacierMeltingVolatility: { min: 0, max: 5 },
      
      // Interaction features
      moistureTempInteraction: { min: 0, max: 6000 },
      tempFireInteraction: { min: 0, max: 6000 },
      moistureSeaInteraction: { min: 0, max: 100 },
      glacierSeaInteraction: { min: 0, max: 20 },
      
      // Seasonal features
      soilMoistureSeasonality: { min: 0, max: 50 },
      temperatureSeasonality: { min: 0, max: 30 },
      fireIndexSeasonality: { min: 0, max: 40 },
      
      // Extreme value features
      soilMoistureExtreme: { min: 0, max: 1 },
      temperatureExtreme: { min: 0, max: 1 },
      fireIndexExtreme: { min: 0, max: 1 }
    };

    const normalizedFeatures: number[] = [];
    const statistics: EnhancedDataStatistics[] = [];
    const featureNames: string[] = [];

    // Normalize each feature group
    const featureGroups = [
      { features: features.basicFeatures, names: ['soilMoisture', 'temperature', 'fireIndex', 'seaLevel', 'glacierMelting'] },
      { features: features.temporalFeatures, names: ['soilMoistureTrend', 'temperatureTrend', 'fireIndexTrend', 'seaLevelTrend', 'glacierMeltingTrend'] },
      { features: features.volatilityFeatures, names: ['soilMoistureVolatility', 'temperatureVolatility', 'fireIndexVolatility', 'seaLevelVolatility', 'glacierMeltingVolatility'] },
      { features: features.interactionFeatures, names: ['moistureTempInteraction', 'tempFireInteraction', 'moistureSeaInteraction', 'glacierSeaInteraction'] },
      { features: features.seasonalFeatures, names: ['soilMoistureSeasonality', 'temperatureSeasonality', 'fireIndexSeasonality'] },
      { features: features.extremeFeatures, names: ['soilMoistureExtreme', 'temperatureExtreme', 'fireIndexExtreme'] }
    ];

    featureGroups.forEach((group, groupIndex) => {
      group.features.forEach((feature, featureIndex) => {
        const featureName = group.names[featureIndex];
        const range = normalizationRanges[featureName as keyof typeof normalizationRanges];
        
        if (range) {
          const normalized = (feature - range.min) / (range.max - range.min);
          normalizedFeatures.push(Math.max(0, Math.min(1, normalized)));
          
          // Create enhanced statistics
          statistics.push({
            mean: feature,
            median: feature,
            std: 0,
            min: feature,
            max: feature,
            count: 1,
            outliers: [],
            trend: groupIndex === 1 ? feature : 0, // Trend features
            volatility: groupIndex === 2 ? feature : 0, // Volatility features
            seasonality: groupIndex === 4 ? feature : 0, // Seasonal features
            extremeValues: groupIndex === 5 ? feature : 0 // Extreme features
          });
          
          featureNames.push(featureName);
        }
      });
    });

    return {
      features: normalizedFeatures,
      statistics,
      quality: features.quality,
      completeness: features.completeness,
      dataRichness: features.dataRichness,
      featureNames
    };
  }

  // 4. Advanced Geographic Context Adjustment
  static adjustForGeographicContextEnhanced(
    features: EnhancedProcessedFeatures,
    latitude: number,
    longitude: number
  ): EnhancedProcessedFeatures {
    const isDesert = this.isDesertRegion(latitude, longitude);
    const isPolar = this.isPolarRegion(latitude, longitude);
    const isCoastal = this.isCoastalRegion(latitude, longitude);
    const isTropical = this.isTropicalRegion(latitude, longitude);
    const isMountainous = this.isMountainousRegion(latitude, longitude);

    let adjustedFeatures = { ...features };

    // Adjust basic features based on geographic context
    if (isDesert) {
      adjustedFeatures.basicFeatures[0] = Math.min(features.basicFeatures[0], 0.15); // Soil moisture
      adjustedFeatures.basicFeatures[1] = Math.max(features.basicFeatures[1], 0.25); // Temperature
      adjustedFeatures.basicFeatures[2] = Math.max(features.basicFeatures[2], 0.6);  // Fire index
      adjustedFeatures.basicFeatures[3] = 0; // Sea level
      adjustedFeatures.basicFeatures[4] = 0; // Glacier melting
    }

    if (isPolar) {
      adjustedFeatures.basicFeatures[0] = Math.min(features.basicFeatures[0], 0.4);  // Soil moisture
      adjustedFeatures.basicFeatures[1] = Math.min(features.basicFeatures[1], 0.15); // Temperature
      adjustedFeatures.basicFeatures[2] = Math.min(features.basicFeatures[2], 0.3);  // Fire index
      adjustedFeatures.basicFeatures[3] = 0; // Sea level
      adjustedFeatures.basicFeatures[4] = Math.max(features.basicFeatures[4], 0.05); // Glacier melting
    }

    if (isCoastal) {
      adjustedFeatures.basicFeatures[3] = Math.max(features.basicFeatures[3], 0.05); // Sea level
    }

    if (isTropical) {
      adjustedFeatures.basicFeatures[0] = Math.max(features.basicFeatures[0], 0.6);  // Soil moisture
      adjustedFeatures.basicFeatures[1] = Math.max(features.basicFeatures[1], 0.2);  // Temperature
      adjustedFeatures.basicFeatures[2] = Math.min(features.basicFeatures[2], 0.6);  // Fire index
    }

    if (isMountainous) {
      adjustedFeatures.basicFeatures[1] = Math.min(features.basicFeatures[1], 0.3);  // Temperature
      adjustedFeatures.basicFeatures[4] = Math.max(features.basicFeatures[4], 0.02); // Glacier melting
    }

    // Recalculate all features after adjustment
    adjustedFeatures.allFeatures = [
      ...adjustedFeatures.basicFeatures,
      ...adjustedFeatures.temporalFeatures,
      ...adjustedFeatures.volatilityFeatures,
      ...adjustedFeatures.interactionFeatures,
      ...adjustedFeatures.seasonalFeatures,
      ...adjustedFeatures.extremeFeatures
    ];

    return adjustedFeatures;
  }

  // 5. Enhanced Geographic Region Detection
  static isDesertRegion(latitude: number, longitude: number): boolean {
    const saharaDesert = latitude >= 15 && latitude <= 30 && longitude >= -15 && longitude <= 40;
    const gobiDesert = latitude >= 40 && latitude <= 50 && longitude >= 100 && longitude <= 120;
    const atacamaDesert = latitude >= -30 && latitude <= -20 && longitude >= -80 && longitude <= -70;
    const kalahariDesert = latitude >= -30 && latitude <= -20 && longitude >= 15 && longitude <= 25;
    const australianDesert = latitude >= -30 && latitude <= -20 && longitude >= 120 && longitude <= 140;
    return saharaDesert || gobiDesert || atacamaDesert || kalahariDesert || australianDesert;
  }

  static isPolarRegion(latitude: number, longitude: number): boolean {
    const arctic = latitude > 66.5;
    const antarctic = latitude < -66.5;
    return arctic || antarctic;
  }

  static isCoastalRegion(latitude: number, longitude: number): boolean {
    const westCoastNA = longitude >= -130 && longitude <= -120 && latitude >= 30 && latitude <= 60;
    const eastCoastNA = longitude >= -80 && longitude <= -70 && latitude >= 25 && latitude <= 50;
    const europeanCoast = longitude >= -10 && longitude <= 20 && latitude >= 35 && latitude <= 70;
    const eastAsianCoast = longitude >= 120 && longitude <= 140 && latitude >= 20 && latitude <= 50;
    const australianCoast = longitude >= 110 && longitude <= 155 && latitude >= -40 && latitude <= -10;
    return westCoastNA || eastCoastNA || europeanCoast || eastAsianCoast || australianCoast;
  }

  static isTropicalRegion(latitude: number, longitude: number): boolean {
    return latitude >= -23.5 && latitude <= 23.5;
  }

  static isMountainousRegion(latitude: number, longitude: number): boolean {
    // Major mountain ranges
    const himalayas = latitude >= 25 && latitude <= 35 && longitude >= 70 && longitude <= 100;
    const andes = latitude >= -20 && latitude <= 10 && longitude >= -80 && longitude <= -70;
    const rockies = latitude >= 35 && latitude <= 60 && longitude >= -120 && longitude <= -105;
    const alps = latitude >= 43 && latitude <= 48 && longitude >= 5 && longitude <= 15;
    return himalayas || andes || rockies || alps;
  }

  // 6. Complete Enhanced Data Processing Pipeline
  static processDataForEnhancedML(
    soilMoisture: SoilMoistureData[],
    temperature: SurfaceTemperatureData[],
    fireIndex: FireIndexData[],
    seaLevel: SeaLevelData[],
    glacierMelting: GlacierData[],
    latitude: number,
    longitude: number
  ): EnhancedNormalizedData {
    
    console.log('🔄 Starting Enhanced Data Processing Pipeline...');
    
    // Step 1: Aggregate and clean data with time series analysis
    const aggregatedFeatures = this.aggregateDataWithTimeSeries(
      soilMoisture, temperature, fireIndex, seaLevel, glacierMelting
    );
    
    console.log('📊 Enhanced Aggregated Features:', {
      basicFeatures: aggregatedFeatures.basicFeatures.map(f => f.toFixed(3)),
      temporalFeatures: aggregatedFeatures.temporalFeatures.map(f => f.toFixed(3)),
      interactionFeatures: aggregatedFeatures.interactionFeatures.map(f => f.toFixed(3)),
      quality: aggregatedFeatures.quality.toFixed(3),
      completeness: aggregatedFeatures.completeness.toFixed(3),
      dataRichness: aggregatedFeatures.dataRichness.toFixed(3)
    });
    
    // Step 2: Adjust for enhanced geographic context
    const adjustedFeatures = this.adjustForGeographicContextEnhanced(
      aggregatedFeatures, latitude, longitude
    );
    
    console.log('🌍 Enhanced Geographic Adjustment:', {
      isDesert: this.isDesertRegion(latitude, longitude),
      isPolar: this.isPolarRegion(latitude, longitude),
      isCoastal: this.isCoastalRegion(latitude, longitude),
      isTropical: this.isTropicalRegion(latitude, longitude),
      isMountainous: this.isMountainousRegion(latitude, longitude),
      adjustedBasicFeatures: adjustedFeatures.basicFeatures.map(f => f.toFixed(3))
    });
    
    // Step 3: Normalize enhanced features
    const normalizedData = this.normalizeFeaturesEnhanced(adjustedFeatures);
    
    console.log('🎯 Enhanced Normalized Features:', {
      featureCount: normalizedData.features.length,
      featureNames: normalizedData.featureNames,
      normalizedValues: normalizedData.features.map(f => f.toFixed(3))
    });
    
    console.log('✅ Enhanced Data Processing Complete!');
    
    return normalizedData;
  }
}
