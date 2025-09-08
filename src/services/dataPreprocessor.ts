import { 
  SoilMoistureData, 
  SurfaceTemperatureData, 
  FireIndexData, 
  SeaLevelData, 
  GlacierData 
} from '../types';

// Data preprocessing interfaces
export interface ProcessedFeatures {
  soilMoisture: number;
  temperature: number;
  fireIndex: number;
  seaLevel: number;
  glacierMelting: number;
  quality: number; // Data quality score (0-1)
  completeness: number; // Data completeness score (0-1)
}

export interface DataStatistics {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  count: number;
  outliers: number[];
}

export interface NormalizedData {
  features: number[];
  statistics: DataStatistics[];
  quality: number;
  completeness: number;
}

// Data Preprocessing Service
export class DataPreprocessor {
  
  // 1. Data Cleaning and Validation
  static cleanData<T extends { timestamp: string; latitude: number; longitude: number }>(
    data: T[]
  ): T[] {
    return data.filter(item => {
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
      
      return true;
    });
  }

  // 2. Data Aggregation and Averaging
  static aggregateData(
    soilMoisture: SoilMoistureData[],
    temperature: SurfaceTemperatureData[],
    fireIndex: FireIndexData[],
    seaLevel: SeaLevelData[],
    glacierMelting: GlacierData[]
  ): ProcessedFeatures {
    
    // Clean all datasets
    const cleanSoilMoisture = this.cleanData(soilMoisture);
    const cleanTemperature = this.cleanData(temperature);
    const cleanFireIndex = this.cleanData(fireIndex);
    const cleanSeaLevel = this.cleanData(seaLevel);
    const cleanGlacierMelting = this.cleanData(glacierMelting);

    // Calculate averages with outlier removal
    const avgSoilMoisture = this.calculateRobustAverage(
      cleanSoilMoisture.map(item => item.soilMoisture)
    );
    
    const avgTemperature = this.calculateRobustAverage(
      cleanTemperature.map(item => item.temperature)
    );
    
    const avgFireIndex = this.calculateRobustAverage(
      cleanFireIndex.map(item => item.fireIndex)
    );
    
    const avgSeaLevel = this.calculateRobustAverage(
      cleanSeaLevel.map(item => item.seaLevel)
    );
    
    const avgGlacierMelting = this.calculateRobustAverage(
      cleanGlacierMelting.map(item => item.meltingRate)
    );

    // Calculate data quality metrics
    const quality = this.calculateDataQuality([
      cleanSoilMoisture.length,
      cleanTemperature.length,
      cleanFireIndex.length,
      cleanSeaLevel.length,
      cleanGlacierMelting.length
    ]);

    const completeness = this.calculateDataCompleteness([
      cleanSoilMoisture.length,
      cleanTemperature.length,
      cleanFireIndex.length,
      cleanSeaLevel.length,
      cleanGlacierMelting.length
    ]);

    return {
      soilMoisture: avgSoilMoisture,
      temperature: avgTemperature,
      fireIndex: avgFireIndex,
      seaLevel: avgSeaLevel,
      glacierMelting: avgGlacierMelting,
      quality,
      completeness
    };
  }

  // 3. Robust Average Calculation (removes outliers)
  static calculateRobustAverage(values: number[]): number {
    if (values.length === 0) return 0;
    
    // Sort values
    const sorted = [...values].sort((a, b) => a - b);
    
    // Calculate quartiles
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    
    // Calculate IQR (Interquartile Range)
    const iqr = q3 - q1;
    
    // Define outlier bounds
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    // Filter out outliers
    const filteredValues = values.filter(value => 
      value >= lowerBound && value <= upperBound
    );
    
    // Calculate average of filtered values
    return filteredValues.length > 0 
      ? filteredValues.reduce((sum, val) => sum + val, 0) / filteredValues.length
      : values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // 4. Data Quality Assessment
  static calculateDataQuality(dataCounts: number[]): number {
    const maxCount = Math.max(...dataCounts);
    const minCount = Math.min(...dataCounts);
    
    // Quality based on consistency across data sources
    const consistency = maxCount > 0 ? minCount / maxCount : 0;
    
    // Quality based on total data points
    const totalPoints = dataCounts.reduce((sum, count) => sum + count, 0);
    const dataRichness = Math.min(1, totalPoints / 50); // 50 is target minimum
    
    return (consistency * 0.6 + dataRichness * 0.4);
  }

  // 5. Data Completeness Assessment
  static calculateDataCompleteness(dataCounts: number[]): number {
    const expectedCount = 10; // Expected minimum data points per source
    const completenessScores = dataCounts.map(count => 
      Math.min(1, count / expectedCount)
    );
    
    return completenessScores.reduce((sum, score) => sum + score, 0) / completenessScores.length;
  }

  // 6. Feature Normalization
  static normalizeFeatures(features: ProcessedFeatures): NormalizedData {
    // Define normalization ranges based on real-world data
    const normalizationRanges = {
      soilMoisture: { min: 0, max: 100 },      // Percentage
      temperature: { min: -50, max: 60 },      // Celsius
      fireIndex: { min: 0, max: 100 },         // Index
      seaLevel: { min: 0, max: 1 },            // Meters
      glacierMelting: { min: 0, max: 20 }      // mm/year
    };

    const normalizedFeatures: number[] = [];
    const statistics: DataStatistics[] = [];

    // Normalize each feature
    Object.entries(normalizationRanges).forEach(([key, range]) => {
      const value = features[key as keyof ProcessedFeatures] as number;
      const normalized = (value - range.min) / (range.max - range.min);
      normalizedFeatures.push(Math.max(0, Math.min(1, normalized)));
      
      // Create statistics for this feature
      statistics.push({
        mean: value,
        median: value,
        std: 0,
        min: value,
        max: value,
        count: 1,
        outliers: []
      });
    });

    return {
      features: normalizedFeatures,
      statistics,
      quality: features.quality,
      completeness: features.completeness
    };
  }

  // 7. Geographic Context Adjustment
  static adjustForGeographicContext(
    features: ProcessedFeatures,
    latitude: number,
    longitude: number
  ): ProcessedFeatures {
    const isDesert = this.isDesertRegion(latitude, longitude);
    const isPolar = this.isPolarRegion(latitude, longitude);
    const isCoastal = this.isCoastalRegion(latitude, longitude);

    let adjustedFeatures = { ...features };

    // Adjust for desert regions
    if (isDesert) {
      adjustedFeatures.soilMoisture = Math.min(features.soilMoisture, 15);
      adjustedFeatures.temperature = Math.max(features.temperature, 25);
      adjustedFeatures.fireIndex = Math.max(features.fireIndex, 60);
      adjustedFeatures.seaLevel = 0;
      adjustedFeatures.glacierMelting = 0;
    }

    // Adjust for polar regions
    if (isPolar) {
      adjustedFeatures.soilMoisture = Math.min(features.soilMoisture, 40);
      adjustedFeatures.temperature = Math.min(features.temperature, 15);
      adjustedFeatures.fireIndex = Math.min(features.fireIndex, 30);
      adjustedFeatures.seaLevel = 0;
      adjustedFeatures.glacierMelting = Math.max(features.glacierMelting, 5);
    }

    // Adjust for coastal regions
    if (isCoastal) {
      adjustedFeatures.seaLevel = Math.max(features.seaLevel, 0.05);
    }

    return adjustedFeatures;
  }

  // 8. Geographic Region Detection
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

  // 9. Complete Data Processing Pipeline
  static processDataForML(
    soilMoisture: SoilMoistureData[],
    temperature: SurfaceTemperatureData[],
    fireIndex: FireIndexData[],
    seaLevel: SeaLevelData[],
    glacierMelting: GlacierData[],
    latitude: number,
    longitude: number
  ): NormalizedData {
    
    console.log('🔄 Starting Data Processing Pipeline...');
    
    // Step 1: Aggregate and clean data
    const aggregatedFeatures = this.aggregateData(
      soilMoisture, temperature, fireIndex, seaLevel, glacierMelting
    );
    
    console.log('📊 Aggregated Features:', {
      soilMoisture: aggregatedFeatures.soilMoisture.toFixed(2),
      temperature: aggregatedFeatures.temperature.toFixed(2),
      fireIndex: aggregatedFeatures.fireIndex.toFixed(2),
      seaLevel: aggregatedFeatures.seaLevel.toFixed(3),
      glacierMelting: aggregatedFeatures.glacierMelting.toFixed(2),
      quality: aggregatedFeatures.quality.toFixed(3),
      completeness: aggregatedFeatures.completeness.toFixed(3)
    });
    
    // Step 2: Adjust for geographic context
    const adjustedFeatures = this.adjustForGeographicContext(
      aggregatedFeatures, latitude, longitude
    );
    
    console.log('🌍 Geographic Adjustment:', {
      isDesert: this.isDesertRegion(latitude, longitude),
      isPolar: this.isPolarRegion(latitude, longitude),
      isCoastal: this.isCoastalRegion(latitude, longitude),
      adjustedSoilMoisture: adjustedFeatures.soilMoisture.toFixed(2),
      adjustedTemperature: adjustedFeatures.temperature.toFixed(2),
      adjustedFireIndex: adjustedFeatures.fireIndex.toFixed(2)
    });
    
    // Step 3: Normalize features
    const normalizedData = this.normalizeFeatures(adjustedFeatures);
    
    console.log('🎯 Normalized Features:', normalizedData.features.map(f => f.toFixed(3)));
    console.log('✅ Data Processing Complete!');
    
    return normalizedData;
  }
}
