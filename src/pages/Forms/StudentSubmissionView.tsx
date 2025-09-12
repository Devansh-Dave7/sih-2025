import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { useFeeForms } from '../../context/FeeFormsContext';
import { useAuth } from '../../context/AuthContext';

const StudentSubmissionView: React.FC = () => {
  const { user } = useAuth();
  const { forms, submissions } = useFeeForms();

  // Get user's submissions
  const userSubmissions = submissions.filter(submission =>
    submission.submittedBy === user?.id
  );

  // Match submissions with their form details
  const userSubmissionsWithForms = userSubmissions.map(submission => {
    const form = forms.find(f => f.id === submission.formId);
    return {
      ...submission,
      formTitle: form?.title || 'Unknown Form',
      formDescription: form?.description || '',
      formType: form?.title ? (
        form.title.includes('[Admin]') ? 'Administrative' :
        form.title.includes('[Hostel]') ? 'Hostel' : 'Fee'
      ) : 'Unknown'
    };
  });

  return (
    <div>
      <PageMeta
        title="My Form Submissions | TailAdmin"
        description="View all your form submissions"
      />
      <PageBreadcrumb pageTitle="My Submissions" />

      <div className="max-w-6xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Total Submissions</h3>
            <p className="text-2xl font-bold text-primary">{userSubmissions.length}</p>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Forms Completed</h3>
            <p className="text-2xl font-bold text-green-600">{new Set(userSubmissions.map(s => s.formId)).size}</p>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Recent Activity</h3>
            <p className="text-2xl font-bold text-blue-600">
              {userSubmissions.filter(s =>
                new Date(s.submittedAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000)
              ).length} this week
            </p>
          </div>
        </div>

        {userSubmissions.length === 0 ? (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-12 text-center">
            <h3 className="text-xl font-medium text-black dark:text-white mb-4">No Submissions Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't submitted any forms yet. Check the "Available Forms" section to see forms you can fill out.
            </p>
            <button
              onClick={() => window.location.href = '/available-forms'}
              className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary hover:bg-opacity-90 py-3 px-6 text-center font-medium text-white transition-colors duration-200"
            >
              View Available Forms
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-black dark:text-white">Your Form Submissions</h2>

            {userSubmissionsWithForms.map((submission) => (
              <div key={submission.id} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-black dark:text-white mb-1">
                        {submission.formTitle}
                      </h3>
                      {submission.formDescription && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {submission.formDescription}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        submission.formType === 'Administrative' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        submission.formType === 'Hostel' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {submission.formType}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6.5">
                  <div className="text-sm">
                    <p className="font-medium text-black dark:text-white mb-3">Submission Details:</p>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(submission.data || {}).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700 dark:text-gray-300 sm:w-1/3">
                              {key}:
                            </span>
                            <span className="text-gray-900 dark:text-gray-100 sm:w-2/3 text-right">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSubmissionView;
