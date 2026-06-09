import { useState } from "react";
import { Plus, X, Search, Users } from "lucide-react";
import { Instructor, DEPARTMENTS, getInstructorSalary } from "./types";

interface Props {
  instructors: Instructor[];
  onAdd: (i: Instructor) => void;
  onDelete: (id: number) => void;
}

const emptyForm = (): Instructor => ({
  personName: "", personId: 0, personAddress: "", personPhone: "",
  personEmail: "", personGender: "Male", basicSalary: 0,
  livingExpense: 0, hireDate: "", numberOfCoursesAssigned: 0, department: 1,
});

export function InstructorsView({ instructors, onAdd, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Instructor>(emptyForm());
  const [filterDept, setFilterDept] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  const update = (field: keyof Instructor, val: string | number) =>
    setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm(emptyForm());
    setShowForm(false);
  };

  const filtered = instructors.filter((i) => {
    const matchDept = filterDept === "all" || i.department === filterDept;
    const matchSearch = i.personName.toLowerCase().includes(search.toLowerCase()) ||
      String(i.personId).includes(search);
    return matchDept && matchSearch;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Instructors</h1>
          <p className="text-muted-foreground text-sm mt-1">{instructors.length} total instructors</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Instructor
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">New Instructor</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Salary = basicSalary + livingExpense + (50 × numberOfCoursesAssigned)</p>
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
            <Field label="Department">
              <select className="input-base" value={form.department} onChange={(e) => update("department", Number(e.target.value))}>
                {Object.entries(DEPARTMENTS).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </Field>
            <Field label="Hire Date"><input className="input-base" type="date" value={form.hireDate} onChange={(e) => update("hireDate", e.target.value)} /></Field>
            <Field label="Basic Salary ($)"><input className="input-base" type="number" value={form.basicSalary || ""} onChange={(e) => update("basicSalary", Number(e.target.value))} /></Field>
            <Field label="Living Expense ($)"><input className="input-base" type="number" value={form.livingExpense || ""} onChange={(e) => update("livingExpense", Number(e.target.value))} /></Field>
            <Field label="Courses Assigned"><input className="input-base" type="number" min={0} value={form.numberOfCoursesAssigned || ""} onChange={(e) => update("numberOfCoursesAssigned", Number(e.target.value))} /></Field>
            <div className="col-span-2 flex gap-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">Save Instructor</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input-base pl-9" placeholder="Search by name or ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
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
          <Users size={36} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">No instructors found.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">ID</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Department</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Courses</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Salary</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Hire Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((instr) => (
                <tr key={instr.personId} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{instr.personName}</p>
                      <p className="text-xs text-muted-foreground">{instr.personEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">#{instr.personId}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{DEPARTMENTS[instr.department]}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{instr.numberOfCoursesAssigned}</td>
                  <td className="px-4 py-3 text-foreground font-medium">${getInstructorSalary(instr).toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{instr.hireDate || "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => onDelete(instr.personId)} className="text-muted-foreground hover:text-destructive transition-colors"><X size={15} /></button>
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
