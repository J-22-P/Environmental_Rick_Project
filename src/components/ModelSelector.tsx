import React from 'react';
import { PredictionModel } from '../types';

interface ModelSelectorProps {
  selectedModel: PredictionModel;
  onModelChange: (model: PredictionModel) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const models: { value: PredictionModel; label: string; description: string }[] = [
    {
      value: 'linear',
      label: 'Linear Regression',
      description: 'Basic linear model for simple predictions',
    },
    {
      value: 'neural',
      label: 'Neural Network',
      description: 'Advanced neural network for complex predictions',
    },
    {
      value: 'ensemble',
      label: 'Ensemble Model',
      description: 'Combines multiple models for high accuracy',
    },
    {
      value: 'random_forest',
      label: 'Random Forest',
      description: 'Random Forest algorithm for large datasets',
    },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Prediction Model
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => (
          <div
            key={model.value}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedModel === model.value
                ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onModelChange(model.value)}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  selectedModel === model.value
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedModel === model.value && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{model.label}</h4>
                <p className="text-sm text-gray-500 mt-1">{model.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
