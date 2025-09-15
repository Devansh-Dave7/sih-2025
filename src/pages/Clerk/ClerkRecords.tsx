import React, { useMemo, useState } from "react";

interface StudentRow {
  id: string;
  name: string;
  email: string;
  program: string;
  semester: number;
  status: "Active" | "Alumni" | "On Leave";
}

const MOCK_STUDENTS: StudentRow[] = [
  { id: "S1001", name: "John Doe", email: "john@example.com", program: "B.Tech CSE", semester: 3, status: "Active" },
  { id: "S1002", name: "Aisha Khan", email: "aisha@example.com", program: "B.Tech EEE", semester: 5, status: "Active" },
  { id: "S1003", name: "Ravi Patel", email: "ravi@example.com", program: "B.Tech ME", semester: 8, status: "Alumni" },
  { id: "S1004", name: "Sara Lee", email: "sara@example.com", program: "B.Tech CSE", semester: 1, status: "On Leave" },
];

const ClerkRecords: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [status, setStatus] = useState<string>("All");
  const [program, setProgram] = useState<string>("All");

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const q = query.toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchStatus = status === "All" || s.status === (status as any);
      const matchProg = program === "All" || s.program === program;
      return matchQ && matchStatus && matchProg;
    });
  }, [query, status, program]);

  const programs = ["All", ...Array.from(new Set(MOCK_STUDENTS.map((s) => s.program)))];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Clerk Records</h1>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-white/10">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            placeholder="Search by name, ID, or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
          >
            {(["All", "Active", "Alumni", "On Leave"] as const).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white p-2 text-sm dark:bg-gray-800 dark:text-white"
          >
            {programs.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-gray-100 bg-white dark:bg-gray-900 dark:ring-white/10">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Program</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Semester</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{s.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{s.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{s.email}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{s.program}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{s.semester}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{s.status}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClerkRecords;
