import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "../../validators/auth.validator";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { toast } from "sonner";
import { Loader2, Layers, Mail, Lock } from "lucide-react";

// For frontend we just extract the body schema
const clientLoginSchema = loginSchema;

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
                    autoComplete="email"
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
                    autoComplete="current-password"
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

      {/* ── Right Side: Promotional/Brand Image ── */}
      <div className="hidden lg:flex flex-1 relative bg-muted/30 border-l border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-12">
            <div className="relative rounded-3xl bg-background border border-border/50 shadow-2xl p-8 backdrop-blur-xl">
               <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Layers className="h-6 w-6 text-primary" />
               </div>
               <h3 className="text-2xl font-bold text-foreground mb-4">"Veselty has completely transformed how our sales team operates."</h3>
               <p className="text-muted-foreground font-medium text-sm">Join the platform that helps you close more deals, faster.</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
