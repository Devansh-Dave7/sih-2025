import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { SemesterGrades, StudentGradesRecord, SubjectGrade } from "../../types/academics";
import { computeAll, getGrades, saveGrades, seedIfMissing } from "../../utils/localGradesStore";

const semestersList = Array.from({ length: 8 }, (_, i) => i + 1);

const StudentGrades: React.FC = () => {
  const { user } = useAuth();
  const [record, setRecord] = useState<StudentGradesRecord | null>(null);
  const [selectedSem, setSelectedSem] = useState<number>(1);

  useEffect(() => {
    if (!user) return;
    seedIfMissing(user);
    const rec = getGrades(user.id);
    if (rec) setRecord(rec);
  }, [user]);

  const currentSemester = useMemo<SemesterGrades | undefined>(() => {
    return record?.semesters.find((s) => s.semesterNumber === selectedSem);
  }, [record, selectedSem]);

  const handleRecompute = () => {
    if (!record) return;
    const computed = computeAll(record);
    setRecord(computed);
    if (user) saveGrades(user.id, computed);
  };

  if (!user) {
    return <div className="p-6">No user found.</div>;
  }

  if (!record) {
    return <div className="p-6">Loading your grades...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Grades</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 dark:text-gray-300">Semester</label>
          <select
            className="rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
            value={selectedSem}
            onChange={(e) => setSelectedSem(parseInt(e.target.value))}
          >
            {semestersList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
          <p className="text-xs text-gray-500">Semester GPA</p>
          <p className="mt-1 text-2xl font-semibold">{currentSemester?.semesterGPA ?? "-"}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
          <p className="text-xs text-gray-500">CGPA</p>
          <p className="mt-1 text-2xl font-semibold">{record.cgpa ?? "-"}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
          <p className="text-xs text-gray-500">Subjects</p>
          <p className="mt-1 text-2xl font-semibold">{currentSemester?.subjects.length ?? 0}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-gray-100 bg-white dark:bg-gray-900 dark:ring-white/10">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Subject</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Credits</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Midterms</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">End Sem</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">GP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {currentSemester?.subjects.map((subj: SubjectGrade) => (
              <tr key={subj.code} className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{subj.code}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{subj.name}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{subj.credits}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                  {subj.assessments.midterms.join(", ")}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{subj.assessments.endSem}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{subj.totalScore?.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{subj.gradePoints?.toFixed(2)}</td>
              </tr>
            ))}
            {(!currentSemester || currentSemester.subjects.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                  No subjects found for this semester.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRecompute}
          className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600"
        >
          Recompute Grades
        </button>
      </div>
    </div>
  );
};

export default StudentGrades;
