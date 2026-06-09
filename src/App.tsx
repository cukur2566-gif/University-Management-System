import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { ManagerView } from "./components/ManagerView";
import { InstructorsView } from "./components/InstructorsView";
import { StudentsView } from "./components/StudentsView";
import { CoursesView } from "./components/CoursesView";
import { Manager, Instructor, Student, Course } from "./components/types";

type View = "dashboard" | "manager" | "instructors" | "students" | "courses";

const seedInstructors: Instructor[] = [
  { personName: "Dr. Sarah Chen", personId: 101, personAddress: "14 Oak Ave", personPhone: "555-0101", personEmail: "s.chen@uni.edu", personGender: "Female", basicSalary: 4000, livingExpense: 800, hireDate: "2019-08-15", numberOfCoursesAssigned: 3, department: 1 },
  { personName: "Prof. James Okafor", personId: 102, personAddress: "22 Maple St", personPhone: "555-0102", personEmail: "j.okafor@uni.edu", personGender: "Male", basicSalary: 3800, livingExpense: 750, hireDate: "2017-01-10", numberOfCoursesAssigned: 2, department: 3 },
  { personName: "Dr. Lena Müller", personId: 103, personAddress: "9 Birch Rd", personPhone: "555-0103", personEmail: "l.muller@uni.edu", personGender: "Female", basicSalary: 4200, livingExpense: 900, hireDate: "2021-09-01", numberOfCoursesAssigned: 4, department: 2 },
];

const seedStudents: Student[] = [
  { personName: "Alice Johnson", personId: 201, personAddress: "5 Elm Ln", personPhone: "555-0201", personEmail: "alice.j@uni.edu", personGender: "Female", numberOfEnrolledCourses: 5, basicSalary: 500, livingExpense: 300, hireDate: "2023-09-01" },
  { personName: "Bob Williams", personId: 202, personAddress: "77 Pine Dr", personPhone: "555-0202", personEmail: "bob.w@uni.edu", personGender: "Male", numberOfEnrolledCourses: 4, basicSalary: 500, livingExpense: 300, hireDate: "2022-09-01" },
  { personName: "Chloe Park", personId: 203, personAddress: "3 Cedar Blvd", personPhone: "555-0203", personEmail: "chloe.p@uni.edu", personGender: "Female", numberOfEnrolledCourses: 6, basicSalary: 600, livingExpense: 350, hireDate: "2024-01-15" },
];

const seedCourses: Course[] = [
  { courseId: 301, courseName: "Data Structures", courseCredits: 3, department: 1, instructorId: 101, studentId: 201 },
  { courseId: 302, courseName: "Structural Analysis", courseCredits: 4, department: 3, instructorId: 102, studentId: 202 },
  { courseId: 303, courseName: "Business Strategy", courseCredits: 3, department: 2, instructorId: 103, studentId: 203 },
  { courseId: 304, courseName: "Algorithms", courseCredits: 3, department: 1, instructorId: 101, studentId: 202 },
];

const seedManager: Manager = {
  personName: "Dr. Richard Hayes", personId: 1, personAddress: "1 University Ave",
  personPhone: "555-0001", personEmail: "r.hayes@uni.edu", personGender: "Male",
  basicSalary: 7000, livingExpense: 1500, hireDate: "2015-03-01", managerBonus: 2000,
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [manager, setManager] = useState<Manager | null>(seedManager);
  const [instructors, setInstructors] = useState<Instructor[]>(seedInstructors);
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [courses, setCourses] = useState<Course[]>(seedCourses);

  const addInstructor = (i: Instructor) => setInstructors((prev) => [...prev, i]);
  const deleteInstructor = (id: number) => setInstructors((prev) => prev.filter((i) => i.personId !== id));

  const addStudent = (s: Student) => setStudents((prev) => [...prev, s]);
  const deleteStudent = (id: number) => setStudents((prev) => prev.filter((s) => s.personId !== id));
  const increaseCourses = (id: number) => setStudents((prev) => prev.map((s) => s.personId === id ? { ...s, numberOfEnrolledCourses: s.numberOfEnrolledCourses + 1 } : s));
  const decreaseCourses = (id: number) => setStudents((prev) => prev.map((s) => s.personId === id && s.numberOfEnrolledCourses > 0 ? { ...s, numberOfEnrolledCourses: s.numberOfEnrolledCourses - 1 } : s));

  const addCourse = (c: Course) => {
    setCourses((prev) => [...prev, c]);
    setStudents((prev) => prev.map((s) => s.personId === c.studentId ? { ...s, numberOfEnrolledCourses: s.numberOfEnrolledCourses + 1 } : s));
    setInstructors((prev) => prev.map((i) => i.personId === c.instructorId ? { ...i, numberOfCoursesAssigned: i.numberOfCoursesAssigned + 1 } : i));
  };

  const deleteCourse = (courseId: number) => {
    const course = courses.find((c) => c.courseId === courseId);
    if (course) {
      setStudents((prev) => prev.map((s) => s.personId === course.studentId && s.numberOfEnrolledCourses > 0 ? { ...s, numberOfEnrolledCourses: s.numberOfEnrolledCourses - 1 } : s));
      setInstructors((prev) => prev.map((i) => i.personId === course.instructorId && i.numberOfCoursesAssigned > 0 ? { ...i, numberOfCoursesAssigned: i.numberOfCoursesAssigned - 1 } : i));
    }
    setCourses((prev) => prev.filter((c) => c.courseId !== courseId));
  };

  const deleteCourseFromStudent = (courseId: number, studentId: number) => {
    setStudents((prev) => prev.map((s) => s.personId === studentId && s.numberOfEnrolledCourses > 0 ? { ...s, numberOfEnrolledCourses: s.numberOfEnrolledCourses - 1 } : s));
    setCourses((prev) => prev.filter((c) => !(c.courseId === courseId && c.studentId === studentId)));
  };

  return (
    /* MARKER-MAKE-KIT-INVOKED */
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar active={view} onNavigate={setView} />
      <main className="flex-1 overflow-y-auto">
        {view === "dashboard" && (
          <DashboardView manager={manager} instructors={instructors} students={students} courses={courses} />
        )}
        {view === "manager" && (
          <ManagerView manager={manager} onSave={setManager} />
        )}
        {view === "instructors" && (
          <InstructorsView instructors={instructors} onAdd={addInstructor} onDelete={deleteInstructor} />
        )}
        {view === "students" && (
          <StudentsView students={students} onAdd={addStudent} onDelete={deleteStudent} onIncreaseCourses={increaseCourses} onDecreaseCourses={decreaseCourses} />
        )}
        {view === "courses" && (
          <CoursesView courses={courses} instructors={instructors} students={students} onAdd={addCourse} onDelete={deleteCourse} onDeleteFromStudent={deleteCourseFromStudent} />
        )}
      </main>
    </div>
  );
}
