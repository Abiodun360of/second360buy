import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [errorMsg, setErrorMsg] = useState("");
  
  // If already logged in, redirect
  useGetAdminMe({
    query: {
      retry: false,
      onSuccess: (data) => {
        if (data.authenticated) setLocation("/admin");
      }
    }
  });

  const { mutateAsync: login, isPending } = useAdminLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setErrorMsg("");
    try {
      const res = await login({ data: values });
      if (res.success) {
        setLocation("/admin");
      } else {
        setErrorMsg(res.message || "Invalid credentials");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">Admin Access</h1>
            <p className="text-muted-foreground text-sm mt-1 text-center">
              Secure area for managing inventory and marketplace settings.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Administrator Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter secure password..."
                  className="pl-10 h-12 rounded-xl bg-background/50 focus:bg-background transition-colors"
                  {...form.register("password")}
                />
                <ShieldAlert className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive font-medium">{form.formState.errors.password.message}</p>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm font-medium text-center">
                {errorMsg}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-md font-semibold"
              disabled={isPending}
            >
              {isPending ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
