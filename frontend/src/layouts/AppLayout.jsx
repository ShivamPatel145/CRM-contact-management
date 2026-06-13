/**
 * @file AppLayout.jsx
 * @description Authenticated page layout shell.
 *
 * Renders: Sidebar (fixed left) + Topbar (fixed top) + main content area.
 * All protected pages wrap their content in this layout.
 *
 * Usage:
 *   <AppLayout>
 *     <YourPageContent />
 *   </AppLayout>
 */

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
