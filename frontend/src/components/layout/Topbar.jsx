/**
 * @file Topbar.jsx
 * @description Fixed top navigation bar for authenticated pages.
 *
 * Features:
 * - Dynamic page title based on current route
 * - User avatar + name display
 */

import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Map route paths to human-readable page titles
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/contacts": "Contacts",
  "/contacts/new": "New Contact",
};

const getPageTitle = (pathname) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.endsWith("/edit")) return "Edit Contact";
  if (pathname.match(/^\/contacts\/[^/]+$/)) return "Contact Details";
  return "CRM Hub";
};

const Topbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="topbar">
      {/* ── Page Title ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontSize: "1.0625rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          {pageTitle}
        </h1>
      </div>

      {/* ── Right side: User info ───────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-text-primary)",
              lineHeight: 1.3,
            }}
          >
            {user?.name || "User"}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.3,
            }}
          >
            {user?.email || ""}
          </div>
        </div>

        {/* Avatar */}
        <div
          className="avatar avatar-md"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            cursor: "default",
            userSelect: "none",
          }}
        >
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
