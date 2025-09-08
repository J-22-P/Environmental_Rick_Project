import React, { useState, useEffect } from 'react';
import { CloudRain, AlertTriangle, Database, Wifi } from 'lucide-react';

const Header: React.FC = () => {
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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <CloudRain className="h-8 w-8 text-primary-600" />
              <AlertTriangle className="h-6 w-6 text-warning-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Disaster Prediction Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Global Disaster Prediction System
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Data Source Indicator */}
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
            
            <div className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC
            </div>
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
