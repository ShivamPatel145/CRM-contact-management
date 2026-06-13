import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Layers,
  Settings,
  MessageSquare,
  Box,
  ShoppingCart
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Contacts",
    to: "/contacts",
    icon: Users,
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: Box,
    isPlaceholder: true,
  },
  {
    label: "Messages",
    to: "/messages",
    icon: MessageSquare,
    isPlaceholder: true,
  },
  {
    label: "Tasks",
    to: "/tasks",
    icon: ShoppingCart,
    isPlaceholder: true,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-[260px] bg-card rounded-2xl border border-border/40 shadow-sm shrink-0 sticky top-4 h-[calc(100vh-2rem)] overflow-hidden">
      {/* ── Brand ──────────────────────────────────────────────────────────── */}
      <div className="flex h-16 items-center px-6 gap-3 mb-2 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2f3035] shadow-sm">
          <Layers size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[16px] text-foreground leading-tight tracking-tight">CRM Hub</span>
          <span className="text-[11px] text-muted-foreground font-medium">Workspace</span>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 custom-scrollbar">
        <div className="px-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Main Menu
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(e) => {
                if (item.isPlaceholder) {
                  e.preventDefault();
                  toast.info(`${item.label} module is coming in the next update!`);
                }
              }}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] font-semibold transition-all duration-200 relative overflow-hidden ${
                  isActive && !item.isPlaceholder
                    ? "bg-gradient-to-r from-[#f3a886] to-[#fadccf] text-slate-900 shadow-sm dark:from-[#c8612f] dark:to-[#8c401b] dark:text-white"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left accent bar for active item - removed as per user request */}
                  <Icon size={18} className={isActive && !item.isPlaceholder ? "text-[#b24f21] dark:text-white/90" : "text-muted-foreground group-hover:text-foreground transition-colors"} />
                  {item.label}
                  {item.isPlaceholder && (
                     <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-sm">Soon</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── User + Logout ───────────────────────────────────────────────────── */}
      <div className="p-4 mt-auto">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-accent border border-border/30">
          <Avatar className="h-9 w-9 shadow-sm">
            <AvatarFallback className="bg-primary text-white font-medium">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-foreground truncate">
              {user?.name || "User"}
            </span>
            <span className="text-[11px] text-muted-foreground truncate font-medium">
              {user?.email || ""}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl font-medium transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
