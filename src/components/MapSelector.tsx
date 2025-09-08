import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Search, Globe } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapSelectorProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number, name: string) => void;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{
  onLocationChange: (lat: number, lng: number, name: string) => void;
}> = ({ onLocationChange }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      // หาชื่อสถานที่จากพิกัด
      const predefinedLocations = [
        { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
        { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
        { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
        { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
        { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
        { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
        { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
        { name: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
      ];
      
      const location = predefinedLocations.find(loc => 
        Math.abs(loc.lat - lat) < 0.1 && Math.abs(loc.lng - lng) < 0.1
      );
      
      const name = location ? location.name : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      onLocationChange(lat, lng, name);
    },
  });
  return null;
};

const MapSelector: React.FC<MapSelectorProps> = ({
  latitude,
  longitude,
  onLocationChange,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([latitude, longitude]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  // Update map center when location changes
  useEffect(() => {
    setMapCenter([latitude, longitude]);
  }, [latitude, longitude]);

  // Popular cities for quick selection
  const popularCities = [
    { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 },
    { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  ];

  const handleCitySelect = (city: typeof popularCities[0]) => {
    onLocationChange(city.lat, city.lng, city.name);
    setMapCenter([city.lat, city.lng]);
  };

  const handleSearch = () => {
    // Simple coordinate parsing
    const coordMatch = searchQuery.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        onLocationChange(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setMapCenter([lat, lng]);
        return;
      }
    }

    // Search in popular cities
    const foundCity = popularCities.find(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (foundCity) {
      handleCitySelect(foundCity);
    }
  };

  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Interactive Map Selection
        </h3>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10 pr-20"
            placeholder="Search city or enter coordinates (lat, lng)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-600 hover:text-primary-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Quick City Selection */}
      {searchQuery && filteredCities.length > 0 && (
        <div className="mb-4 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredCities.map((city, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              onClick={() => handleCitySelect(city)}
            >
              <div className="font-medium text-gray-900">{city.name}</div>
              <div className="text-sm text-gray-500">
                {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Map Container */}
      <div className="relative">
        <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
          <MapContainer
            center={mapCenter}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            whenReady={() => setIsMapReady(true)}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Current location marker */}
            <Marker position={[latitude, longitude]}>
              <Popup>
                <div className="text-center">
                  <MapPin className="h-4 w-4 text-primary-600 mx-auto mb-1" />
                  <div className="font-medium">Selected Location</div>
                  <div className="text-sm text-gray-600">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Map click handler */}
            <MapClickHandler onLocationChange={onLocationChange} />
          </MapContainer>
        </div>

        {/* Map Instructions */}
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-sm text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Click on map to select location</span>
          </div>
        </div>

        {/* Loading indicator */}
        {!isMapReady && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>

      {/* Current Location Info */}
      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4" />
        <span>
          Current Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </span>
      </div>

      {/* Popular Cities */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Cities</h4>
        <div className="flex flex-wrap gap-2">
          {popularCities.map((city, index) => (
            <button
              key={index}
              onClick={() => handleCitySelect(city)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-150"
            >
              {city.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
