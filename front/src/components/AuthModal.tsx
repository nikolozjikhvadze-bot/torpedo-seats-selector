import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../components/AuthContext";

export type AuthMode = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: AuthMode;
}

export function AuthModal({ open, onOpenChange, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  // AuthContext
  const { login } = useAuth();

  // Form State-ები
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // შეტყობინებებისა და ჩატვირთვის სტატუსები
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setMode(defaultMode);
      setErrorMsg("");
      setSuccessMsg("");
    }
    onOpenChange(next);
  };

  // LOGIN HANDLER
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // AuthContext-ის login ფუნქციის გამოძახება
        login(data.user, data.token);
        
        setSuccessMsg("წარმატებული ავტორიზაცია!");

        setTimeout(() => {
          onOpenChange(false);
        }, 1000);
      } else {
        setErrorMsg(data.message || "ავტორიზაციის შეცდომა");
      }
    } catch (err) {
      setErrorMsg("სერვერთან დაკავშირება ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP HANDLER
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("რეგისტრაცია წარმატებით დასრულდა! გადადით Login-ზე.");
        setMode("login");
        setLoginEmail(signupEmail);
      } else {
        setErrorMsg(data.message || "რეგისტრაციის შეცდომა");
      }
    } catch (err) {
      setErrorMsg("სერვერთან დაკავშირება ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold uppercase tracking-tight">
            {mode === "login" ? "შესვლა" : "რეგისტრაცია"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "შედი შენს ანგარიშში, რომ არ გამოგრჩეს მატჩები და სიახლეები."
              : "შექმენი ანგარიში FC Torpedo Kutaisi საზოგადოებაში."}
          </DialogDescription>
        </DialogHeader>

        {/* Dynamic Status Messages */}
        {errorMsg && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}
        {successMsg && <p className="text-sm font-medium text-emerald-600">{successMsg}</p>}

        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as AuthMode);
            setErrorMsg("");
            setSuccessMsg("");
          }}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login" className="mt-4">
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div className="space-y-2">
                <Label htmlFor="login-email">ელფოსტა</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">პაროლი</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "მიმდინარეობს..." : "შესვლა"}
              </Button>
            </form>
          </TabsContent>

          {/* SIGNUP TAB */}
          <TabsContent value="signup" className="mt-4">
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div className="space-y-2">
                <Label htmlFor="signup-name">სახელი</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="შენი სახელი"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">ელფოსტა</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">პაროლი</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "მიმდინარეობს..." : "ანგარიშის შექმნა"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}