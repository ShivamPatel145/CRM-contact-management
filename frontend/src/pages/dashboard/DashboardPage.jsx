/**
 * @file DashboardPage.jsx
 * @description Dashboard page stub with AppLayout.
 * Full analytics implementation comes in Milestone 6.
 */

import AppLayout from "../../layouts/AppLayout";

const DashboardPage = () => {
  return (
    <AppLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            background: "var(--color-primary-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            fontSize: "1.5rem",
          }}
        >
          📊
        </div>
        <h2 style={{ marginBottom: "0.5rem" }}>Dashboard Analytics</h2>
        <p style={{ color: "var(--color-text-muted)" }}>
          Full analytics coming in Milestone 6
        </p>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
