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

export type AuthMode = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: AuthMode;
}

export function AuthModal({ open, onOpenChange, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  // Keep the tab in sync with whichever button opened the modal
  const handleOpenChange = (next: boolean) => {
    if (next) setMode(defaultMode);
    onOpenChange(next);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: შეაერთე შენი auth ლოგიკა აქ (მაგ. Supabase signInWithPassword)
    console.log("Login submit");
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: შეაერთე შენი auth ლოგიკა აქ (მაგ. Supabase signUp)
    console.log("Signup submit");
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

        <Tabs value={mode} onValueChange={(v) => setMode(v as AuthMode)} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div className="space-y-2">
                <Label htmlFor="login-email">ელფოსტა</Label>
                <Input id="login-email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">პაროლი</Label>
                <Input id="login-password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full">
                შესვლა
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div className="space-y-2">
                <Label htmlFor="signup-name">სახელი</Label>
                <Input id="signup-name" type="text" placeholder="შენი სახელი" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">ელფოსტა</Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">პაროლი</Label>
                <Input id="signup-password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full">
                ანგარიშის შექმნა
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
