import React from 'react';
import Header from './components/Header';
import ModelSelector from './components/ModelSelector';
import FeatureSelector from './components/FeatureSelector';
import LocationSelector from './components/LocationSelector';
import DataVisualization from './components/DataVisualization';
import PredictionResult from './components/PredictionResult';
import { useDashboard } from './hooks/useDashboard';
import { Play, Download, AlertCircle, X } from 'lucide-react';

function App() {
  const {
    state,
    chartData,
    updateModel,
    updateFeatures,
    updateLocation,
    loadData,
    runPrediction,
    clearError,
    clearResults,
  } = useDashboard();

  const handleLoadData = () => {
    loadData();
  };

  const handleLoadLocationData = (lat: number, lng: number, name: string) => {
    // อัปเดต location ก่อน แล้วค่อยโหลดข้อมูล
    updateLocation(lat, lng, name);
    // โหลดข้อมูลหลังจากอัปเดต location
    setTimeout(() => {
      loadData();
    }, 100);
  };

  const handleRunPrediction = () => {
    runPrediction();
  };

  const selectedFeatureCount = Object.values(state.selectedFeatures).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {state.error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-danger-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-danger-800">
                  Error Occurred
                </h3>
                <div className="mt-2 text-sm text-danger-700">
                  {state.error}
                </div>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className="inline-flex bg-danger-50 rounded-md p-1.5 text-danger-500 hover:bg-danger-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-danger-50 focus:ring-danger-600"
                    onClick={clearError}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <LocationSelector
              latitude={state.selectedLocation.latitude}
              longitude={state.selectedLocation.longitude}
              onLocationChange={updateLocation}
              onLoadData={handleLoadLocationData}
              isLoadingData={state.isLoading}
            />

            <ModelSelector
              selectedModel={state.selectedModel}
              onModelChange={updateModel}
            />

            <FeatureSelector
              selectedFeatures={state.selectedFeatures}
              onFeatureChange={updateFeatures}
            />

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleLoadData}
                  disabled={state.isLoading}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Load Data</span>
                </button>

                <button
                  onClick={handleRunPrediction}
                  disabled={state.isLoading || selectedFeatureCount < 2}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4" />
                  <span>
                    {state.isLoading ? 'Processing...' : 'Predict Disasters'}
                  </span>
                </button>

                {state.predictionResults.length > 0 && (
                  <button
                    onClick={clearResults}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear Predictions
                  </button>
                )}
              </div>

              {selectedFeatureCount < 2 && (
                <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <p className="text-sm text-warning-700">
                    Please select at least 2 features for prediction
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results and Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prediction Results */}
            {state.predictionResults.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Latest Predictions
                </h2>
                {state.predictionResults.slice(0, 3).map((result) => (
                  <PredictionResult key={result.id} result={result} />
                ))}
              </div>
            )}

            {/* Data Visualizations */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Data Visualization
              </h2>
              <DataVisualization 
                data={chartData} 
                isLoading={state.isLoading}
                locationName={state.selectedLocation.name}
              />
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {state.isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="text-gray-900">Processing...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
