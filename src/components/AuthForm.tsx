import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { actions, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    actions.login(email, mode === "register" ? name || email.split("@")[0] : email.split("@")[0]);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 pt-16 pb-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
            <span className="size-1.5 rounded-full bg-neon animate-pulse" />
            SÜPER LİG FANTASY
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight">
            {mode === "login" ? "Tekrar hoş geldin" : "Aramıza katıl"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Kadronu yönet, jokerini seç, zirveye oyna."
              : "Hesap aç, 100M€ bütçeyle hayalindeki kadroyu kur."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">İsim</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Adın" />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">E-posta</label>
            <Input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="sen@ornek.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Şifre</label>
            <Input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-neon text-neon-foreground hover:bg-neon/90 glow-neon font-semibold">
            {mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>Hesabın yok mu? <Link to="/register" className="text-neon font-medium">Kayıt ol</Link></>
          ) : (
            <>Zaten üye misin? <Link to="/login" className="text-neon font-medium">Giriş yap</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
