import AppLayout from "../../layouts/AppLayout";
import { Users } from "lucide-react";

const ContactsListPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center w-full">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-5">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Contacts</h2>
        <p className="text-muted-foreground max-w-[500px]">
          Full contact management UI coming in Milestone 4.
        </p>
      </div>
    </AppLayout>
  );
};

export default ContactsListPage;
