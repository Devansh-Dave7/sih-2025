import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { useFeeForms } from '../../context/FeeFormsContext';
import { useAuth } from '../../context/AuthContext';
import { FeeSubmissionForm, FeeFormSubmission, FeeFormField } from '../../types/auth';

const FeeSubmissions: React.FC = () => {
  const { user } = useAuth();
  const { forms, submitForm, getUserSubmissions } = useFeeForms();
  const [selectedForm, setSelectedForm] = useState<FeeSubmissionForm | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userSubmissions = getUserSubmissions(user?.id || '');

  // Only show active forms that haven't been submitted by this user
  const availableForms = forms.filter(form =>
    form.isActive &&
    !userSubmissions.some(submission => submission.formId === form.id)
  );

  const submittedForms = forms.filter(form =>
    userSubmissions.some(submission => submission.formId === form.id)
  );

  const handleFormSelect = (form: FeeSubmissionForm) => {
    setSelectedForm(form);
    setFormData({});
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [fieldId]: file }));
  };

  const validateForm = (fields: FeeFormField[], data: Record<string, any>) => {
    for (const field of fields) {
      if (field.required && (!data[field.id] || data[field.id] === '')) {
        alert(`Please fill in the required field: ${field.label}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedForm || !user) return;

    if (!validateForm(selectedForm.fields, formData)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await submitForm({
        formId: selectedForm.id,
        submittedBy: user.id,
        data: formData,
      });

      if (success) {
        alert('Form submitted successfully!');
        setSelectedForm(null);
        setFormData({});
        // The page will automatically update when forms state changes
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (field: FeeFormField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            key={field.id}
            type={field.type}
            placeholder={field.placeholder || ''}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        );

      case 'date':
        return (
          <input
            key={field.id}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        );

      case 'textarea':
        return (
          <textarea
            key={field.id}
            placeholder={field.placeholder || ''}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            rows={4}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        );

      case 'select':
        return (
          <select
            key={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            key={field.id}
            type="file"
            onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
            required={field.required}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <PageMeta
        title="Fee Submissions | TailAdmin"
        description="View and submit fee forms"
      />
      <PageBreadcrumb pageTitle="Fee Submissions" />

      <div className="max-w-6xl mx-auto mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Forms */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                Available Forms
              </h2>

              {availableForms.length === 0 ? (
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 text-center">
                  <p className="text-gray-500">No forms available for submission.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableForms.map((form) => (
                    <div
                      key={form.id}
                      className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleFormSelect(form)}
                    >
                      <h3 className="font-medium text-black dark:text-white mb-2">
                        {form.title}
                      </h3>
                      {form.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {form.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Deadline: {form.deadline ? new Date(form.deadline).toLocaleDateString() : 'No deadline'}
                        </span>
                        <span className="text-primary font-medium">
                          {selectedForm?.id === form.id ? 'Selected' : 'Click to fill'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submitted Forms */}
            {submittedForms.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
                  Submitted Forms
                </h2>
                <div className="space-y-4">
                  {submittedForms.map((form) => {
                    const submission = userSubmissions.find(sub => sub.formId === form.id);
                    return (
                      <div
                        key={form.id}
                        className="rounded-sm border border-green-200 bg-green-50 shadow-default dark:border-green-800 dark:bg-green-900/20 p-4"
                      >
                        <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                          {form.title}
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Submitted on: {submission ? new Date(submission.submittedAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Form Submission */}
          <div>
            {selectedForm ? (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    {selectedForm.title}
                  </h3>
                  {selectedForm.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedForm.description}
                    </p>
                  )}
                  {selectedForm.deadline && (
                    <p className="text-sm text-meta-1 mt-2">
                      Deadline: {new Date(selectedForm.deadline).toLocaleString()}
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="p-6.5 space-y-6">
                  {selectedForm.fields.map((field) => (
                    <div key={field.id}>
                      <label className="mb-3 block text-black dark:text-white">
                        {field.label}
                        {field.required && <span className="text-meta-1 ml-1">*</span>}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}

                  <div className="flex gap-4 pt-4 border-t border-stroke dark:border-strokedark">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedForm(null);
                        setFormData({});
                      }}
                      className="inline-flex items-center justify-center rounded-md bg-gray-500 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-sm border border-stroke bg-gray-50 shadow-default dark:border-strokedark dark:bg-gray-800 p-8 text-center">
                <h3 className="font-medium text-black dark:text-white mb-2">
                  Select a Form to Fill
                </h3>
                <p className="text-gray-500">
                  Click on any available form from the list to start filling it out.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeSubmissions;
