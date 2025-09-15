import React, { useEffect, useMemo, useState } from "react";
import { getGradeConfig, saveGradeConfig, defaultGradeConfig } from "../../utils/localGradesStore";
import { Link } from "react-router";

const AdminSettings: React.FC = () => {
  const [mid1, setMid1] = useState<number>(defaultGradeConfig.midtermWeights[0]);
  const [mid2, setMid2] = useState<number>(defaultGradeConfig.midtermWeights[1] ?? 0);
  const [endSem, setEndSem] = useState<number>(defaultGradeConfig.endSemWeight);
  const [saved, setSaved] = useState<string>("");

  useEffect(() => {
    const cfg = getGradeConfig();
    setMid1(cfg.midtermWeights[0] ?? 0);
    setMid2(cfg.midtermWeights[1] ?? 0);
    setEndSem(cfg.endSemWeight);
  }, []);

  const total = useMemo(() => mid1 + mid2 + endSem, [mid1, mid2, endSem]);
  const isValid = Math.abs(total - 1) < 1e-6; // sum should be 1

  const normalize = () => {
    const sum = mid1 + mid2 + endSem || 1;
    setMid1(parseFloat((mid1 / sum).toFixed(2)));
    setMid2(parseFloat((mid2 / sum).toFixed(2)));
    setEndSem(parseFloat((endSem / sum).toFixed(2)));
    setSaved("");
  };

  const save = () => {
    saveGradeConfig({ midtermWeights: [mid1, mid2], endSemWeight: endSem });
    setSaved("Saved grade weights.");
    setTimeout(() => setSaved(""), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Settings</h1>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10 space-y-4">
        <h2 className="text-sm font-medium text-gray-900 dark:text-white">Grade Weights</h2>
        <p className="text-xs text-gray-500">Set the weights for Midterm 1, Midterm 2, and End Semester. The total should be 1.00.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Midterm 1</label>
            <input
              type="number"
              step="0.01"
              value={mid1}
              onChange={(e) => setMid1(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Midterm 2</label>
            <input
              type="number"
              step="0.01"
              value={mid2}
              onChange={(e) => setMid2(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">End Semester</label>
            <input
              type="number"
              step="0.01"
              value={endSem}
              onChange={(e) => setEndSem(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className={`text-xs ${isValid ? "text-green-600" : "text-red-600"}`}>Total: {total.toFixed(2)}</p>
          <div className="flex gap-2">
            <button onClick={normalize} className="px-3 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">Normalize</button>
            <button onClick={save} className="px-3 py-2 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600" disabled={!isValid}>Save</button>
          </div>
        </div>

        {saved && (
          <div className="text-xs text-green-700">{saved}</div>
        )}
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-gray-900 dark:text-white">Student Grades Editor</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Open the editor to modify individual students' subject scores per semester.</p>
          </div>
          <Link to="/admin/student-grades" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600">
            Open Student Grades Editor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
