import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { useFeeForms } from '../../context/FeeFormsContext';

const HostelSubmissionView: React.FC = () => {
  const { forms, submissions } = useFeeForms();

  // Get hostel-created forms
  const hostelForms = forms.filter(form => form.title.includes('[Hostel]'));

  // Get submissions for hostel forms
  const hostelFormSubmissions = submissions.filter(submission =>
    hostelForms.some(form => form.id === submission.formId)
  );

  // Group submissions by form
  const submissionsByForm = hostelFormSubmissions.reduce((acc, submission) => {
    const formId = submission.formId;
    if (!acc[formId]) acc[formId] = [];
    acc[formId].push(submission);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div>
      <PageMeta
        title="Hostel Form Submissions | SPREADVERSE"
        description="View all submissions for hostel-created forms"
      />
      <PageBreadcrumb pageTitle="Hostel Form Submissions" />

      <div className="max-w-6xl mx-auto mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Total Forms</h3>
            <p className="text-2xl font-bold text-purple-600">{hostelForms.length}</p>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Total Submissions</h3>
            <p className="text-2xl font-bold text-blue-600">{hostelFormSubmissions.length}</p>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Active Forms</h3>
            <p className="text-2xl font-bold text-green-600">{hostelForms.filter(f => f.isActive).length}</p>
          </div>
        </div>

        {hostelForms.length === 0 ? (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 text-center">
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">No Hostel Forms Created</h3>
            <p className="text-gray-600 dark:text-gray-400">Create your first hostel form to start collecting submissions.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {hostelForms.map((form) => {
              const formSubmissions = submissionsByForm[form.id] || [];
              return (
                <div key={form.id} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-black dark:text-white">{form.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{form.description}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${form.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                          {form.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">{formSubmissions.length} submissions</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6.5">
                    {formSubmissions.length === 0 ? (
                      <p className="text-gray-500 text-center">No submissions yet for this form.</p>
                    ) : (
                      <div className="space-y-4">
                        {formSubmissions.map((submission) => (
                          <div key={submission.id} className="border border-stroke dark:border-strokedark rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <p className="text-sm font-medium text-black dark:text-white">
                                  Student ID: {submission.submittedBy}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                </p>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                                Submitted
                              </span>
                            </div>

                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              <strong>Submission Data:</strong>
                              <div className="mt-2 space-y-1">
                                {Object.entries(submission.data || {}).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="font-medium">{key}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelSubmissionView;
