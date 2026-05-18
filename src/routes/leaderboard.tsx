import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Trophy, Crown, Gamepad2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Sıralama — Süper Lig Fantasy" },
      { name: "description", content: "Haftalık, aylık ve tüm zamanların sıralaması." },
    ],
  }),
  component: LeaderboardPage,
});

const WEEKLY = [
  { name: "Mehmet K.", team: "ANKARAGÜCÜ FC", pts: 142 },
  { name: "Burak T.", team: "MURAT'S XI", pts: 138 },
  { name: "Sen", team: "Senin Takımın", pts: 121, me: true },
  { name: "Ayşe D.", team: "FATİH GÜZELLERİ", pts: 118 },
  { name: "Cenk Ş.", team: "TEKEL FC", pts: 110 },
  { name: "Hakan U.", team: "GÜLEN YÜZLER", pts: 104 },
  { name: "Sema A.", team: "BALAT BOYZ", pts: 98 },
];

const MONTHLY = [
  { name: "Burak T.", team: "MURAT'S XI", pts: 512 },
  { name: "Mehmet K.", team: "ANKARAGÜCÜ FC", pts: 498 },
  { name: "Sen", team: "Senin Takımın", pts: 471, me: true },
  { name: "Cenk Ş.", team: "TEKEL FC", pts: 460 },
  { name: "Ayşe D.", team: "FATİH GÜZELLERİ", pts: 442 },
];

const ALL = [
  { name: "Burak T.", team: "MURAT'S XI", pts: 3120 },
  { name: "Mehmet K.", team: "ANKARAGÜCÜ FC", pts: 3045 },
  { name: "Sema A.", team: "BALAT BOYZ", pts: 2890 },
  { name: "Sen", team: "Senin Takımın", pts: 2754, me: true },
  { name: "Cenk Ş.", team: "TEKEL FC", pts: 2710 },
];

function LeaderboardPage() {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  useEffect(() => { if (!user) navigate({ to: "/login" }); }, [user, navigate]);

  return (
    <div className="min-h-screen pb-32">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-3xl font-bold tracking-tight">Sıralamalar</h1>
        <p className="text-sm text-muted-foreground">Zirveye oyna, ödülleri kap.</p>
      </header>

      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-gradient-to-br from-accent/30 via-accent/10 to-transparent border border-accent/40 p-4 flex items-center gap-3">
          <div className="size-12 rounded-xl bg-accent text-accent-foreground grid place-items-center">
            <Gamepad2 className="size-6" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest text-accent">Aylık Ödül</div>
            <div className="font-bold">PlayStation 5</div>
            <div className="text-xs text-muted-foreground">Ay sonunda 1. olan menajere</div>
          </div>
        </div>
      </div>

      <Board title="Bu Hafta" icon={Trophy} rows={WEEKLY} />
      <Board title="Aylık · PS5 Yarışı" icon={Crown} rows={MONTHLY} highlight />
      <Board title="Tüm Zamanlar" icon={Trophy} rows={ALL} />

      <BottomNav />
    </div>
  );
}

function Board({
  title, icon: Icon, rows, highlight,
}: { title: string; icon: typeof Trophy; rows: typeof WEEKLY; highlight?: boolean }) {
  return (
    <section className="mt-6">
      <h2 className="px-4 mb-2 text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Icon className="size-3.5" /> {title}
      </h2>
      <div className="mx-4 rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
        {rows.map((r, i) => {
          const rank = i + 1;
          return (
            <div
              key={r.name}
              className={`flex items-center gap-3 px-3 py-3 ${r.me ? "bg-neon/10" : ""}`}
            >
              <div className={`size-8 rounded-lg grid place-items-center text-sm font-bold ${
                rank === 1 ? "bg-accent text-accent-foreground"
                : rank === 2 ? "bg-white/15 text-white"
                : rank === 3 ? "bg-amber-700/40 text-amber-200"
                : "bg-muted text-muted-foreground"
              }`}>
                {rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${r.me ? "text-neon" : ""}`}>{r.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{r.team}</div>
              </div>
              <div className={`font-mono font-bold ${highlight ? "text-accent" : "text-neon"}`}>
                {r.pts}<span className="text-[10px] text-muted-foreground ml-1">PUAN</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
