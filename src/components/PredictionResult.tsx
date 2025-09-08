import React, { useState, useEffect } from 'react';
import { PredictionResult as PredictionResultType } from '../types';
import { 
  AlertTriangle, 
  Droplets, 
  Flame, 
  TrendingUp, 
  CheckCircle,
  XCircle,
  Database,
  Wifi,
  Download
} from 'lucide-react';
import { exportPredictionResultToCSV } from '../utils/helpers';

interface PredictionResultProps {
  result: PredictionResultType;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  const [dataSource, setDataSource] = useState<'real' | 'mock' | 'unknown'>('unknown');

  useEffect(() => {
    // ตรวจสอบว่ามี API keys หรือไม่
    const hasNasaKey = process.env.REACT_APP_NASA_API_KEY && process.env.REACT_APP_NASA_API_KEY !== 'DEMO_KEY';
    const hasNoaaToken = process.env.REACT_APP_NOAA_TOKEN && process.env.REACT_APP_NOAA_TOKEN !== 'your_noaa_token_here';
    
    if (hasNasaKey || hasNoaaToken) {
      setDataSource('real');
    } else {
      setDataSource('mock');
    }
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-success-600 bg-success-100';
      case 'medium':
        return 'text-warning-600 bg-warning-100';
      case 'high':
        return 'text-danger-600 bg-danger-100';
      case 'extreme':
        return 'text-danger-800 bg-danger-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5" />;
      case 'high':
      case 'extreme':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const formatProbability = (probability: number) => {
    return `${(probability * 100).toFixed(1)}%`;
  };

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  const handleExportCSV = () => {
    exportPredictionResultToCSV(result, result.location.name);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Prediction Result
          </h3>
          {/* Data Source Indicator */}
          <div className="flex items-center space-x-2 mt-1">
            {dataSource === 'real' ? (
              <>
                <Wifi className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Using Real Data</span>
              </>
            ) : dataSource === 'mock' ? (
              <>
                <Database className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600 font-medium">Using Mock Data</span>
              </>
            ) : (
              <>
                <Database className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500 font-medium">Loading...</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export CSV</span>
          </button>
          <div className="text-sm text-gray-500">
            {new Date(result.timestamp).toLocaleString('en-US', { timeZone: 'UTC' })} UTC
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drought Risk */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Drought Risk</h4>
          </div>
          
          <div className={`p-4 rounded-lg ${getRiskColor(result.droughtRisk.level)}`}>
            <div className="flex items-center space-x-2 mb-2">
              {getRiskIcon(result.droughtRisk.level)}
              <span className="font-semibold capitalize">
                {result.droughtRisk.level === 'low' ? 'Low' :
                 result.droughtRisk.level === 'medium' ? 'Medium' :
                 result.droughtRisk.level === 'high' ? 'High' : 'Extreme'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Probability:</span>
                <span className="font-medium">{formatProbability(result.droughtRisk.probability)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Confidence:</span>
                <span className="font-medium">{formatConfidence(result.droughtRisk.confidence)}</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                result.droughtRisk.level === 'low' ? 'bg-success-500' :
                result.droughtRisk.level === 'medium' ? 'bg-warning-500' :
                result.droughtRisk.level === 'high' ? 'bg-danger-500' : 'bg-danger-700'
              }`}
              style={{ width: `${result.droughtRisk.probability * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Flood Risk */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-600" />
            <h4 className="font-medium text-gray-900">Flood Risk</h4>
          </div>
          
          <div className={`p-4 rounded-lg ${getRiskColor(result.floodRisk.level)}`}>
            <div className="flex items-center space-x-2 mb-2">
              {getRiskIcon(result.floodRisk.level)}
              <span className="font-semibold capitalize">
                {result.floodRisk.level === 'low' ? 'Low' :
                 result.floodRisk.level === 'medium' ? 'Medium' :
                 result.floodRisk.level === 'high' ? 'High' : 'Extreme'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Probability:</span>
                <span className="font-medium">{formatProbability(result.floodRisk.probability)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Confidence:</span>
                <span className="font-medium">{formatConfidence(result.floodRisk.confidence)}</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                result.floodRisk.level === 'low' ? 'bg-success-500' :
                result.floodRisk.level === 'medium' ? 'bg-warning-500' :
                result.floodRisk.level === 'high' ? 'bg-danger-500' : 'bg-danger-700'
              }`}
              style={{ width: `${result.floodRisk.probability * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Data Used for Prediction */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Data Used for Prediction</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {result.dataPoints.soilMoisture !== undefined && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Droplets className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">Soil Moisture</div>
              <div className="text-lg font-bold text-blue-600">
                {result.dataPoints.soilMoisture.toFixed(1)}%
              </div>
            </div>
          )}
          
          {result.dataPoints.glacierMelting !== undefined && (
            <div className="text-center p-3 bg-cyan-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-cyan-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">Glacier Melting</div>
              <div className="text-lg font-bold text-cyan-600">
                {result.dataPoints.glacierMelting.toFixed(2)} mm/year
              </div>
            </div>
          )}
          
          {result.dataPoints.surfaceTemperature !== undefined && (
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">Surface Temperature</div>
              <div className="text-lg font-bold text-red-600">
                {result.dataPoints.surfaceTemperature.toFixed(1)}°C
              </div>
            </div>
          )}
          
          {result.dataPoints.fireIndex !== undefined && (
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Flame className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">Fire Risk Index</div>
              <div className="text-lg font-bold text-orange-600">
                {result.dataPoints.fireIndex.toFixed(1)}
              </div>
            </div>
          )}
          
          {result.dataPoints.seaLevel !== undefined && (
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-900">Sea Level</div>
              <div className="text-lg font-bold text-indigo-600">
                {result.dataPoints.seaLevel.toFixed(2)} m
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model Information */}
      <div className="mt-4 text-sm text-gray-500">
        <div className="flex justify-between">
          <span>Model: {result.model}</span>
          <span>Location: {result.location.name}</span>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
