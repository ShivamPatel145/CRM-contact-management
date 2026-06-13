import AppLayout from "../../layouts/AppLayout";
import { LayoutDashboard } from "lucide-react";

const DashboardPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center w-full">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-5">
          <LayoutDashboard className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Dashboard Analytics</h2>
        <p className="text-muted-foreground max-w-[500px]">
          Full analytics coming in Milestone 6. The UI has been overhauled with shadcn/ui.
        </p>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
