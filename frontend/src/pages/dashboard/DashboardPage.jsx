import AppLayout from "../../layouts/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { useContacts } from "../../hooks/useContacts";
import { Users, TrendingUp, UserCheck, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Fetch contacts to generate dashboard stats
  const { data, isLoading } = useContacts({ page: 1, limit: 100 }); // fetch up to 100 to get stats easily
  
  const contacts = data?.data || [];
  
  const totalContacts = data?.pagination?.total || 0;
  const activeContacts = contacts.filter(c => c.status === "Active").length;
  const leadContacts = contacts.filter(c => c.status === "Lead").length;

  const recentContacts = [...contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const stats = [
    { name: 'Total Contacts', value: isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : totalContacts, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Active Clients', value: isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : activeContacts, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Warm Leads', value: isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : leadContacts, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Engagement Rate', value: '78%', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

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
            <div key={idx} className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <dt>
                <div className={`absolute rounded-xl p-3 ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-muted-foreground">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline mt-1">
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
              </dd>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Main Chart Area (Placeholder for now) */}
          <div className="lg:col-span-2 rounded-2xl border border-border/40 bg-card shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-foreground mb-4">Pipeline Growth</h3>
            <div className="flex-1 rounded-xl bg-muted/30 border border-dashed border-border/60 flex items-center justify-center min-h-[300px]">
               <div className="text-center">
                 <Activity className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                 <p className="text-muted-foreground font-medium text-sm">Analytics Chart Integration</p>
                 <p className="text-xs text-muted-foreground/60 mt-1">Coming in Milestone 6</p>
               </div>
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="rounded-2xl border border-border/40 bg-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-foreground">Recently Added</h3>
               <Link to="/contacts" className="text-xs font-semibold text-primary hover:underline">View all</Link>
            </div>
            
            <div className="space-y-5">
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
                  <div key={contact._id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{contact.firstName} {contact.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{contact.company || contact.email}</p>
                      </div>
                    </div>
                    <div>
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
    </AppLayout>
  );
};

export default DashboardPage;
