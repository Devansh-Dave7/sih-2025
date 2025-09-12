import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { useFeeForms } from '../../context/FeeFormsContext';
import { FeeFormField } from '../../types/auth';

const CreateAdminForms: React.FC = () => {
  const navigate = useNavigate();
  const { createForm } = useFeeForms();

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FeeFormField[]>([]);
  const [isActive] = useState(true);
  const [deadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addField = () => {
    const newField: FeeFormField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: [],
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

    const hasEmptyLabels = fields.some(field => !field.label.trim());
    if (hasEmptyLabels) {
      alert('Please provide labels for all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await createForm({
        title: `[Admin] ${formTitle}`,
        description: formDescription,
        fields,
        isActive,
        deadline: deadline ? new Date(deadline) : undefined,
      });

      if (success) {
        alert('Administrative form created successfully!');
        navigate('/dashboard');
      } else {
        alert('Failed to create form. Please try again.');
      }
    } catch (error) {
      console.error('Error creating admin form:', error);
      alert('An error occurred while creating the form.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Create Administrative Forms | SPREADVERSE"
        description="Create administrative forms for students and staff"
      />
      <PageBreadcrumb pageTitle="Create Administrative Forms" />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Administrative Form Configuration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create forms for registrations, applications, and administrative processes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Form Title <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Student Registration Form"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-3 block text-black dark:text-white">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter form description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

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
                        <input
                          type="text"
                          placeholder="Field label"
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          required
                        />
                        <select
                          value={field.type}
                          onChange={(e) => updateField(index, { type: e.target.value as any })}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="number">Number</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                          <option value="date">Date</option>
                          <option value="file">File Upload</option>
                        </select>
                      </div>

                      <div className="flex justify-end">
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

            <div className="flex gap-4 pt-4 border-t border-stroke dark:border-strokedark">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 py-3 px-6 text-center font-medium text-white transition-colors duration-200 border border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Admin Form'}
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

export default CreateAdminForms;
