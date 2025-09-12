export type UserRole = 'student' | 'admin' | 'clerk' | 'hostel-warden';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Fee Submission Form types
export interface FeeFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'textarea' | 'select' | 'file';
  required: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
}

export interface FeeSubmissionForm {
  id: string;
  title: string;
  description: string;
  fields: FeeFormField[];
  createdBy: string; // clerk's user ID
  createdAt: Date;
  isActive: boolean;
  deadline?: Date;
}

export interface FeeFormSubmission {
  id: string;
  formId: string;
  submittedBy: string; // student's user ID
  submittedAt: Date;
  data: Record<string, any>; // field responses
}

export interface FeeFormSubmissionData {
  fieldId: string;
  value: string | number | File | null;
}
