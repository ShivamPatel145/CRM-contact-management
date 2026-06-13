import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Layers, AlertCircle, Loader2 } from "lucide-react";
import { useLogin } from "../../hooks/useAuthActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 overflow-hidden selection:bg-primary/30">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-[100%] h-[100%] rounded-full bg-primary/10 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-1/4 -right-1/4 w-[80%] h-[80%] rounded-full bg-accent/20 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <Card className="w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-border/50 bg-background/60 backdrop-blur-2xl animate-in zoom-in-95 fade-in duration-500 z-10 relative">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
            <Layers className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Sign in to your CRM Hub account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} noValidate className="space-y-4.5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                {...register("email")}
                className={`h-11 bg-background/50 transition-all ${errors.email ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary/30 focus-visible:border-primary"}`}
              />
              {errors.email && (
                <div className="flex items-center gap-1.5 text-xs text-destructive mt-1 font-medium animate-in slide-in-from-top-1 fade-in">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`h-11 pr-10 bg-background/50 transition-all ${errors.password ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary/30 focus-visible:border-primary"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1.5 text-xs text-destructive mt-1 font-medium animate-in slide-in-from-top-1 fade-in">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold mt-6 shadow-md shadow-primary/20 hover:shadow-lg transition-all" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-6 text-sm text-muted-foreground/80 bg-secondary/10 rounded-b-xl">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="ml-1.5 font-semibold text-primary hover:text-primary/80 transition-colors">
            Create one free
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
