import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("admin@jea.org.jo");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // Simple hardcoded check
      const trimmedEmail = email.trim().toLowerCase();
      if (trimmedEmail === "admin@jea.org.jo" && password === "admin123") {
        setSession("mock-jwt-token-sk_8924", {
          id: "usr-1",
          name: "م. أحمد خليل",
          email: "admin@jea.org.jo",
          roles: ["admin"],
        });
        setIsLoading(false);
        navigate(from, { replace: true });
      } else {
        setIsLoading(false);
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة. (استخدم: admin@jea.org.jo / admin123)");
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-40 -start-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -end-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-8 shadow-jea-lg relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* JEA Logo Mark */}
          <div className="relative h-16 w-16 rounded-xl bg-white overflow-hidden p-1 shadow-sm border border-border-subtle mb-4">
            <img 
              src="/logo.png" 
              alt="JEA Logo" 
              className="absolute top-0 left-0 h-[175%] w-full object-cover object-top" 
            />
          </div>
          <h2 className="text-lg font-bold text-primary">نقابة المهندسين الأردنيين</h2>
          <p className="text-xs text-muted mt-1">بوابة منصة العمليات والخدمات الذكية</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-error/5 p-3 text-xs text-error border border-error/10">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-primary">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute start-3 top-2.5 h-4 w-4 text-muted" />
              <Input
                type="email"
                placeholder="example@jea.org.jo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ps-10 text-xs text-start h-9 w-full"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-primary">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute start-3 top-2.5 h-4 w-4 text-muted" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ps-10 pe-10 text-xs text-start h-9 w-full"
                dir="ltr"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-2.5 text-muted hover:text-primary"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-muted hover:text-primary">
              <input 
                type="checkbox" 
                defaultChecked 
                className="h-3.5 w-3.5 rounded border-border-subtle text-primary focus:ring-primary/20 cursor-pointer" 
              />
              <span>تذكرني على هذا الجهاز</span>
            </label>
            <a href="#forgot" className="text-primary font-medium hover:underline">نسيت كلمة المرور؟</a>
          </div>

          <Button
            type="submit"
            className="w-full justify-center h-10 mt-6 text-sm font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
