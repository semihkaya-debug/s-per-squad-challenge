import { Link, useLocation } from "@tanstack/react-router";
import { Users, Trophy, LogOut } from "lucide-react";
import { actions, useStore } from "@/lib/store";

export function BottomNav() {
  const loc = useLocation();
  const user = useStore((s) => s.user);
  if (!user) return null;

  const items = [
    { to: "/", label: "Kadro", icon: Users },
    { to: "/leaderboard", label: "Sıralama", icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto max-w-md grid grid-cols-3">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors ${
                active ? "text-neon" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
        <button
          onClick={() => actions.logout()}
          className="flex flex-col items-center justify-center gap-1 py-3 text-xs text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-5" />
          Çıkış
        </button>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
