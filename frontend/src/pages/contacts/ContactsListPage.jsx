/**
 * @file ContactsListPage.jsx
 * @description Contacts list page — fully implemented in Milestones 4-5.
 */
import AppLayout from "../../layouts/AppLayout";

const ContactsListPage = () => (
  <AppLayout>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
      <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", fontSize: "1.5rem" }}>👥</div>
      <h2 style={{ marginBottom: "0.5rem" }}>Contacts</h2>
      <p style={{ color: "var(--color-text-muted)" }}>Full contact management UI coming in Milestone 4</p>
    </div>
  </AppLayout>
);

export default ContactsListPage;
