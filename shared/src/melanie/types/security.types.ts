export interface SecurityEvent {
  userId: string;
  anomalies: Anomaly[];
  paymentData: any;
  timestamp: Date;
}

export interface Anomaly {
  type: 'UNUSUAL_AMOUNT' | 'RAPID_PAYMENTS' | 'NEW_RECIPIENT' | 'UNUSUAL_TIME';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface SecurityHeaders {
  'Strict-Transport-Security': string;
  'Content-Security-Policy': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
}