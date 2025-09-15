import { GradeConfig, SemesterGrades, StudentGradesRecord, SubjectGrade } from "../types/academics";
import { User } from "../types/auth";

const GRADES_KEY = (userId: string) => `grades:${userId}`;
const GRADE_CONFIG_KEY = `grades:config`;

export const defaultGradeConfig: GradeConfig = {
  midtermWeights: [0.2, 0.2],
  endSemWeight: 0.6,
};

export function getGradeConfig(): GradeConfig {
  try {
    const raw = localStorage.getItem(GRADE_CONFIG_KEY);
    if (!raw) return defaultGradeConfig;
    const parsed = JSON.parse(raw) as GradeConfig;
    return parsed;
  } catch {
    return defaultGradeConfig;
  }
}

export function saveGradeConfig(cfg: GradeConfig) {
  localStorage.setItem(GRADE_CONFIG_KEY, JSON.stringify(cfg));
}

export function seedIfMissing(user: User) {
  const key = GRADES_KEY(user.id);
  if (localStorage.getItem(key)) return; // already seeded

  // Basic mock dataset for semesters 1 and 2
  const record: StudentGradesRecord = {
    userId: user.id,
    semesters: [
      makeSemester(1, [
        { code: "MA101", name: "Calculus", credits: 4, assessments: { midterms: [72, 78], endSem: 81 } },
        { code: "PH101", name: "Physics", credits: 3, assessments: { midterms: [68, 74], endSem: 79 } },
        { code: "CS101", name: "Programming", credits: 4, assessments: { midterms: [85, 90], endSem: 88 } },
      ]),
      makeSemester(2, [
        { code: "EE102", name: "Basic Electrical", credits: 3, assessments: { midterms: [70, 73], endSem: 80 } },
        { code: "HS102", name: "English", credits: 2, assessments: { midterms: [88, 84], endSem: 86 } },
        { code: "CS102", name: "Data Structures", credits: 4, assessments: { midterms: [79, 82], endSem: 85 } },
      ]),
    ],
  };

  const computed = computeAll(record);
  localStorage.setItem(key, JSON.stringify(computed));
}

export function getGrades(userId: string): StudentGradesRecord | null {
  const raw = localStorage.getItem(GRADES_KEY(userId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentGradesRecord;
  } catch {
    return null;
  }
}

export function saveGrades(userId: string, record: StudentGradesRecord) {
  const computed = computeAll(record);
  localStorage.setItem(GRADES_KEY(userId), JSON.stringify(computed));
}

// --- Computation helpers ---
export function computeAll(record: StudentGradesRecord): StudentGradesRecord {
  const cfg = getGradeConfig();
  const semesters = record.semesters.map((s) => computeSemester(s, cfg));
  const cgpa = computeCGPA(semesters);
  return { ...record, semesters, cgpa };
}

export function computeSemester(semester: SemesterGrades, cfg: GradeConfig): SemesterGrades {
  const subjects = semester.subjects.map((subj) => computeSubject(subj, cfg));
  const totalCredits = subjects.reduce((acc, s) => acc + s.credits, 0) || 1;
  const weighted = subjects.reduce((acc, s) => acc + (s.gradePoints || 0) * s.credits, 0);
  const semesterGPA = parseFloat((weighted / totalCredits).toFixed(2));
  return { ...semester, subjects, semesterGPA };
}

export function computeSubject(subj: SubjectGrade, cfg: GradeConfig): SubjectGrade {
  const { assessments } = subj;
  const midtermWeights = cfg.midtermWeights;
  const endSemWeight = cfg.endSemWeight;
  const totalWeight = [...midtermWeights, endSemWeight].reduce((a, b) => a + b, 0);

  // normalize if not exactly 1
  const normMid = midtermWeights.map((w) => w / totalWeight);
  const normEnd = endSemWeight / totalWeight;

  const midterms = assessments.midterms || [];
  const midScore = midterms.reduce((acc, m, idx) => acc + m * (normMid[idx] || 0), 0);
  const endScore = (assessments.endSem || 0) * normEnd;

  const totalScore = parseFloat((midScore + endScore).toFixed(2)); // 0-100 scaled by weights
  const gradePoints = scoreToGP(totalScore);

  return { ...subj, totalScore, gradePoints };
}

export function scoreToGP(score: number): number {
  // Simple mapping: linear 0-100 to 0-10, with floor and cap
  const gp = Math.max(0, Math.min(10, (score / 100) * 10));
  return parseFloat(gp.toFixed(2));
}

export function computeCGPA(semesters: SemesterGrades[]): number {
  const totalCredits = semesters.reduce(
    (acc, sem) => acc + sem.subjects.reduce((a, s) => a + s.credits, 0),
    0
  ) || 1;
  const weighted = semesters.reduce(
    (acc, sem) => acc + sem.subjects.reduce((a, s) => a + (s.gradePoints || 0) * s.credits, 0),
    0
  );
  return parseFloat((weighted / totalCredits).toFixed(2));
}

// Helper to construct a semester object
function makeSemester(semesterNumber: number, subjects: Omit<SubjectGrade, "totalScore" | "gradePoints">[]): SemesterGrades {
  return {
    semesterNumber,
    subjects: subjects as SubjectGrade[],
  };
}
