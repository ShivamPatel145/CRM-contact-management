/**
 * @file Sidebar.jsx
 * @description Left navigation sidebar.
 *
 * Features:
 * - CRM logo/brand mark
 * - Navigation links (Dashboard, Contacts)
 * - Active link highlighting via NavLink
 * - Logout button at bottom
 */

import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Layers,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

const NAV_ITEMS = [
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
    <aside className="sidebar">
      {/* ── Brand ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "1.25rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
        }}
      >
        <div
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "0.5rem",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Layers size={16} color="white" />
        </div>
        <div>
          <div
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: "0.9375rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            CRM Hub
          </div>
          <div style={{ color: "#64748b", fontSize: "0.6875rem", lineHeight: 1 }}>
            Contact Manager
          </div>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: "0.75rem 0.625rem", overflowY: "auto" }}>
        <div
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#334155",
            padding: "0 0.375rem",
            marginBottom: "0.375rem",
          }}
        >
          Menu
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? " active" : ""}`
              }
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* ── User + Logout ───────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "0.75rem 0.625rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.5rem 0.625rem",
            marginBottom: "0.25rem",
          }}
        >
          <div
            className="avatar avatar-sm"
            style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                color: "#e2e8f0",
                fontSize: "0.8125rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name || "User"}
            </div>
            <div
              style={{
                color: "#475569",
                fontSize: "0.6875rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || ""}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="sidebar-nav-item"
          style={{ color: "#ef4444" }}
          id="sidebar-logout-btn"
        >
          <LogOut size={17} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
