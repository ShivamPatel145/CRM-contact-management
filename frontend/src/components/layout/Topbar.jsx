import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, LogOut, Layers, Search, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { NAV_ITEMS } from "./Sidebar";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Topbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 bg-card rounded-2xl border border-border/40 shadow-sm px-4 sm:px-6 mb-4">
      {/* Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:bg-secondary rounded-xl">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 border-r-border/40">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Access CRM pages</SheetDescription>
            <div className="flex h-16 items-center px-6 gap-3 mb-2 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2f3035] shadow-sm">
                <Layers size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[16px] text-foreground leading-tight tracking-tight">CRM Hub</span>
                <span className="text-[11px] text-muted-foreground font-medium">Workspace</span>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
              <div className="px-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Main Menu
              </div>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-secondary text-foreground shadow-sm"
                          : "text-foreground hover:bg-accent"
                      }`
                    }
                  >
                    <Icon size={18} className={location.pathname === item.to ? "text-primary" : "text-muted-foreground"} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Breadcrumbs for Professional Look */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground font-medium pl-4">
           <span>CRM Hub</span>
           <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
           <span className="text-foreground capitalize">{location.pathname.substring(1) || "Dashboard"}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border/60 bg-background text-foreground hover:bg-accent relative">
              <Bell className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-lg border-border/40 p-4 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium text-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground mt-1">You have no new notifications.</p>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#f3a886] ring-offset-2 ring-offset-background transition-transform hover:scale-105 active:scale-95 ml-1">
            <Avatar className="h-10 w-10 border border-border/40 shadow-sm">
              <AvatarFallback className="bg-[#f3a886] text-slate-900 font-semibold dark:bg-[#d68560] dark:text-slate-900">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2 rounded-xl shadow-xl border-border/40" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{user?.name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="p-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg m-1 transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
