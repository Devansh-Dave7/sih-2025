import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { useFeeForms } from '../../context/FeeFormsContext';
import { FeeFormField } from '../../types/auth';

const CreateFeeSubmissionForm: React.FC = () => {
  const navigate = useNavigate();
  const { createForm } = useFeeForms();

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FeeFormField[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addField = () => {
    const newField: FeeFormField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<FeeFormField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || fields.length === 0) {
      alert('Please enter a form title and add at least one field.');
      return;
    }

    // Check if all fields have labels
    const hasEmptyLabels = fields.some(field => !field.label.trim());
    if (hasEmptyLabels) {
      alert('Please provide labels for all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await createForm({
        title: formTitle,
        description: formDescription,
        fields,
        isActive,
        deadline: deadline ? new Date(deadline) : undefined,
      });

      if (success) {
        alert('Fee submission form created successfully!');
        navigate('/dashboard');
      } else {
        alert('Failed to create form. Please try again.');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      alert('An error occurred while creating the form.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Create Fee Submission Form | TailAdmin"
        description="Create fee submission forms for students"
      />
      <PageBreadcrumb pageTitle="Create Fee Submission Form" />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Form Configuration
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5">
            {/* Form Title */}
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Form Title <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter form title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            {/* Form Description */}
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter form description (optional)"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Submission Deadline (Optional)
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-3"
              />
              <label className="text-black dark:text-white">
                Form is active (students can submit)
              </label>
            </div>

            {/* Dynamic Fields */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-black dark:text-white">Form Fields</h4>
                <button
                  type="button"
                  onClick={addField}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-4 text-center font-medium text-white transition-colors duration-200 border border-blue-600"
                >
                  Add Field
                </button>
              </div>

              <div className="space-y-4">
                {fields.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No fields added yet. Click "Add Field" to get started.</p>
                ) : (
                  fields.map((field, index) => (
                    <div key={field.id} className="border border-stroke rounded-lg p-4 dark:border-strokedark">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="mb-2 block text-sm text-black dark:text-white">
                            Field Label <span className="text-meta-1">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter field label"
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-black dark:text-white">
                            Field Type
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) => updateField(index, { type: e.target.value as any })}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="date">Date</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Select</option>
                            <option value="file">File Upload</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="mb-2 block text-sm text-black dark:text-white">
                          Placeholder (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Enter placeholder text"
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {field.type === 'select' && (
                        <div className="mb-4">
                          <label className="mb-2 block text-sm text-black dark:text-white">
                            Options (comma-separated)
                          </label>
                          <input
                            type="text"
                            placeholder="Option 1, Option 2, Option 3"
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => updateField(index, {
                              options: e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt)
                            })}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(index, { required: e.target.checked })}
                            className="mr-2"
                          />
                          Required field
                        </label>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="inline-flex items-center justify-center rounded-md bg-red-500 py-1 px-3 text-center font-medium text-white hover:bg-red-600 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4 border-t border-stroke dark:border-strokedark">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 py-3 px-6 text-center font-medium text-white transition-colors duration-200 border border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Form'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center rounded-md bg-gray-600 hover:bg-gray-700 py-3 px-6 text-center font-medium text-white transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFeeSubmissionForm;
