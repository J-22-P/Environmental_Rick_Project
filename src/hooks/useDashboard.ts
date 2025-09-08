import { useState, useCallback } from 'react';
import { 
  DashboardState, 
  PredictionModel, 
  DataFeatures, 
  TimeSeriesData
} from '../types';
import { apiService } from '../services/apiService';

const initialFeatures: DataFeatures = {
  soilMoisture: true,
  glacierMelting: false,
  surfaceTemperature: true,
  fireIndex: false,
  seaLevel: false,
};

const initialLocation = {
  latitude: 13.7563, // Bangkok, Thailand
  longitude: 100.5018,
  name: 'Bangkok, Thailand',
};

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    selectedModel: 'linear',
    selectedFeatures: initialFeatures,
    selectedLocation: initialLocation,
    predictionResults: [],
    isLoading: false,
    error: null,
  });

  const [chartData, setChartData] = useState<{
    soilMoisture: TimeSeriesData[];
    glacierMelting: TimeSeriesData[];
    surfaceTemperature: TimeSeriesData[];
    fireIndex: TimeSeriesData[];
    seaLevel: TimeSeriesData[];
  }>({
    soilMoisture: [],
    glacierMelting: [],
    surfaceTemperature: [],
    fireIndex: [],
    seaLevel: [],
  });

  const updateModel = useCallback((model: PredictionModel) => {
    setState(prev => ({ ...prev, selectedModel: model }));
  }, []);

  const updateFeatures = useCallback((features: DataFeatures) => {
    setState(prev => ({ ...prev, selectedFeatures: features }));
  }, []);

  const updateLocation = useCallback((lat: number, lng: number, name: string) => {
    setState(prev => ({ 
      ...prev, 
      selectedLocation: { latitude: lat, longitude: lng, name } 
    }));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { selectedLocation, selectedFeatures } = state;
      const promises: Promise<any>[] = [];
      const dataKeys: (keyof DataFeatures)[] = [];

      // Call APIs based on selected features
      if (selectedFeatures.soilMoisture) {
        promises.push(apiService.getSoilMoistureData(
          selectedLocation.latitude,
          selectedLocation.longitude
        ));
        dataKeys.push('soilMoisture');
      }

      if (selectedFeatures.glacierMelting) {
        promises.push(apiService.getGlacierData(
          selectedLocation.latitude,
          selectedLocation.longitude
        ));
        dataKeys.push('glacierMelting');
      }

      if (selectedFeatures.surfaceTemperature) {
        promises.push(apiService.getSurfaceTemperatureData(
          selectedLocation.latitude,
          selectedLocation.longitude
        ));
        dataKeys.push('surfaceTemperature');
      }

      if (selectedFeatures.fireIndex) {
        promises.push(apiService.getFireIndexData(
          selectedLocation.latitude,
          selectedLocation.longitude
        ));
        dataKeys.push('fireIndex');
      }

      if (selectedFeatures.seaLevel) {
        promises.push(apiService.getSeaLevelData(
          selectedLocation.latitude,
          selectedLocation.longitude
        ));
        dataKeys.push('seaLevel');
      }

      const responses = await Promise.all(promises);
      
      // Convert data to chart format
      const newChartData: {
        soilMoisture: TimeSeriesData[];
        glacierMelting: TimeSeriesData[];
        surfaceTemperature: TimeSeriesData[];
        fireIndex: TimeSeriesData[];
        seaLevel: TimeSeriesData[];
      } = {
        soilMoisture: [],
        glacierMelting: [],
        surfaceTemperature: [],
        fireIndex: [],
        seaLevel: [],
      };

      responses.forEach((response, index) => {
        if (response.success && response.data.length > 0) {
          const key = dataKeys[index];
          const chartDataPoints = response.data.map((item: any) => ({
            timestamp: item.timestamp,
            value: key === 'soilMoisture' ? item.soilMoisture :
                   key === 'glacierMelting' ? item.meltingRate :
                   key === 'surfaceTemperature' ? item.temperature :
                   key === 'fireIndex' ? item.fireIndex :
                   key === 'seaLevel' ? item.seaLevel : 0,
          }));

          (newChartData as any)[key] = [{
            name: key,
            data: chartDataPoints,
            color: key === 'soilMoisture' ? '#3b82f6' :
                   key === 'glacierMelting' ? '#06b6d4' :
                   key === 'surfaceTemperature' ? '#ef4444' :
                   key === 'fireIndex' ? '#f97316' :
                   key === 'seaLevel' ? '#6366f1' : '#6b7280',
          }];
        }
      });

      setChartData(newChartData);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error occurred while loading data' 
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedLocation, state.selectedFeatures]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runPrediction = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { selectedLocation, selectedModel, selectedFeatures } = state;
      
      // Check if at least 2 features are selected
      const selectedFeatureCount = Object.values(selectedFeatures).filter(Boolean).length;
      if (selectedFeatureCount < 2) {
        throw new Error('Please select at least 2 features for prediction');
      }

      const response = await apiService.predictDisasters(
        selectedLocation.latitude,
        selectedLocation.longitude,
        selectedModel,
        selectedFeatures
      );

      if (response.success) {
        setState(prev => ({
          ...prev,
          predictionResults: [response.data, ...prev.predictionResults],
          isLoading: false,
        }));
      } else {
        throw new Error(response.error || 'Error occurred during prediction');
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error occurred during prediction' 
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedLocation, state.selectedModel, state.selectedFeatures]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearResults = useCallback(() => {
    setState(prev => ({ ...prev, predictionResults: [] }));
  }, []);

  return {
    state,
    chartData,
    updateModel,
    updateFeatures,
    updateLocation,
    loadData,
    runPrediction,
    clearError,
    clearResults,
  };
};
