import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FeeSubmissionForm, FeeFormSubmission } from '../types/auth';
import { useAuth } from './AuthContext';

interface FeeFormsContextType {
  forms: FeeSubmissionForm[];
  submissions: FeeFormSubmission[];
  createForm: (form: Omit<FeeSubmissionForm, 'id' | 'createdBy' | 'createdAt'>) => Promise<boolean>;
  updateForm: (formId: string, updates: Partial<FeeSubmissionForm>) => Promise<boolean>;
  deleteForm: (formId: string) => Promise<boolean>;
  submitForm: (submission: Omit<FeeFormSubmission, 'id' | 'submittedAt'>) => Promise<boolean>;
  getFormSubmissions: (formId: string) => FeeFormSubmission[];
  getUserSubmissions: (userId: string) => FeeFormSubmission[];
}

const FeeFormsContext = createContext<FeeFormsContextType | undefined>(undefined);

export const useFeeForms = () => {
  const context = useContext(FeeFormsContext);
  if (context === undefined) {
    throw new Error('useFeeForms must be used within a FeeFormsProvider');
  }
  return context;
};

interface FeeFormsProviderProps {
  children: ReactNode;
}

export const FeeFormsProvider: React.FC<FeeFormsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [forms, setForms] = useState<FeeSubmissionForm[]>([]);
  const [submissions, setSubmissions] = useState<FeeFormSubmission[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedForms = localStorage.getItem('feeForms');
    const storedSubmissions = localStorage.getItem('feeSubmissions');

    if (storedForms) {
      try {
        const parsedForms = JSON.parse(storedForms);
        // Convert date strings back to Date objects
        const formsWithDates = parsedForms.map((form: any) => ({
          ...form,
          createdAt: new Date(form.createdAt),
          deadline: form.deadline ? new Date(form.deadline) : undefined,
        }));
        setForms(formsWithDates);
      } catch (error) {
        console.error('Error parsing stored forms:', error);
      }
    }

    if (storedSubmissions) {
      try {
        const parsedSubmissions = JSON.parse(storedSubmissions);
        const submissionsWithDates = parsedSubmissions.map((sub: any) => ({
          ...sub,
          submittedAt: new Date(sub.submittedAt),
        }));
        setSubmissions(submissionsWithDates);
      } catch (error) {
        console.error('Error parsing stored submissions:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('feeForms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('feeSubmissions', JSON.stringify(submissions));
  }, [submissions]);

  const createForm = async (formData: Omit<FeeSubmissionForm, 'id' | 'createdBy' | 'createdAt'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const newForm: FeeSubmissionForm = {
        ...formData,
        id: Date.now().toString(),
        createdBy: user.id,
        createdAt: new Date(),
      };

      setForms(prev => [...prev, newForm]);
      return true;
    } catch (error) {
      console.error('Error creating form:', error);
      return false;
    }
  };

  const updateForm = async (formId: string, updates: Partial<FeeSubmissionForm>): Promise<boolean> => {
    try {
      setForms(prev => prev.map(form =>
        form.id === formId ? { ...form, ...updates } : form
      ));
      return true;
    } catch (error) {
      console.error('Error updating form:', error);
      return false;
    }
  };

  const deleteForm = async (formId: string): Promise<boolean> => {
    try {
      setForms(prev => prev.filter(form => form.id !== formId));
      // Also delete all submissions for this form
      setSubmissions(prev => prev.filter(submission => submission.formId !== formId));
      return true;
    } catch (error) {
      console.error('Error deleting form:', error);
      return false;
    }
  };

  const submitForm = async (submissionData: Omit<FeeFormSubmission, 'id' | 'submittedAt'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const newSubmission: FeeFormSubmission = {
        ...submissionData,
        id: Date.now().toString(),
        submittedAt: new Date(),
      };

      setSubmissions(prev => [...prev, newSubmission]);
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    }
  };

  const getFormSubmissions = (formId: string): FeeFormSubmission[] => {
    return submissions.filter(submission => submission.formId === formId);
  };

  const getUserSubmissions = (userId: string): FeeFormSubmission[] => {
    return submissions.filter(submission => submission.submittedBy === userId);
  };

  const value: FeeFormsContextType = {
    forms,
    submissions,
    createForm,
    updateForm,
    deleteForm,
    submitForm,
    getFormSubmissions,
    getUserSubmissions,
  };

  return (
    <FeeFormsContext.Provider value={value}>
      {children}
    </FeeFormsContext.Provider>
  );
};
