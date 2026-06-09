import { useState } from "react";
import { Plus, X, Search, BookOpen } from "lucide-react";
import { Course, Instructor, Student, DEPARTMENTS } from "./types";

interface Props {
  courses: Course[];
  instructors: Instructor[];
  students: Student[];
  onAdd: (c: Course) => void;
  onDelete: (courseId: number) => void;
  onDeleteFromStudent: (courseId: number, studentId: number) => void;
}

const emptyForm = (): Omit<Course, "instructorId" | "studentId"> & { instructorId: number | ""; studentId: number | "" } => ({
  courseId: 0, courseName: "", courseCredits: 3, department: 1,
  instructorId: "", studentId: "",
});

export function CoursesView({ courses, instructors, students, onAdd, onDelete, onDeleteFromStudent }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<number | "all">("all");

  const update = (field: keyof typeof form, val: string | number) =>
    setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.instructorId === "" || form.studentId === "") return;
    onAdd({ ...form, instructorId: Number(form.instructorId), studentId: Number(form.studentId) });
    setForm(emptyForm());
    setShowForm(false);
  };

  const filtered = courses.filter((c) => {
    const matchDept = filterDept === "all" || c.department === filterDept;
    const matchSearch = c.courseName.toLowerCase().includes(search.toLowerCase()) || String(c.courseId).includes(search);
    return matchDept && matchSearch;
  });

  const getInstructor = (id: number) => instructors.find((i) => i.personId === id);
  const getStudent = (id: number) => students.find((s) => s.personId === id);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">{courses.length} total courses</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Course
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">New Course</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Field label="Course Name" required><input className="input-base" value={form.courseName} onChange={(e) => update("courseName", e.target.value)} required /></Field>
            <Field label="Course ID" required><input className="input-base" type="number" value={form.courseId || ""} onChange={(e) => update("courseId", Number(e.target.value))} required /></Field>
            <Field label="Credits">
              <input className="input-base" type="number" min={1} max={6} value={form.courseCredits || ""} onChange={(e) => update("courseCredits", Number(e.target.value))} />
            </Field>
            <Field label="Department">
              <select className="input-base" value={form.department} onChange={(e) => update("department", Number(e.target.value))}>
                {Object.entries(DEPARTMENTS).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </Field>
            <Field label="Instructor" required>
              <select className="input-base" value={form.instructorId} onChange={(e) => update("instructorId", e.target.value)} required>
                <option value="">Select instructor…</option>
                {instructors.map((i) => (
                  <option key={i.personId} value={i.personId}>{i.personName}</option>
                ))}
              </select>
            </Field>
            <Field label="Student" required>
              <select className="input-base" value={form.studentId} onChange={(e) => update("studentId", e.target.value)} required>
                <option value="">Select student…</option>
                {students.map((s) => (
                  <option key={s.personId} value={s.personId}>{s.personName}</option>
                ))}
              </select>
            </Field>
            <div className="col-span-2 flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">Save Course</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input-base pl-9" placeholder="Search courses…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-base w-48" value={filterDept} onChange={(e) => setFilterDept(e.target.value === "all" ? "all" : Number(e.target.value))}>
          <option value="all">All Departments</option>
          {Object.entries(DEPARTMENTS).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <BookOpen size={36} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">No courses found.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Course</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">ID</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Department</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Credits</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Instructor</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Student</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => {
                const instr = getInstructor(course.instructorId);
                const student = getStudent(course.studentId);
                return (
                  <tr key={`${course.courseId}-${course.studentId}`} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{course.courseName}</td>
                    <td className="px-4 py-3 text-muted-foreground">#{course.courseId}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{DEPARTMENTS[course.department]}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{course.courseCredits} cr.</td>
                    <td className="px-4 py-3 text-foreground">{instr?.personName ?? <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-3 text-foreground">{student?.personName ?? <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDeleteFromStudent(course.courseId, course.studentId)}
                          title="Remove from student"
                          className="text-muted-foreground hover:text-destructive transition-colors text-xs border border-border rounded px-1.5 py-0.5"
                        >
                          Remove from student
                        </button>
                        <button onClick={() => onDelete(course.courseId)} className="text-muted-foreground hover:text-destructive transition-colors"><X size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-1">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
