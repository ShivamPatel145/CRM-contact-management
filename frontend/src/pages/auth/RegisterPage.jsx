import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Layers, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRegister } from "../../hooks/useAuthActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name cannot exceed 60 characters").trim(),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/\d/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-destructive shadow-destructive/50" };
  if (score === 3) return { score, label: "Fair", color: "bg-amber-500 shadow-amber-500/50" };
  if (score === 4) return { score, label: "Good", color: "bg-blue-500 shadow-blue-500/50" };
  return { score, label: "Strong", color: "bg-emerald-500 shadow-emerald-500/50" };
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { handleRegister, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password", "");
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = (data) => {
    const { confirmPassword, ...payload } = data;
    handleRegister(payload);
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 overflow-hidden selection:bg-primary/30">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-[100%] h-[100%] rounded-full bg-primary/10 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-1/4 -right-1/4 w-[80%] h-[80%] rounded-full bg-accent/20 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <Card className="w-full max-w-[460px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-border/50 bg-background/60 backdrop-blur-2xl animate-in zoom-in-95 fade-in duration-500 z-10 relative">
        <CardHeader className="space-y-3 text-center pb-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
            <Layers className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              Create your account
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Start managing your contacts for free
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Full name</Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="John Smith"
                {...register("name")}
                className={`h-10 bg-background/50 transition-all ${errors.name ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary/30 focus-visible:border-primary"}`}
              />
              {errors.name && (
                <div className="flex items-center gap-1.5 text-[11px] text-destructive mt-1 font-medium animate-in slide-in-from-top-1 fade-in">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.name.message}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                {...register("email")}
                className={`h-10 bg-background/50 transition-all ${errors.email ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary/30 focus-visible:border-primary"}`}
              />
              {errors.email && (
                <div className="flex items-center gap-1.5 text-[11px] text-destructive mt-1 font-medium animate-in slide-in-from-top-1 fade-in">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 8 chars"
                    {...register("password")}
                    className={`h-10 pr-9 bg-background/50 transition-all ${errors.password ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary/30 focus-visible:border-primary"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Confirm</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    {...register("confirmPassword")}
                    className={`h-10 pr-9 bg-background/50 transition-all ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary/30 focus-visible:border-primary"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error messages for passwords */}
            <div className="flex flex-col gap-1">
              {errors.password && (
                <div className="flex items-center gap-1.5 text-[11px] text-destructive font-medium animate-in slide-in-from-top-1 fade-in">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.password.message}</span>
                </div>
              )}
              {errors.confirmPassword && (
                <div className="flex items-center gap-1.5 text-[11px] text-destructive font-medium animate-in slide-in-from-top-1 fade-in">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.confirmPassword.message}</span>
                </div>
              )}
            </div>

            {/* Password strength and requirements */}
            <div className="bg-secondary/30 border border-border/30 rounded-xl p-3 flex flex-col gap-2 mt-2 backdrop-blur-sm">
              {passwordValue && (
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? `${strength.color} shadow-sm` : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${strength.color.split(' ')[0].replace("bg-", "text-")}`}>
                    {strength.label}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                {[
                  { rule: /^.{8,}$/, text: "Min 8 chars" },
                  { rule: /[A-Z]/, text: "Uppercase" },
                  { rule: /[a-z]/, text: "Lowercase" },
                  { rule: /\d/, text: "Number" },
                ].map(({ rule, text }) => {
                  const met = rule.test(passwordValue);
                  return (
                    <div key={text} className={`flex items-center gap-1.5 text-[11px] transition-colors duration-300 ${met ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                      <CheckCircle2 className={`h-3 w-3 transition-colors duration-300 ${met ? "text-primary" : "text-muted-foreground/40"}`} />
                      {text}
                    </div>
                  );
                })}
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold mt-4 shadow-md shadow-primary/20 hover:shadow-lg transition-all" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-5 text-sm text-muted-foreground/80 bg-secondary/10 rounded-b-xl">
          Already have an account?{" "}
          <Link to="/login" className="ml-1.5 font-semibold text-primary hover:text-primary/80 transition-colors">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
