import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-background selection:bg-primary/30 p-2 sm:p-4 gap-4 overflow-hidden">
      {/* Sidebar as a floating card */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 gap-3 min-w-0 md:pl-0 h-full overflow-hidden">
        <div className="z-40">
           <Topbar />
        </div>
        
        <main className="flex-1 bg-card rounded-2xl border border-border/40 shadow-sm p-4 sm:p-6 animate-in slide-in-from-bottom-4 fade-in duration-500 overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
