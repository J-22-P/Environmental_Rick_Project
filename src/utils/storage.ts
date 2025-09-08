// Local storage utilities
export const storage = {
  // Get item from localStorage
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${error}`);
      return defaultValue;
    }
  },

  // Set item to localStorage
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item to localStorage: ${error}`);
    }
  },

  // Remove item from localStorage
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${error}`);
    }
  },

  // Clear all items from localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  },

  // Check if key exists in localStorage
  has: (key: string): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking item in localStorage: ${error}`);
      return false;
    }
  },
};

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  PREDICTION_RESULTS: 'prediction_results',
  CHART_DATA: 'chart_data',
  SELECTED_LOCATION: 'selected_location',
  SELECTED_MODEL: 'selected_model',
  SELECTED_FEATURES: 'selected_features',
} as const;

// User preferences type
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'th' | 'en';
  defaultLocation: {
    latitude: number;
    longitude: number;
    name: string;
  };
  defaultModel: string;
  defaultFeatures: Record<string, boolean>;
  chartSettings: {
    height: number;
    showGrid: boolean;
    showLegend: boolean;
  };
}

// Default user preferences
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'th',
  defaultLocation: {
    latitude: 13.7563,
    longitude: 100.5018,
    name: 'กรุงเทพมหานคร',
  },
  defaultModel: 'linear',
  defaultFeatures: {
    soilMoisture: true,
    glacierMelting: false,
    surfaceTemperature: true,
    fireIndex: false,
    seaLevel: false,
  },
  chartSettings: {
    height: 256,
    showGrid: true,
    showLegend: true,
  },
};

// User preferences utilities
export const userPreferences = {
  // Get user preferences
  get: (): UserPreferences => {
    return storage.get(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
  },

  // Set user preferences
  set: (preferences: Partial<UserPreferences>): void => {
    const current = userPreferences.get();
    const updated = { ...current, ...preferences };
    storage.set(STORAGE_KEYS.USER_PREFERENCES, updated);
  },

  // Reset user preferences to default
  reset: (): void => {
    storage.set(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
  },

  // Get specific preference
  getPreference: <K extends keyof UserPreferences>(
    key: K
  ): UserPreferences[K] => {
    const preferences = userPreferences.get();
    return preferences[key];
  },

  // Set specific preference
  setPreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): void => {
    userPreferences.set({ [key]: value } as Partial<UserPreferences>);
  },
};

// Cache utilities
export const cache = {
  // Set cache with TTL
  set: <T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void => {
    const item = {
      value,
      timestamp: Date.now(),
      ttl,
    };
    storage.set(key, item);
  },

  // Get cache item
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = storage.get(key, null);
      if (!item) return defaultValue;

      const { value, timestamp, ttl } = item;
      const now = Date.now();

      // Check if item has expired
      if (now - timestamp > ttl) {
        storage.remove(key);
        return defaultValue;
      }

      return value;
    } catch (error) {
      console.error(`Error getting cache item: ${error}`);
      return defaultValue;
    }
  },

  // Remove cache item
  remove: (key: string): void => {
    storage.remove(key);
  },

  // Clear all cache
  clear: (): void => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        storage.remove(key);
      }
    });
  },

  // Check if cache item exists and is valid
  has: (key: string): boolean => {
    try {
      const item = storage.get(key, null);
      if (!item) return false;

      const { timestamp, ttl } = item;
      const now = Date.now();

      if (now - timestamp > ttl) {
        storage.remove(key);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  },
};
