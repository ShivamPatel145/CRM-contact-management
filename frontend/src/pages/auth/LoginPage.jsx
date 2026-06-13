import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema as clientLoginSchema } from "../../validators/auth.validator";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { toast } from "sonner";
import { Loader2, Layers, Mail, Lock } from "lucide-react";

// Using the local client schema directly

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientLoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", data);

      if (response.data.success) {
        toast.success("Welcome back!");
        login(response.data.token, response.data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex bg-background selection:bg-primary/30">
      
      {/* ── Left Side: Form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Layers size={22} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-foreground">Veselty</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Sign in to your account</h1>
            <p className="text-[15px] text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Start for free
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    className="pl-10 h-12 rounded-xl border-border/60 bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive font-medium mt-1.5">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className="pl-10 h-12 rounded-xl border-border/60 bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive font-medium mt-1.5">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-[15px] font-semibold shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Right Side: Custom UI Composition ── */}
      <div className="hidden lg:flex flex-1 relative bg-muted/20 border-l border-border/40 overflow-hidden items-center justify-center">
        {/* Soft Background Blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Mock UI Composition */}
        <div className="relative w-full max-w-[500px] h-[500px]">
           {/* Back Card */}
           <div className="absolute top-12 right-8 w-64 h-48 rounded-2xl bg-background/60 border border-border/50 shadow-xl backdrop-blur-md p-6 rotate-[6deg]">
             <div className="flex items-center gap-3 mb-4 opacity-50">
               <div className="h-8 w-8 rounded-full bg-primary/20"></div>
               <div className="space-y-1.5 flex-1">
                 <div className="h-3 w-20 bg-muted rounded"></div>
                 <div className="h-2 w-16 bg-muted-foreground/30 rounded"></div>
               </div>
             </div>
             <div className="space-y-3">
               <div className="h-2 w-full bg-muted rounded"></div>
               <div className="h-2 w-4/5 bg-muted rounded"></div>
             </div>
           </div>

           {/* Main Front Card */}
           <div className="absolute bottom-12 left-8 w-80 h-72 rounded-3xl bg-background/90 border border-border shadow-2xl backdrop-blur-xl p-8 z-10 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                   <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 leading-tight">Clarity drives <br/> performance.</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  Join thousands of professionals using Veselty to close deals faster.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-primary/20 -ml-2 first:ml-0 flex items-center justify-center">
                     <div className="h-4 w-4 rounded-full bg-primary/40"></div>
                   </div>
                 ))}
                 <div className="h-8 w-8 rounded-full border-2 border-background bg-muted -ml-2 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                   +1k
                 </div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
