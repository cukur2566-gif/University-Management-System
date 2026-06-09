import { Users, GraduationCap, BookOpen, UserCog, TrendingUp, Building2 } from "lucide-react";
import { Manager, Instructor, Student, Course, DEPARTMENTS, getManagerSalary, getInstructorSalary } from "./types";

interface Props {
  manager: Manager | null;
  instructors: Instructor[];
  students: Student[];
  courses: Course[];
}

export function DashboardView({ manager, instructors, students, courses }: Props) {
  const totalInstructorSalary = instructors.reduce((sum, i) => sum + getInstructorSalary(i), 0);
  const avgInstructorSalary = instructors.length ? totalInstructorSalary / instructors.length : 0;

  const deptCounts = instructors.reduce<Record<number, number>>((acc, i) => {
    acc[i.department] = (acc[i.department] ?? 0) + 1;
    return acc;
  }, {});

  const courseDeptCounts = courses.reduce<Record<number, number>>((acc, c) => {
    acc[c.department] = (acc[c.department] ?? 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: "Total Instructors", value: instructors.length, icon: <Users size={20} />, color: "bg-blue-50 text-blue-600" },
    { label: "Total Students", value: students.length, icon: <GraduationCap size={20} />, color: "bg-green-50 text-green-600" },
    { label: "Total Courses", value: courses.length, icon: <BookOpen size={20} />, color: "bg-purple-50 text-purple-600" },
    { label: "Manager Set", value: manager ? "Yes" : "No", icon: <UserCog size={20} />, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of university management system</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-semibold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {manager && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCog size={16} className="text-muted-foreground" />
              <h3 className="text-foreground">Manager Info</h3>
            </div>
            <div className="space-y-2">
              <InfoRow label="Name" value={manager.personName} />
              <InfoRow label="ID" value={`#${manager.personId}`} />
              <InfoRow label="Email" value={manager.personEmail} />
              <InfoRow label="Hire Date" value={manager.hireDate} />
              <InfoRow label="Total Salary" value={`$${getManagerSalary(manager).toLocaleString()}`} />
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-muted-foreground" />
            <h3 className="text-foreground">Departments</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(DEPARTMENTS).map(([code, name]) => {
              const instrCount = deptCounts[Number(code)] ?? 0;
              const courseCount = courseDeptCounts[Number(code)] ?? 0;
              return (
                <div key={code} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{name}</span>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{instrCount} instructors</span>
                    <span>{courseCount} courses</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-muted-foreground" />
            <h3 className="text-foreground">Salary Overview</h3>
          </div>
          <div className="space-y-2">
            {manager && <InfoRow label="Manager Salary" value={`$${getManagerSalary(manager).toLocaleString()}`} />}
            <InfoRow label="Total Instructor Payroll" value={`$${totalInstructorSalary.toLocaleString()}`} />
            <InfoRow label="Avg Instructor Salary" value={`$${avgInstructorSalary.toFixed(0)}`} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={16} className="text-muted-foreground" />
            <h3 className="text-foreground">Student Enrollment</h3>
          </div>
          <div className="space-y-2">
            <InfoRow label="Total Students" value={students.length} />
            <InfoRow label="Total Enrolled Courses" value={students.reduce((s, st) => s + st.numberOfEnrolledCourses, 0)} />
            <InfoRow label="Avg Courses/Student" value={students.length ? (students.reduce((s, st) => s + st.numberOfEnrolledCourses, 0) / students.length).toFixed(1) : "0"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
