import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { useFeeForms } from '../../context/FeeFormsContext';

const AdminSubmissionView: React.FC = () => {
  const { forms, submissions } = useFeeForms();

  // Get admin-created forms
  const adminForms = forms.filter(form => form.title.includes('[Admin]'));

  // Get submissions for admin forms
  const adminFormSubmissions = submissions.filter(submission =>
    adminForms.some(form => form.id === submission.formId)
  );

  // Group submissions by form
  const submissionsByForm = adminFormSubmissions.reduce((acc, submission) => {
    const formId = submission.formId;
    if (!acc[formId]) acc[formId] = [];
    acc[formId].push(submission);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div>
      <PageMeta
        title="Admin Form Submissions | SPREADVERSE"
        description="View all submissions for admin-created forms"
      />
      <PageBreadcrumb pageTitle="Admin Form Submissions" />

      <div className="max-w-6xl mx-auto mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Total Forms</h3>
            <p className="text-2xl font-bold text-primary">{adminForms.length}</p>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Total Submissions</h3>
            <p className="text-2xl font-bold text-blue-600">{adminFormSubmissions.length}</p>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Active Forms</h3>
            <p className="text-2xl font-bold text-green-600">{adminForms.filter(f => f.isActive).length}</p>
          </div>
        </div>

        {adminForms.length === 0 ? (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-8 text-center">
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">No Admin Forms Created</h3>
            <p className="text-gray-600 dark:text-gray-400">Create your first administrative form to start collecting submissions.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {adminForms.map((form) => {
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
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="bg-gray-2 dark:bg-meta-4">
                              <th className="py-3 px-4 text-left text-sm font-medium text-black dark:text-white">Submitted By</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-black dark:text-white">Submitted At</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-black dark:text-white">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formSubmissions.map((submission) => (
                              <tr key={submission.id} className="border-t border-stroke dark:border-strokedark">
                                <td className="py-3 px-4 text-sm text-black dark:text-white">
                                  Student ID: {submission.submittedBy}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(submission.submittedAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                                    Submitted
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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

export default AdminSubmissionView;
