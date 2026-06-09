export const DEPARTMENTS: Record<number, string> = {
  1: "Computer Science",
  2: "Business",
  3: "Engineering",
};

export interface Manager {
  personName: string;
  personId: number;
  personAddress: string;
  personPhone: string;
  personEmail: string;
  personGender: string;
  basicSalary: number;
  livingExpense: number;
  hireDate: string;
  managerBonus: number;
}

export interface Instructor {
  personName: string;
  personId: number;
  personAddress: string;
  personPhone: string;
  personEmail: string;
  personGender: string;
  basicSalary: number;
  livingExpense: number;
  hireDate: string;
  numberOfCoursesAssigned: number;
  department: number;
}

export interface Student {
  personName: string;
  personId: number;
  personAddress: string;
  personPhone: string;
  personEmail: string;
  personGender: string;
  numberOfEnrolledCourses: number;
  basicSalary: number;
  livingExpense: number;
  hireDate: string;
}

export interface Course {
  courseId: number;
  courseName: string;
  courseCredits: number;
  department: number;
  instructorId: number;
  studentId: number;
}

export function getManagerSalary(m: Manager): number {
  return m.basicSalary + m.livingExpense + m.managerBonus;
}

export function getInstructorSalary(i: Instructor): number {
  return i.basicSalary + i.livingExpense + 50 * i.numberOfCoursesAssigned;
}

export function getStudentSalary(s: Student): number {
  return s.basicSalary + s.livingExpense;
}
