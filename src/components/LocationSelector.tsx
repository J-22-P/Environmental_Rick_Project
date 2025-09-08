import React, { useState } from 'react';
import { MapPin, Search, Map, Download, Loader2, FileText } from 'lucide-react';
import MapSelector from './MapSelector';
import { generateComprehensiveDataCSV } from '../utils/helpers';

interface LocationSelectorProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number, name: string) => void;
  onLoadData?: (lat: number, lng: number, name: string) => void;
  isLoadingData?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  latitude,
  longitude,
  onLocationChange,
  onLoadData,
  isLoadingData = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useState<string>('');

  // ฟังก์ชันหาชื่อสถานที่จากพิกัด
  const findLocationName = (lat: number, lng: number): string => {
    const location = predefinedLocations.find(loc => 
      Math.abs(loc.lat - lat) < 0.01 && Math.abs(loc.lng - lng) < 0.01
    );
    return location ? location.name : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  // ฟังก์ชันจัดการการเลือกสถานที่
  const handleLocationSelect = (location: any) => {
    setSearchQuery('');
    setCurrentLocationName(location.name);
    onLocationChange(location.lat, location.lng, location.name);
  };

  // ฟังก์ชันจัดการการโหลดข้อมูล
  const handleLoadData = () => {
    const locationName = currentLocationName || findLocationName(latitude, longitude);
    if (onLoadData) {
      onLoadData(latitude, longitude, locationName);
    }
  };

  // ฟังก์ชันดาวน์โหลดข้อมูล 3 ปี
  const handleDownload3YearData = () => {
    const locationName = currentLocationName || findLocationName(latitude, longitude);
    generateComprehensiveDataCSV(locationName, latitude, longitude);
  };

  // เมืองหลักทั่วโลก
  const predefinedLocations = [
    // ประเทศไทย
    { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018, country: 'TH' },
    { name: 'Chiang Mai, Thailand', lat: 18.7883, lng: 98.9853, country: 'TH' },
    { name: 'Phuket, Thailand', lat: 7.8833, lng: 98.3833, country: 'TH' },
    
    // เอเชียตะวันออก
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'JP' },
    { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780, country: 'KR' },
    { name: 'Beijing, China', lat: 39.9042, lng: 116.4074, country: 'CN' },
    { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737, country: 'CN' },
    { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, country: 'HK' },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'SG' },
    { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869, country: 'MY' },
    { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456, country: 'ID' },
    { name: 'Manila, Philippines', lat: 14.5995, lng: 120.9842, country: 'PH' },
    { name: 'Ho Chi Minh City, Vietnam', lat: 10.8231, lng: 106.6297, country: 'VN' },
    { name: 'Hanoi, Vietnam', lat: 21.0285, lng: 105.8542, country: 'VN' },
    
    // เอเชียใต้
    { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, country: 'IN' },
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, country: 'IN' },
    { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946, country: 'IN' },
    { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011, country: 'PK' },
    { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125, country: 'BD' },
    { name: 'Colombo, Sri Lanka', lat: 6.9271, lng: 79.8612, country: 'LK' },
    
    // ยุโรป
    { name: 'London, UK', lat: 51.5074, lng: -0.1278, country: 'GB' },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522, country: 'FR' },
    { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, country: 'DE' },
    { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, country: 'IT' },
    { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, country: 'ES' },
    { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041, country: 'NL' },
    { name: 'Moscow, Russia', lat: 55.7558, lng: 37.6176, country: 'RU' },
    { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, country: 'TR' },
    
    // อเมริกาเหนือ
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060, country: 'US' },
    { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, country: 'US' },
    { name: 'Chicago, USA', lat: 41.8781, lng: -87.6298, country: 'US' },
    { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, country: 'CA' },
    { name: 'Vancouver, Canada', lat: 49.2827, lng: -123.1207, country: 'CA' },
    { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332, country: 'MX' },
    
    // อเมริกาใต้
    { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333, country: 'BR' },
    { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729, country: 'BR' },
    { name: 'Buenos Aires, Argentina', lat: -34.6118, lng: -58.3960, country: 'AR' },
    { name: 'Lima, Peru', lat: -12.0464, lng: -77.0428, country: 'PE' },
    { name: 'Bogotá, Colombia', lat: 4.7110, lng: -74.0721, country: 'CO' },
    
    // แอฟริกา
    { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, country: 'EG' },
    { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241, country: 'ZA' },
    { name: 'Johannesburg, South Africa', lat: -26.2041, lng: 28.0473, country: 'ZA' },
    { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, country: 'NG' },
    { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219, country: 'KE' },
    
    // ออสเตรเลียและโอเชียเนีย
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, country: 'AU' },
    { name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631, country: 'AU' },
    { name: 'Auckland, New Zealand', lat: -36.8485, lng: 174.7633, country: 'NZ' },
    { name: 'Wellington, New Zealand', lat: -41.2865, lng: 174.7762, country: 'NZ' },
  ];

  const filteredLocations = predefinedLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManualInput = () => {
    const [lat, lng] = searchQuery.split(',').map(s => parseFloat(s.trim()));
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const locationName = findLocationName(lat, lng);
      setCurrentLocationName(locationName);
      onLocationChange(lat, lng, locationName);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Location for Prediction
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowMap(false)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
              !showMap 
                ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Search className="h-4 w-4 inline mr-1" />
            Search
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
              showMap 
                ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Map className="h-4 w-4 inline mr-1" />
            Map
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {!showMap ? (
          // Search Mode
          <>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search city or enter coordinates (latitude, longitude)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualInput()}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  Current Location: {currentLocationName || findLocationName(latitude, longitude)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </div>
              
              {/* ปุ่มโหลดข้อมูล */}
              <div className="space-y-2">
                {onLoadData && (
                  <button
                    onClick={handleLoadData}
                    disabled={isLoadingData}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isLoadingData
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {isLoadingData ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading Data...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Load API Data for This Location</span>
                      </>
                    )}
                  </button>
                )}
                
                {/* ปุ่มดาวน์โหลดข้อมูล 3 ปี */}
                <button
                  onClick={handleDownload3YearData}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-green-600 text-white hover:bg-green-700"
                >
                  <FileText className="h-4 w-4" />
                  <span>Download 3-Year Weekly Data CSV (2020-2022)</span>
                </button>
              </div>
            </div>

            {searchQuery && (
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredLocations.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredLocations.map((location, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <div className="font-medium text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-500">
                          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No locations found
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Map Mode
          <MapSelector
            latitude={latitude}
            longitude={longitude}
            onLocationChange={onLocationChange}
          />
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
