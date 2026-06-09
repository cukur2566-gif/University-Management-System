import { GraduationCap, Users, BookOpen, LayoutDashboard, UserCog, ChevronRight } from "lucide-react";

type View = "dashboard" | "manager" | "instructors" | "students" | "courses";

interface SidebarProps {
  active: View;
  onNavigate: (v: View) => void;
}

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "manager", label: "Manager", icon: <UserCog size={18} /> },
  { id: "instructors", label: "Instructors", icon: <Users size={18} /> },
  { id: "students", label: "Students", icon: <GraduationCap size={18} /> },
  { id: "courses", label: "Courses", icon: <BookOpen size={18} /> },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="w-60 min-h-screen bg-primary text-primary-foreground flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">UniManage</p>
            <p className="text-xs text-white/50 leading-tight">University System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-white/20 text-white font-medium"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight size={14} className="opacity-60" />}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10 text-xs text-white/40">
        University Management System v1.0
      </div>
    </aside>
  );
}
