import React from 'react';
import { DataFeatures } from '../types';
import { 
  Droplets, 
  Mountain, 
  Thermometer, 
  Flame, 
  Waves 
} from 'lucide-react';

interface FeatureSelectorProps {
  selectedFeatures: DataFeatures;
  onFeatureChange: (features: DataFeatures) => void;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  selectedFeatures,
  onFeatureChange,
}) => {
  const features = [
    {
      key: 'soilMoisture' as keyof DataFeatures,
      label: 'Soil Moisture',
      description: 'Satellite-based soil moisture data',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      key: 'glacierMelting' as keyof DataFeatures,
      label: 'Glacier Melting',
      description: 'Glacier melting rate and ice loss',
      icon: Mountain,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      key: 'surfaceTemperature' as keyof DataFeatures,
      label: 'Surface Temperature',
      description: 'Land surface temperature from satellites',
      icon: Thermometer,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      key: 'fireIndex' as keyof DataFeatures,
      label: 'Fire Risk Index',
      description: 'Wildfire risk assessment index',
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      key: 'seaLevel' as keyof DataFeatures,
      label: 'Sea Level',
      description: 'Sea level data and trends',
      icon: Waves,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const handleFeatureToggle = (key: keyof DataFeatures) => {
    onFeatureChange({
      ...selectedFeatures,
      [key]: !selectedFeatures[key],
    });
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Data Features for Prediction
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isSelected = selectedFeatures[feature.key];
          
          return (
            <div
              key={feature.key}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleFeatureToggle(feature.key)}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{feature.label}</h4>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Select at least 2 features for accurate predictions
        </p>
      </div>
    </div>
  );
};

export default FeatureSelector;
