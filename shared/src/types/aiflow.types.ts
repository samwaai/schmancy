// AI Flow Progress Tracking Types
// See: /docs/architecture/AI_FLOW_PROGRESS_TRACKING_DESIGN.md
//
// Flow Type Naming Convention: {app}.{domain}.{action}
// Examples: 'hannah.menu.extraction', 'owl.invoice.extraction', 'melanie.tips.calculation'
// This is a convention, not enforced by types (for flexibility)

export type AIFlowStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'retry';

export interface AIFlowStep {
  id: string;
  name: string;
  status: AIFlowStatus;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
  metadata?: Record<string, any>;
}

export interface AIFlow<TType extends string = string, TResult = any> {
  id: string;
  type: TType;              // Generic - strongly typed per flow
  status: AIFlowStatus;
  steps: AIFlowStep[];
  currentStepIndex: number;
  progress: number;          // 0-100
  orgId: string;
  businessId?: string;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  result: TResult | null;   // Generic - typed result
  error: string | null;
  metadata?: Record<string, any>;

  // Retry tracking
  retriedAt?: string;
  numberOfTrialsLeft?: number; // Max retry attempts remaining (default: 3)

  // Error details
  failureReason?: string;
  errorStep?: string;
}
