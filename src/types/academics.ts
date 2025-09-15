export interface AssessmentBreakdown {
  midterms: number[]; // e.g., [MT1, MT2]
  endSem: number; // final exam score
}

export interface SubjectGrade {
  code: string; // e.g., CS101
  name: string; // e.g., Data Structures
  credits: number; // e.g., 4
  assessments: AssessmentBreakdown;
  totalScore?: number; // computed via weights
  gradePoints?: number; // computed 0-10 scale
}

export interface SemesterGrades {
  semesterNumber: number; // 1-8
  subjects: SubjectGrade[];
  semesterGPA?: number; // computed 0-10
}

export interface StudentGradesRecord {
  userId: string;
  semesters: SemesterGrades[];
  cgpa?: number; // computed across semesters (weighted by credits)
}

export interface GradeConfig {
  midtermWeights: number[]; // e.g., [0.2, 0.2]
  endSemWeight: number; // e.g., 0.6
  // mapping score (0-100) -> grade points (0-10). We’ll use a simple formula by default.
}
