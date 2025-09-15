import React from "react";
import { useEffect, useMemo, useState } from "react";
import { computeAll, getGradeConfig, getGrades, saveGrades, seedIfMissing } from "../../utils/localGradesStore";
import { SemesterGrades, StudentGradesRecord, SubjectGrade } from "../../types/academics";
import { User } from "../../types/auth";

// Mock student directory for admin to pick from
const MOCK_STUDENTS: Array<Pick<User, "id" | "firstName" | "lastName" | "email">> = [
  { id: "stu1", firstName: "Aarav", lastName: "Sharma", email: "aarav.sharma@example.edu" },
  { id: "stu2", firstName: "Diya", lastName: "Patel", email: "diya.patel@example.edu" },
  { id: "stu3", firstName: "Ishaan", lastName: "Verma", email: "ishaan.verma@example.edu" },
];

const makeEmptySemester = (num: number): SemesterGrades => ({ semesterNumber: num, subjects: [] as SubjectGrade[] });
const makeEmptySubject = (): SubjectGrade => ({
  code: "",
  name: "",
  credits: 1,
  assessments: { midterms: [0, 0], endSem: 0 },
});

const AdminStudentGradesEditor: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS[0]?.id ?? "");
  const [record, setRecord] = useState<StudentGradesRecord | null>(null);
  const [semesterIndex, setSemesterIndex] = useState<number>(0);
  const [justSaved, setJustSaved] = useState<string>("");

  // Load or seed grades for selected student
  useEffect(() => {
    if (!selectedStudentId) return;
    const tempUser: User = {
      id: selectedStudentId,
      email: `${selectedStudentId}@example.edu`,
      firstName: "Student",
      lastName: selectedStudentId.toUpperCase(),
      role: "student",
      isActive: true,
    };
    // Seed only if missing for this student
    seedIfMissing(tempUser);
    const rec = getGrades(selectedStudentId);
    if (rec) {
      setRecord(rec);
      setSemesterIndex(0);
    } else {
      // initialize empty record
      const empty: StudentGradesRecord = { userId: selectedStudentId, semesters: [] };
      setRecord(empty);
      setSemesterIndex(0);
    }
  }, [selectedStudentId]);

  const cfg = useMemo(() => getGradeConfig(), [record?.userId]);
  // Derived live-computed view (not persisted until Save)
  const computedRecord = useMemo(() => (record ? computeAll(record) : null), [record, cfg]);
  const currentSemester = useMemo(() => computedRecord?.semesters[semesterIndex], [computedRecord, semesterIndex]);

  const handleAddSemester = () => {
    if (!record) return;
    const nextNum = (record.semesters[record.semesters.length - 1]?.semesterNumber || 0) + 1;
    const updated = { ...record, semesters: [...record.semesters, makeEmptySemester(nextNum)] };
    setRecord(updated);
    setSemesterIndex(record.semesters.length); // select the new one
  };

  const handleRemoveSemester = (index: number) => {
    if (!record) return;
    const semesters = [...record.semesters];
    semesters.splice(index, 1);
    const updated = { ...record, semesters };
    setRecord(updated);
    setSemesterIndex((prev) => Math.max(0, Math.min(prev, semesters.length - 1)));
  };

  const handleAddSubject = () => {
    if (!record) return;
    const semesters = [...record.semesters];
    if (!semesters[semesterIndex]) return;
    semesters[semesterIndex] = { ...semesters[semesterIndex], subjects: [...semesters[semesterIndex].subjects, makeEmptySubject()] };
    setRecord({ ...record, semesters });
  };

  const handleRemoveSubject = (subjIdx: number) => {
    if (!record) return;
    const semesters = [...record.semesters];
    const sem = semesters[semesterIndex];
    if (!sem) return;
    const subjects = [...sem.subjects];
    subjects.splice(subjIdx, 1);
    semesters[semesterIndex] = { ...sem, subjects };
    setRecord({ ...record, semesters });
  };

  const updateSubjectField = (subjIdx: number, field: keyof SubjectGrade, value: any) => {
    if (!record) return;
    const semesters = [...record.semesters];
    const sem = semesters[semesterIndex];
    if (!sem) return;
    const subjects = [...sem.subjects];
    const subj = { ...subjects[subjIdx], [field]: value } as SubjectGrade;
    subjects[subjIdx] = subj;
    semesters[semesterIndex] = { ...sem, subjects };
    setRecord({ ...record, semesters });
  };

  const updateAssessment = (subjIdx: number, kind: "mt1" | "mt2" | "end", value: number) => {
    if (!record) return;
    const semesters = [...record.semesters];
    const sem = semesters[semesterIndex];
    if (!sem) return;
    const subjects = [...(sem.subjects || [])];
    const subj = { ...(subjects[subjIdx] || makeEmptySubject()) } as SubjectGrade;
    const assessments = { ...(subj.assessments || { midterms: [0, 0], endSem: 0 }) };
    if (kind === "mt1") assessments.midterms[0] = value;
    if (kind === "mt2") assessments.midterms[1] = value;
    if (kind === "end") assessments.endSem = value;
    subj.assessments = assessments;
    subjects[subjIdx] = subj;
    semesters[semesterIndex] = { ...sem, subjects };
    setRecord({ ...record, semesters });
  };

  const handleSave = () => {
    if (!record || !selectedStudentId) return;
    // compute using current config then persist
    const computed = computeAll(record);
    setRecord(computed);
    saveGrades(selectedStudentId, computed);
    setJustSaved("Saved changes.");
    setTimeout(() => setJustSaved(""), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin: Student Grades Editor</h1>

      {/* Student selector */}
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="col-span-2">
            <label className="block text-xs text-gray-600 mb-1">Select Student</label>
            <select
              className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {MOCK_STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600"
              disabled={!record}
            >
              Save Changes
            </button>
          </div>
        </div>
        {justSaved && <p className="mt-2 text-xs text-green-600">{justSaved}</p>}
      </div>

      {/* Semester controls */}
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">Semesters</h2>
          <div className="flex gap-2">
            <button onClick={handleAddSemester} className="px-3 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">Add Semester</button>
            {record && record.semesters.length > 0 && (
              <button onClick={() => handleRemoveSemester(semesterIndex)} className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300">Remove Selected</button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(record?.semesters || []).map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSemesterIndex(idx)}
              className={`px-3 py-1 rounded-lg text-sm border ${idx === semesterIndex ? "bg-brand-500 text-white border-brand-500" : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10"}`}
            >
              Semester {s.semesterNumber}
            </button>
          ))}
          {(!record || record.semesters.length === 0) && (
            <p className="text-sm text-gray-500">No semesters yet. Click "Add Semester".</p>
          )}
        </div>
      </div>

      {/* Subjects for current semester */}
      {currentSemester && (
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white">Subjects - Semester {currentSemester.semesterNumber}</h2>
            <button onClick={handleAddSubject} className="px-3 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">Add Subject</button>
          </div>

          <div className="space-y-4">
            {currentSemester.subjects.map((subj, i) => (
              <div key={i} className="rounded-lg border border-gray-100 dark:border-white/10 p-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Code</label>
                    <input
                      type="text"
                      value={subj.code}
                      onChange={(e) => updateSubjectField(i, "code", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={subj.name}
                      onChange={(e) => updateSubjectField(i, "name", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">Credits</label>
                    <input
                      type="number"
                      min={0}
                      value={subj.credits}
                      onChange={(e) => updateSubjectField(i, "credits", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">MT1</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={subj.assessments?.midterms?.[0] ?? 0}
                      onChange={(e) => updateAssessment(i, "mt1", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">MT2</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={subj.assessments?.midterms?.[1] ?? 0}
                      onChange={(e) => updateAssessment(i, "mt2", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">End</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={subj.assessments?.endSem ?? 0}
                      onChange={(e) => updateAssessment(i, "end", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">Total</label>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {typeof subj.totalScore === "number" ? subj.totalScore.toFixed(2) : "-"}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-600 mb-1">GP</label>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {typeof subj.gradePoints === "number" ? subj.gradePoints.toFixed(2) : "-"}
                    </div>
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <button onClick={() => handleRemoveSubject(i)} className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300">Remove</button>
                  </div>
                </div>
              </div>
            ))}
            {currentSemester.subjects.length === 0 && (
              <p className="text-sm text-gray-500">No subjects yet. Click "Add Subject".</p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-3">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Current weights: MT1 {cfg.midtermWeights[0]} • MT2 {cfg.midtermWeights[1]} • End {cfg.endSemWeight}
            </div>
            <div className="text-sm text-gray-900 dark:text-white">
              Semester GPA: {typeof currentSemester.semesterGPA === "number" ? currentSemester.semesterGPA.toFixed(2) : "-"}
            </div>
          </div>
        </div>
      )}

      {/* Footer: Save and CGPA */}
      {computedRecord && (
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            CGPA: {typeof computedRecord.cgpa === "number" ? computedRecord.cgpa.toFixed(2) : "-"}
          </div>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600">Save All</button>
        </div>
      )}
    </div>
  );
};

export default AdminStudentGradesEditor;
