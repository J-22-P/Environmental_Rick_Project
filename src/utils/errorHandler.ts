// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  stack?: string;
}

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PREDICTION_ERROR: 'PREDICTION_ERROR',
  DATA_LOAD_ERROR: 'DATA_LOAD_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// Error messages in Thai
export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'ไม่สามารถเชื่อมต่อเครือข่ายได้',
  [ERROR_CODES.API_ERROR]: 'เกิดข้อผิดพลาดในการเชื่อมต่อ API',
  [ERROR_CODES.VALIDATION_ERROR]: 'ข้อมูลไม่ถูกต้อง',
  [ERROR_CODES.PREDICTION_ERROR]: 'เกิดข้อผิดพลาดในการทำนาย',
  [ERROR_CODES.DATA_LOAD_ERROR]: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
  [ERROR_CODES.UNKNOWN_ERROR]: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
} as const;

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Create error object
  public createError(
    code: string,
    message: string,
    details?: any,
    originalError?: Error
  ): AppError {
    const error: AppError = {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      stack: originalError?.stack,
    };

    this.logError(error);
    return error;
  }

  // Log error
  public logError(error: AppError): void {
    this.errorLog.push(error);
    console.error('Error logged:', error);
  }

  // Get error log
  public getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  // Clear error log
  public clearErrorLog(): void {
    this.errorLog = [];
  }

  // Handle API error
  public handleApiError(error: any): AppError {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์';
      
      return this.createError(
        ERROR_CODES.API_ERROR,
        message,
        { status, response: error.response.data },
        error
      );
    } else if (error.request) {
      // Network error
      return this.createError(
        ERROR_CODES.NETWORK_ERROR,
        ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
        { request: error.request },
        error
      );
    } else {
      // Other error
      return this.createError(
        ERROR_CODES.UNKNOWN_ERROR,
        error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
        { originalError: error },
        error
      );
    }
  }

  // Handle validation error
  public handleValidationError(message: string, details?: any): AppError {
    return this.createError(
      ERROR_CODES.VALIDATION_ERROR,
      message,
      details
    );
  }

  // Handle prediction error
  public handlePredictionError(message: string, details?: any): AppError {
    return this.createError(
      ERROR_CODES.PREDICTION_ERROR,
      message,
      details
    );
  }

  // Handle data load error
  public handleDataLoadError(message: string, details?: any): AppError {
    return this.createError(
      ERROR_CODES.DATA_LOAD_ERROR,
      message,
      details
    );
  }

  // Get user-friendly error message
  public getUserFriendlyMessage(error: AppError): string {
    return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || error.message;
  }

  // Check if error is retryable
  public isRetryable(error: AppError): boolean {
    return error.code === ERROR_CODES.NETWORK_ERROR || 
           error.code === ERROR_CODES.API_ERROR;
  }

  // Get retry delay based on error
  public getRetryDelay(error: AppError, attempt: number): number {
    if (!this.isRetryable(error)) return 0;
    
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attempt - 1), 16000);
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions
export const createError = (
  code: string,
  message: string,
  details?: any,
  originalError?: Error
): AppError => {
  return errorHandler.createError(code, message, details, originalError);
};

export const handleApiError = (error: any): AppError => {
  return errorHandler.handleApiError(error);
};

export const handleValidationError = (message: string, details?: any): AppError => {
  return errorHandler.handleValidationError(message, details);
};

export const handlePredictionError = (message: string, details?: any): AppError => {
  return errorHandler.handlePredictionError(message, details);
};

export const handleDataLoadError = (message: string, details?: any): AppError => {
  return errorHandler.handleDataLoadError(message, details);
};

export const getUserFriendlyMessage = (error: AppError): string => {
  return errorHandler.getUserFriendlyMessage(error);
};

export const isRetryable = (error: AppError): boolean => {
  return errorHandler.isRetryable(error);
};

export const getRetryDelay = (error: AppError, attempt: number): number => {
  return errorHandler.getRetryDelay(error, attempt);
};
