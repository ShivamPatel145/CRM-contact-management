import { Link } from "react-router-dom";
import { ArrowRight, Layers, Users, Zap, Search, ShieldCheck, Mail, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../../components/theme-toggle";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      
      {/* ── Navigation ── */}
      <header className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">Veselty</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="rounded-full px-5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold text-sm transition-colors">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-flex">
                  Sign In
                </Link>
                <Link to="/register">
                  <Button className="rounded-full px-5 h-9 bg-foreground hover:bg-foreground/90 text-background shadow-sm font-semibold text-sm transition-colors">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        
        {/* ── Section 1: The Hook (Hero) ── */}
        <section className="relative w-full px-6 pt-24 pb-32 sm:pt-32 sm:pb-40 flex flex-col items-center justify-center text-center">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
               Stop losing deals to <br/>
               <span className="text-primary italic">messy spreadsheets.</span>
             </h1>
             <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium mb-10">
               Your contacts are your most valuable asset. Stop tracking them in scattered notes and bloated software. Take back control with clarity.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
               {isAuthenticated ? (
                 <Link to="/dashboard">
                   <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full text-base font-semibold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                     Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                   </Button>
                 </Link>
               ) : (
                 <Link to="/register">
                   <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full text-base font-semibold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                     Start reclaiming your pipeline <ArrowRight className="ml-2 h-5 w-5" />
                   </Button>
                 </Link>
               )}
             </div>
          </div>
        </section>

        {/* ── Section 2: The Problem -> Solution Narrative (Split View) ── */}
        <section className="w-full py-24 sm:py-32 bg-muted/30 border-y border-border/40 relative">
           <div className="container mx-auto px-6 max-w-6xl">
             
             {/* Part 1: The Chaos */}
             <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
               <div className="lg:w-1/2 order-2 lg:order-1">
                 <div className="relative w-full aspect-square max-w-md mx-auto">
                    {/* Abstract illustration of chaos */}
                    <div className="absolute inset-0 bg-background border border-border/40 rounded-3xl shadow-xl p-6 flex flex-col justify-between overflow-hidden rotate-[-3deg]">
                       {/* Header Row */}
                        <div className="flex gap-2 border-b border-border/60 pb-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          <span className="w-1/3">Name</span>
                          <span className="w-1/3">Phone / Note</span>
                          <span className="w-1/3 text-right">Status</span>
                        </div>
                        {/* Chaotic rows */}
                        <div className="flex-1 flex flex-col gap-3.5 mt-3 text-xs">
                          {/* Row 1: Broken data */}
                          <div className="flex gap-2 items-center opacity-85">
                            <span className="w-1/3 font-semibold text-foreground truncate">John R?</span>
                            <span className="w-1/3 text-destructive font-medium line-through decoration-destructive/60 truncate">Lost number...</span>
                            <span className="w-1/3 text-right"><span className="inline-block px-2 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-bold">LOST DEAL</span></span>
                          </div>
                          {/* Row 2: Messy note */}
                          <div className="flex gap-2 items-center opacity-70">
                            <span className="w-1/3 font-semibold text-foreground truncate">Pamela L.</span>
                            <span className="w-1/3 text-muted-foreground truncate">Draft email somewhere</span>
                            <span className="w-1/3 text-right"><span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold">WARM?</span></span>
                          </div>
                          {/* Row 3: Missing info */}
                          <div className="flex gap-2 items-center opacity-50">
                            <span className="w-1/3 font-semibold text-foreground truncate">Nicholas K</span>
                            <span className="w-1/3 text-destructive font-bold truncate">⚠️ NO EMAIL!</span>
                            <span className="w-1/3 text-right"><span className="inline-block px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">UNRESPONSIVE</span></span>
                          </div>
                          {/* Row 4: Duplicate row */}
                          <div className="flex gap-2 items-center opacity-30">
                            <span className="w-1/3 font-semibold text-foreground truncate">John R?</span>
                            <span className="w-1/3 text-muted-foreground truncate">Same person?</span>
                            <span className="w-1/3 text-right"><span className="inline-block px-2 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-bold">DUPLICATE</span></span>
                          </div>
                        </div>
                        {/* overlay search badge */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/90 border border-border/80 rounded-2xl p-4 shadow-2xl flex flex-col items-center gap-2 max-w-[180px] text-center backdrop-blur-md">
                          <Search className="h-8 w-8 text-destructive animate-bounce" />
                          <span className="text-xs font-semibold text-foreground">"Where is John's number?"</span>
                          <span className="text-[10px] text-muted-foreground">Search returned 0 results</span>
                        </div>

                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-destructive/10 blur-2xl rounded-full"></div>
                 </div>
               </div>
               <div className="lg:w-1/2 order-1 lg:order-2">
                 <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
                   You're dropping the ball.
                 </h2>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                   When your network grows, remembering who is who becomes impossible. Important leads slip through the cracks because they got buried in your inbox, and valuable relationships decay because you forgot to follow up.
                 </p>
               </div>
             </div>

             {/* Part 2: The Clarity */}
             <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/2">
                 <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
                   Meet your new <span className="text-primary">control center.</span>
                 </h2>
                 <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                   Veselty provides a single, lightning-fast dashboard where every contact is instantly searchable. See exactly who is a warm lead, an active client, or an inactive connection in milliseconds.
                 </p>
                 <ul className="space-y-4">
                   {[
                     { text: "Instantly search across thousands of contacts", icon: Search },
                     { text: "Color-coded pipeline statuses", icon: Zap },
                     { text: "Secure, isolated enterprise databases", icon: Database }
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-4 text-foreground font-medium">
                       <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                         <item.icon className="h-5 w-5 text-primary" />
                       </div>
                       {item.text}
                     </li>
                   ))}
                 </ul>
               </div>
               <div className="lg:w-1/2">
                 <div className="relative w-full aspect-square max-w-md mx-auto">
                    {/* Abstract illustration of clarity */}
                    <div className="absolute inset-0 bg-background border border-border/40 rounded-3xl shadow-xl p-6 flex flex-col justify-between overflow-hidden rotate-[3deg]">
                       <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                         <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-500 text-xs shrink-0">JR</div>
                         <div className="flex-1">
                           <div className="text-sm font-semibold text-foreground truncate">John Richardson</div>
                           <div className="text-xs text-muted-foreground truncate">john.richardson@example.com</div>
                         </div>
                         <div className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">Active</div>
                       </div>
                       <div className="flex items-center gap-4 border-b border-border/40 pb-4 opacity-70">
                         <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center font-bold text-amber-500 text-xs shrink-0">PL</div>
                         <div className="flex-1">
                           <div className="text-sm font-semibold text-foreground truncate">Pamela Lewis</div>
                           <div className="text-xs text-muted-foreground truncate">pamela.l@company.com</div>
                         </div>
                         <div className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">Lead</div>
                       </div>
                       <div className="flex items-center gap-4 border-b border-border/40 pb-4 opacity-40">
                         <div className="h-10 w-10 rounded-full bg-slate-500/10 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">NK</div>
                         <div className="flex-1">
                           <div className="text-sm font-semibold text-foreground truncate">Nicholas Kim</div>
                           <div className="text-xs text-muted-foreground truncate">n.kim@stark.com</div>
                         </div>
                         <div className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20 shrink-0">Inactive</div>
                       </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 blur-2xl rounded-full -z-10"></div>
                 </div>
               </div>
             </div>

           </div>
        </section>

        {/* ── Section 3: The Proof ── */}
        <section className="w-full py-24 sm:py-32 bg-background border-b border-border/40 text-center px-6">
           <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-16">
             Professionals are closing more deals with Veselty.
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { stat: "3x", label: "Faster follow-ups" },
                { stat: "0", label: "Lost leads" },
                { stat: "100%", label: "Data ownership" }
              ].map((metric, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-5xl font-extrabold text-primary mb-2">{metric.stat}</span>
                  <span className="text-lg text-muted-foreground font-medium">{metric.label}</span>
                </div>
              ))}
           </div>
        </section>

        {/* ── Section 4: The Climax (Dark CTA) ── */}
        <section className="w-full py-24 sm:py-32 bg-background px-6">
           <div className="w-full max-w-5xl mx-auto rounded-[3rem] p-12 sm:p-20 relative overflow-hidden bg-[#1e293b]">
              {/* Complex Dark Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
              
              <div className="relative z-10 text-center">
                 <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-6" />
                 <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                   Ready for clarity?
                 </h2>
                 <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-medium">
                   Stop letting your network decay. Create your free account today and experience the fastest way to manage your contacts.
                 </p>
                 <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                    <Button size="lg" className="rounded-full px-12 h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg shadow-xl shadow-primary/20 transition-transform hover:scale-105">
                      {isAuthenticated ? "Go to Dashboard" : "Create your free account"}
                    </Button>
                 </Link>
                 <p className="mt-6 text-sm text-slate-400">No credit card required. Setup takes 30 seconds.</p>
              </div>
           </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-12 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
           <div className="flex items-center gap-2 mb-6 md:mb-0">
             <Layers className="h-5 w-5 text-primary" />
             <span className="font-bold text-base text-foreground">Veselty CRM</span>
           </div>
           <div className="flex gap-8 text-sm font-medium text-muted-foreground">
             <Link to="#" className="hover:text-foreground transition-colors">Twitter</Link>
             <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
             <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
           </div>
           <p className="text-sm text-muted-foreground mt-6 md:mt-0">
             © {new Date().getFullYear()} Veselty. All rights reserved.
           </p>
        </div>
      </footer>
      
    </div>
  );
};

export default HomePage;
