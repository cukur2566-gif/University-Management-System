import { useState } from "react";
import { UserCog, Save, Plus } from "lucide-react";
import { Manager, getManagerSalary } from "./types";

interface Props {
  manager: Manager | null;
  onSave: (m: Manager) => void;
}

const empty: Manager = {
  personName: "", personId: 0, personAddress: "", personPhone: "",
  personEmail: "", personGender: "Male", basicSalary: 0,
  livingExpense: 0, hireDate: "", managerBonus: 0,
};

export function ManagerView({ manager, onSave }: Props) {
  const [editing, setEditing] = useState(!manager);
  const [form, setForm] = useState<Manager>(manager ?? empty);

  const update = (field: keyof Manager, val: string | number) =>
    setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setEditing(false);
  };

  if (!manager && !editing) {
    return (
      <div className="p-8">
        <h1 className="text-foreground mb-6">Manager</h1>
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <UserCog size={40} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No manager assigned yet.</p>
          <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Manager
          </button>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="p-8">
        <h1 className="text-foreground mb-2">{manager ? "Edit Manager" : "Add Manager"}</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Salary = basicSalary + livingExpense + managerBonus
        </p>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 max-w-2xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input className="input-base" value={form.personName} onChange={(e) => update("personName", e.target.value)} required />
            </Field>
            <Field label="Person ID" required>
              <input className="input-base" type="number" value={form.personId || ""} onChange={(e) => update("personId", Number(e.target.value))} required />
            </Field>
            <Field label="Email">
              <input className="input-base" type="email" value={form.personEmail} onChange={(e) => update("personEmail", e.target.value)} />
            </Field>
            <Field label="Phone">
              <input className="input-base" value={form.personPhone} onChange={(e) => update("personPhone", e.target.value)} />
            </Field>
            <Field label="Address">
              <input className="input-base" value={form.personAddress} onChange={(e) => update("personAddress", e.target.value)} />
            </Field>
            <Field label="Gender">
              <select className="input-base" value={form.personGender} onChange={(e) => update("personGender", e.target.value)}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </Field>
            <Field label="Hire Date">
              <input className="input-base" type="date" value={form.hireDate} onChange={(e) => update("hireDate", e.target.value)} />
            </Field>
            <Field label="Basic Salary ($)">
              <input className="input-base" type="number" value={form.basicSalary || ""} onChange={(e) => update("basicSalary", Number(e.target.value))} />
            </Field>
            <Field label="Living Expense ($)">
              <input className="input-base" type="number" value={form.livingExpense || ""} onChange={(e) => update("livingExpense", Number(e.target.value))} />
            </Field>
            <Field label="Bonus ($)">
              <input className="input-base" type="number" value={form.managerBonus || ""} onChange={(e) => update("managerBonus", Number(e.target.value))} />
            </Field>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
              <Save size={15} /> Save
            </button>
            {manager && (
              <button type="button" onClick={() => { setForm(manager); setEditing(false); }} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground">Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Current university manager</p>
        </div>
        <button onClick={() => { setForm(manager!); setEditing(true); }} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
          Edit Manager
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <UserCog size={24} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-lg">{manager!.personName}</p>
            <p className="text-muted-foreground text-sm">ID: #{manager!.personId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["Email", manager!.personEmail],
            ["Phone", manager!.personPhone],
            ["Address", manager!.personAddress],
            ["Gender", manager!.personGender],
            ["Hire Date", manager!.hireDate],
            ["Basic Salary", `$${manager!.basicSalary.toLocaleString()}`],
            ["Living Expense", `$${manager!.livingExpense.toLocaleString()}`],
            ["Bonus", `$${manager!.managerBonus.toLocaleString()}`],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm text-foreground mt-0.5">{val || "—"}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Salary</span>
          <span className="text-lg font-semibold text-foreground">${getManagerSalary(manager!).toLocaleString()}</span>
        </div>
      </div>
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
