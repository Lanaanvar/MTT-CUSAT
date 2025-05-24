import { toast } from "sonner"

// Error Types
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  SERVER = 'SERVER',
  UPLOAD = 'UPLOAD',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN'
}

// Custom Error Class
export class AppError extends Error {
  type: ErrorType;
  originalError?: any;

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN, originalError?: any) {
    super(message);
    this.type = type;
    this.originalError = originalError;
    this.name = 'AppError';
  }
}

// Error Messages
export const ErrorMessages = {
  CLOUDINARY: {
    MISSING_CONFIG: 'Image upload configuration is missing. Please check your environment variables.',
    UPLOAD_FAILED: 'Failed to upload image. Please try again.',
    INVALID_FILE: 'Invalid file type. Please upload an image file.',
    FILE_TOO_LARGE: 'File size too large. Maximum size is 10MB.',
  },
  FIREBASE: {
    DOCUMENT_NOT_FOUND: 'Requested document not found.',
    PERMISSION_DENIED: 'You do not have permission to perform this action.',
    INVALID_DATA: 'Invalid data provided.',
    CONNECTION_ERROR: 'Database connection error. Please try again.',
  },
  FORM: {
    REQUIRED_FIELDS: 'Please fill in all required fields.',
    INVALID_DATE: 'Please enter a valid date.',
    INVALID_TIME: 'Please enter a valid time.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid phone number.',
  },
  NETWORK: {
    CONNECTION_ERROR: 'Network connection error. Please check your internet connection.',
    REQUEST_TIMEOUT: 'Request timed out. Please try again.',
  }
};

// Validation Functions
export const validateImageFile = (file: File): void => {
  if (!file.type.startsWith('image/')) {
    throw new AppError(ErrorMessages.CLOUDINARY.INVALID_FILE, ErrorType.VALIDATION);
  }
  
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new AppError(ErrorMessages.CLOUDINARY.FILE_TOO_LARGE, ErrorType.VALIDATION);
  }
};

// Error Handler
export const handleError = (error: any): void => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.VALIDATION:
        toast.error(error.message);
        break;
      case ErrorType.AUTHENTICATION:
        toast.error('Please sign in to continue.');
        // Redirect to login if needed
        break;
      case ErrorType.AUTHORIZATION:
        toast.error('You do not have permission to perform this action.');
        break;
      case ErrorType.UPLOAD:
        toast.error(error.message || ErrorMessages.CLOUDINARY.UPLOAD_FAILED);
        break;
      case ErrorType.DATABASE:
        toast.error(error.message || ErrorMessages.FIREBASE.CONNECTION_ERROR);
        break;
      case ErrorType.NETWORK:
        toast.error(error.message || ErrorMessages.NETWORK.CONNECTION_ERROR);
        break;
      default:
        toast.error('An unexpected error occurred. Please try again.');
    }
  } else if (error.code && error.code.startsWith('storage/')) {
    // Firebase Storage errors
    toast.error('File upload error. Please try again.');
  } else if (error.code && error.code.startsWith('auth/')) {
    // Firebase Auth errors
    toast.error('Authentication error. Please try again.');
  } else {
    toast.error('An unexpected error occurred. Please try again.');
  }
};

// Form Validation
export const validateEventForm = (formData: any): void => {
  const requiredFields = ['title', 'date', 'time', 'location', 'type', 'description'];
  const missingFields = requiredFields.filter(field => !formData[field]);
  
  if (missingFields.length > 0) {
    throw new AppError(
      `${ErrorMessages.FORM.REQUIRED_FIELDS} Missing: ${missingFields.join(', ')}`,
      ErrorType.VALIDATION
    );
  }

  // Validate date
  if (new Date(formData.date).toString() === 'Invalid Date') {
    throw new AppError(ErrorMessages.FORM.INVALID_DATE, ErrorType.VALIDATION);
  }

  // Validate time
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(formData.time)) {
    throw new AppError(ErrorMessages.FORM.INVALID_TIME, ErrorType.VALIDATION);
  }
}; 