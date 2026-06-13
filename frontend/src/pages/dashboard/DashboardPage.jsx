import AppLayout from "../../layouts/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboardStats } from "../../hooks/useContacts";
import { Users, TrendingUp, UserCheck, Activity, ArrowRight, UserMinus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardPage = () => {
  const { user } = useAuth();
  
  const { data, isLoading } = useDashboardStats();
  
  const metrics = data?.metrics || { totalContacts: 0, activeClients: 0, leads: 0, inactive: 0 };
  const recentContacts = data?.recentContacts || [];

  const stats = [
    { name: 'Total Contacts', value: isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : metrics.totalContacts, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Active Clients', value: isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : metrics.activeClients, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Warm Leads', value: isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : metrics.leads, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Inactive', value: isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : metrics.inactive, icon: UserMinus, color: 'text-muted-foreground', bg: 'bg-muted' },
  ];

  // Chart Data preparation
  const pipelineData = [
    { name: "Active", value: metrics.activeClients, fill: "#10b981" },
    { name: "Leads", value: metrics.leads, fill: "#f59e0b" },
    { name: "Inactive", value: metrics.inactive, fill: "#64748b" },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#64748b"];

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-base text-muted-foreground mt-1">Here is what's happening with your network today.</p>
          </div>
          <Link to="/contacts">
            <Button className="rounded-xl shadow-md shadow-primary/20">
              Manage Contacts <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              <dt>
                <div className={`absolute rounded-xl p-2.5 ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                </div>
                <p className="ml-12 lg:ml-14 truncate text-xs sm:text-sm font-medium text-muted-foreground">{item.name}</p>
              </dt>
              <dd className="ml-12 lg:ml-14 flex items-baseline mt-0.5">
                <div className="text-xl sm:text-2xl font-bold text-foreground">{item.value}</div>
              </dd>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 flex-1 min-h-0 pb-2 overflow-y-auto custom-scrollbar pr-1">
          
          {/* Main Chart Area */}
          <div className="xl:col-span-2 rounded-2xl border border-border/40 bg-card shadow-sm p-4 sm:p-6 flex flex-col w-full min-h-[350px] shrink-0">
            <h3 className="text-lg font-bold text-foreground mb-4 shrink-0">Pipeline Analysis</h3>
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 w-full min-h-0">
               
               {/* Bar Chart */}
               <div className="w-full lg:w-2/3 h-full min-h-[220px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                     <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                     <YAxis allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
                     <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
                     <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={48}>
                        {pipelineData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               
               {/* Pie Chart */}
               <div className="w-full lg:w-1/3 h-full min-h-[220px] flex flex-col justify-center items-center bg-muted/20 rounded-2xl p-4 overflow-hidden min-w-[220px]">
                 <div className="flex-1 w-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={pipelineData}
                         cx="50%"
                         cy="50%"
                         innerRadius={40}
                         outerRadius={65}
                         paddingAngle={6}
                         dataKey="value"
                         stroke="none"
                       >
                         {pipelineData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.fill} />
                         ))}
                       </Pie>
                       <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="flex gap-4 mt-2 shrink-0">
                    {pipelineData.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                         <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }}></div>
                         {d.name}
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="rounded-2xl border border-border/40 bg-card shadow-sm p-4 sm:p-6 flex flex-col min-h-[350px] shrink-0">
            <div className="flex items-center justify-between mb-4 shrink-0">
               <h3 className="text-lg font-bold text-foreground">Recently Added</h3>
               <Link to="/contacts" className="text-xs font-semibold text-primary hover:underline">View all</Link>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({length: 4}).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))
                ) : recentContacts.length === 0 ? (
                  <div className="text-center py-6">
                    <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No contacts yet.</p>
                  </div>
                ) : (
                  recentContacts.map(contact => (
                    <div key={contact._id} className="flex items-center justify-between group hover:bg-muted/30 p-2 -mx-2 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{contact.firstName} {contact.lastName}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[140px]">{contact.company || contact.email}</p>
                        </div>
                      </div>
                      <div className="shrink-0 pl-2">
                         {contact.status === 'Lead' ? (
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">Lead</span>
                         ) : contact.status === 'Active' ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Active</span>
                         ) : (
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Inactive</span>
                         )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default DashboardPage;
