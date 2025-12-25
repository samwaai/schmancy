/**
 * Authentication and OTP related types for Samwa application
 */

export interface OTPRequest {
  email: string;
}

export interface OTPVerificationRequest {
  email: string;
  code: string;
}

export interface OTPResponse {
  success: boolean;
  message?: string;
}

export interface OTPSessionResponse {
  token: string;
  user?: any;
  employee?: any;
  userType: 'user' | 'employee' | 'new';
}