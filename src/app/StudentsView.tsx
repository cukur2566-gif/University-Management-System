import { useState } from "react";
import { Plus, X, Search, GraduationCap, MinusCircle, PlusCircle } from "lucide-react";
import { Student } from "./types";

interface Props {
  students: Student[];
  onAdd: (s: Student) => void;
  onDelete: (id: number) => void;
  onIncreaseCourses: (id: number) => void;
  onDecreaseCourses: (id: number) => void;
}

const emptyForm = (): Student => ({
  personName: "", personId: 0, personAddress: "", personPhone: "",
  personEmail: "", personGender: "Male", numberOfEnrolledCourses: 0,
  basicSalary: 0, livingExpense: 0, hireDate: "",
});

export function StudentsView({ students, onAdd, onDelete, onIncreaseCourses, onDecreaseCourses }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Student>(emptyForm());
  const [search, setSearch] = useState("");

  const update = (field: keyof Student, val: string | number) =>
    setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm(emptyForm());
    setShowForm(false);
  };

  const filtered = students.filter((s) =>
    s.personName.toLowerCase().includes(search.toLowerCase()) || String(s.personId).includes(search)
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Students</h1>
          <p className="text-muted-foreground text-sm mt-1">{students.length} enrolled students</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">New Student</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Field label="Full Name" required><input className="input-base" value={form.personName} onChange={(e) => update("personName", e.target.value)} required /></Field>
            <Field label="Person ID" required><input className="input-base" type="number" value={form.personId || ""} onChange={(e) => update("personId", Number(e.target.value))} required /></Field>
            <Field label="Email"><input className="input-base" type="email" value={form.personEmail} onChange={(e) => update("personEmail", e.target.value)} /></Field>
            <Field label="Phone"><input className="input-base" value={form.personPhone} onChange={(e) => update("personPhone", e.target.value)} /></Field>
            <Field label="Address"><input className="input-base" value={form.personAddress} onChange={(e) => update("personAddress", e.target.value)} /></Field>
            <Field label="Gender">
              <select className="input-base" value={form.personGender} onChange={(e) => update("personGender", e.target.value)}>
                <option>Male</option><option>Female</option>
              </select>
            </Field>
            <Field label="Enrollment Date"><input className="input-base" type="date" value={form.hireDate} onChange={(e) => update("hireDate", e.target.value)} /></Field>
            <Field label="Enrolled Courses"><input className="input-base" type="number" min={0} value={form.numberOfEnrolledCourses || ""} onChange={(e) => update("numberOfEnrolledCourses", Number(e.target.value))} /></Field>
            <Field label="Basic Stipend ($)"><input className="input-base" type="number" value={form.basicSalary || ""} onChange={(e) => update("basicSalary", Number(e.target.value))} /></Field>
            <Field label="Living Allowance ($)"><input className="input-base" type="number" value={form.livingExpense || ""} onChange={(e) => update("livingExpense", Number(e.target.value))} /></Field>
            <div className="col-span-2 flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">Save Student</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input className="input-base pl-9" placeholder="Search by name or ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <GraduationCap size={36} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">No students found.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">ID</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Enrolled Courses</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Stipend</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Enrollment Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.personId} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{student.personName}</p>
                      <p className="text-xs text-muted-foreground">{student.personEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">#{student.personId}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onDecreaseCourses(student.personId)} disabled={student.numberOfEnrolledCourses === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                        <MinusCircle size={16} />
                      </button>
                      <span className="w-6 text-center text-foreground font-medium">{student.numberOfEnrolledCourses}</span>
                      <button onClick={() => onIncreaseCourses(student.personId)} className="text-muted-foreground hover:text-foreground transition-colors">
                        <PlusCircle size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">${(student.basicSalary + student.livingExpense).toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.hireDate || "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => onDelete(student.personId)} className="text-muted-foreground hover:text-destructive transition-colors"><X size={15} /></button>
                  </td>
                </tr>
              ))}
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
