import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DashboardState, PredictionModel, DataFeatures } from '../types';

// Action types
type Action =
  | { type: 'SET_MODEL'; payload: PredictionModel }
  | { type: 'SET_FEATURES'; payload: DataFeatures }
  | { type: 'SET_LOCATION'; payload: { latitude: number; longitude: number; name: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_PREDICTION_RESULT'; payload: any }
  | { type: 'CLEAR_PREDICTION_RESULTS' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: DashboardState = {
  selectedModel: 'linear',
  selectedFeatures: {
    soilMoisture: true,
    glacierMelting: false,
    surfaceTemperature: true,
    fireIndex: false,
    seaLevel: false,
  },
  selectedLocation: {
    latitude: 13.7563,
    longitude: 100.5018,
    name: 'กรุงเทพมหานคร',
  },
  predictionResults: [],
  isLoading: false,
  error: null,
};

// Reducer
const dashboardReducer = (state: DashboardState, action: Action): DashboardState => {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, selectedModel: action.payload };
    case 'SET_FEATURES':
      return { ...state, selectedFeatures: action.payload };
    case 'SET_LOCATION':
      return { ...state, selectedLocation: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_PREDICTION_RESULT':
      return { 
        ...state, 
        predictionResults: [action.payload, ...state.predictionResults] 
      };
    case 'CLEAR_PREDICTION_RESULTS':
      return { ...state, predictionResults: [] };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: DashboardState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Action creators
export const dashboardActions = {
  setModel: (model: PredictionModel): Action => ({
    type: 'SET_MODEL',
    payload: model,
  }),
  setFeatures: (features: DataFeatures): Action => ({
    type: 'SET_FEATURES',
    payload: features,
  }),
  setLocation: (latitude: number, longitude: number, name: string): Action => ({
    type: 'SET_LOCATION',
    payload: { latitude, longitude, name },
  }),
  setLoading: (loading: boolean): Action => ({
    type: 'SET_LOADING',
    payload: loading,
  }),
  setError: (error: string | null): Action => ({
    type: 'SET_ERROR',
    payload: error,
  }),
  addPredictionResult: (result: any): Action => ({
    type: 'ADD_PREDICTION_RESULT',
    payload: result,
  }),
  clearPredictionResults: (): Action => ({
    type: 'CLEAR_PREDICTION_RESULTS',
  }),
  clearError: (): Action => ({
    type: 'CLEAR_ERROR',
  }),
};
