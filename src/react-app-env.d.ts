/// <reference types="react-scripts" />

// Extend the Window interface to include custom properties
declare global {
  interface Window {
    // Add any custom window properties here
    gtag?: (...args: any[]) => void;
  }
}

// Module declarations for non-typed packages
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_BASE_URL: string;
    REACT_APP_ENVIRONMENT: 'development' | 'staging' | 'production';
    REACT_APP_VERSION: string;
    REACT_APP_ENABLE_ANALYTICS: string;
    REACT_APP_ENABLE_DEBUG: string;
    REACT_APP_ENABLE_MOCK_DATA: string;
    REACT_APP_ENABLE_PREDICTION: string;
    REACT_APP_ENABLE_EXPORT: string;
  }
}
