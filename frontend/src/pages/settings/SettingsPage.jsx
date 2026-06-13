import AppLayout from "../../layouts/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user } = useAuth();

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save
    toast.success("Settings saved successfully!");
  };

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto custom-scrollbar pr-2 pb-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="text-base text-muted-foreground mt-1">Manage your account preferences and security.</p>
          </div>

          <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-border/40 px-6 py-5 bg-muted/20">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Profile Information
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar Placeholder */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-3xl">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <Button variant="outline" size="sm" type="button" className="text-xs">
                      Change Avatar
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.name} className="border-border/60" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="email" defaultValue={user?.email} disabled className="pl-9 bg-muted/50 border-border/60 text-muted-foreground cursor-not-allowed" />
                        </div>
                        <p className="text-[10px] text-muted-foreground">Email address cannot be changed.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Organization</Label>
                      <Input id="company" placeholder="E.g. Acme Corp" className="border-border/60" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex justify-end">
                   <Button type="submit" className="rounded-xl px-6">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-border/40 px-6 py-5 bg-muted/20 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Security
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="currentPass">Current Password</Label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="currentPass" type="password" placeholder="••••••••" className="pl-9 border-border/60" />
                   </div>
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="newPass">New Password</Label>
                   <Input id="newPass" type="password" placeholder="••••••••" className="border-border/60" />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="confirmPass">Confirm Password</Label>
                   <Input id="confirmPass" type="password" placeholder="••••••••" className="border-border/60" />
                 </div>
              </div>
              
              <div className="pt-4 border-t border-border/40 flex justify-end">
                   <Button variant="outline" type="button" onClick={() => toast.success("Password updated!")} className="rounded-xl px-6">Update Password</Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
