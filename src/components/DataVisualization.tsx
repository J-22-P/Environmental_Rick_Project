import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { TimeSeriesData } from '../types';
import { Database, Wifi, Download } from 'lucide-react';
import { exportTimeSeriesDataToCSV } from '../utils/helpers';

interface DataVisualizationProps {
  data: {
    soilMoisture: TimeSeriesData[];
    glacierMelting: TimeSeriesData[];
    surfaceTemperature: TimeSeriesData[];
    fireIndex: TimeSeriesData[];
    seaLevel: TimeSeriesData[];
  };
  isLoading: boolean;
  locationName?: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, isLoading, locationName = 'Unknown Location' }) => {
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

  const colors = {
    soilMoisture: '#3b82f6',
    glacierMelting: '#06b6d4',
    surfaceTemperature: '#ef4444',
    fireIndex: '#f97316',
    seaLevel: '#6366f1',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'soilMoisture':
        return `${value.toFixed(1)}%`;
      case 'glacierMelting':
        return `${value.toFixed(2)} mm/month`;
      case 'surfaceTemperature':
        return `${value.toFixed(1)}°C`;
      case 'fireIndex':
        return value.toFixed(1);
      case 'seaLevel':
        return `${(value * 100).toFixed(1)} cm`;
      default:
        return value.toFixed(2);
    }
  };

  const handleExportCSV = () => {
    exportTimeSeriesDataToCSV(data, locationName);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const hasData = Object.values(data).some(dataset => dataset.length > 0);

  if (!hasData) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">Please select a location and data features to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Source Indicator */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Data Visualization</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Export CSV</span>
            </button>
            <div className="flex items-center space-x-2">
              {dataSource === 'real' ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Real Data</span>
                </>
              ) : dataSource === 'mock' ? (
                <>
                  <Database className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600 font-medium">Mock Data</span>
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500 font-medium">Loading...</span>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {dataSource === 'real' 
            ? 'Data from NASA, NOAA, and NSIDC APIs (2020-2022)' 
            : 'Simulated data for demonstration (2020-2022)'
          }
        </p>
      </div>

      {/* Soil Moisture */}
      {data.soilMoisture.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Soil Moisture
          </h3>
          <p className="text-sm text-gray-500 mb-4">Data from 2020-2022 (Monthly)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.soilMoisture[0]?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value: number) => [formatValue(value, 'soilMoisture'), 'Soil Moisture']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors.soilMoisture} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Surface Temperature */}
      {data.surfaceTemperature.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Surface Temperature
          </h3>
          <p className="text-sm text-gray-500 mb-4">Data from 2020-2022 (Monthly)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.surfaceTemperature[0]?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value: number) => [formatValue(value, 'surfaceTemperature'), 'Temperature']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors.surfaceTemperature} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Fire Risk Index */}
      {data.fireIndex.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Fire Risk Index
          </h3>
          <p className="text-sm text-gray-500 mb-4">Data from 2020-2022 (Monthly)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.fireIndex[0]?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value: number) => [formatValue(value, 'fireIndex'), 'Fire Index']}
                />
                <Bar 
                  dataKey="value" 
                  fill={colors.fireIndex}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Glacier Melting */}
      {data.glacierMelting.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Glacier Melting
          </h3>
          <p className="text-sm text-gray-500 mb-4">Data from 2020-2022 (Monthly)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.glacierMelting[0]?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value: number) => [formatValue(value, 'glacierMelting'), 'Melting Rate']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors.glacierMelting} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Sea Level */}
      {data.seaLevel.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sea Level
          </h3>
          <p className="text-sm text-gray-500 mb-4">Data from 2020-2022 (Monthly)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.seaLevel[0]?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value: number) => [formatValue(value, 'seaLevel'), 'Sea Level']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colors.seaLevel} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataVisualization;
