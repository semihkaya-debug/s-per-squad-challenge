import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clapperboard, Loader2 } from "lucide-react";
import { FORMATIONS, JOKERS, PLAYERS, type FormationKey, type Player, type Position } from "@/lib/players";
import { actions, useStore } from "@/lib/store";
import { Pitch } from "@/components/Pitch";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kadron — Süper Lig Fantasy" },
      { name: "description", content: "100M€ bütçeyle Süper Lig kadronu kur, jokerini seç, zirveye oyna." },
      { property: "og:title", content: "Süper Lig Fantasy" },
      { property: "og:description", content: "Kadronu kur, jokerini seç, zirveye oyna." },
    ],
  }),
  component: SquadPage,
});

const BASE_BUDGET = 100;

function SquadPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const squad = useStore((s) => s.squad);
  const formation = useStore((s) => s.formation);
  const joker = useStore((s) => s.joker);
  const bonus = useStore((s) => s.bonusBudget);
  const confirmed = useStore((s) => s.confirmed);
  const captain = useStore((s) => s.captain);

  const [watching, setWatching] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user === null && typeof window !== "undefined") {
      // small delay for hydration
      const t = setTimeout(() => {
        const stored = localStorage.getItem("slff_state_v1");
        if (!stored || !JSON.parse(stored).user) navigate({ to: "/login" });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [user, navigate]);

  const budget = BASE_BUDGET + bonus;
  const picked = useMemo(() => PLAYERS.filter((p) => squad.includes(p.id)), [squad]);
  const spent = picked.reduce((a, p) => a + p.price, 0);
  const remaining = budget - spent;
  const overBudget = spent > budget;

  const config = FORMATIONS[formation];

  const slots = useMemo(() => {
    const byPos: Record<Position, Player[]> = { GK: [], DEF: [], MID: [], FWD: [] };
    picked.forEach((p) => byPos[p.position].push(p));
    const out: Record<Position, (Player | null)[]> = { GK: [], DEF: [], MID: [], FWD: [] };
    (Object.keys(config) as Position[]).forEach((pos) => {
      const slotsCount = config[pos];
      const arr: (Player | null)[] = [];
      for (let i = 0; i < slotsCount; i++) arr.push(byPos[pos][i] ?? null);
      out[pos] = arr;
    });
    return out;
  }, [picked, config]);

  const positionStatus = (Object.keys(config) as Position[]).map((pos) => {
    const have = picked.filter((p) => p.position === pos).length;
    return { pos, have, need: config[pos] };
  });
  const tooManyByPos = positionStatus.some((s) => s.have > s.need);
  const filledCount = positionStatus.reduce((a, s) => a + Math.min(s.have, s.need), 0);
  const totalNeeded = 11;
  const complete = picked.length === 11 && !tooManyByPos;

  const canConfirm = complete && !overBudget && joker && captain;

  const watchAd = () => {
    if (bonus >= 5 || watching) return;
    setWatching(true);
    setTimeout(() => {
      const ok = actions.addBonus();
      setWatching(false);
      if (ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1800);
      }
    }, 1600);
  };

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border safe-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Hoş geldin</div>
            <div className="text-sm font-semibold">{user?.name ?? "Menajer"}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Bütçe</div>
            <div className={`font-mono font-bold ${overBudget ? "text-destructive" : "text-neon"}`}>
              {remaining.toFixed(1)}M€ <span className="text-muted-foreground text-xs">/ {budget}M€</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full transition-all ${overBudget ? "bg-destructive" : "bg-neon"}`}
              style={{ width: `${Math.min(100, (spent / budget) * 100)}%` }}
            />
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        {/* Formation + Status */}
        <div className="flex items-center gap-3">
          <Select value={formation} onValueChange={(v) => actions.setFormation(v as FormationKey)}>
            <SelectTrigger className="flex-1 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(FORMATIONS) as FormationKey[]).map((f) => (
                <SelectItem key={f} value={f}>Diziliş {f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="rounded-xl border border-border bg-card px-3 h-11 flex items-center font-mono text-sm">
            <span className={complete ? "text-neon" : "text-muted-foreground"}>{filledCount}</span>
            <span className="text-muted-foreground">/{totalNeeded}</span>
          </div>
        </div>

        {/* Pitch */}
        <Pitch formation={config} slots={slots} budget={budget} />

        {/* Warnings */}
        {overBudget && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <AlertTriangle className="size-4 mt-0.5 text-destructive shrink-0" />
            <div>
              <div className="font-semibold text-destructive">Bütçe aşıldı</div>
              <div className="text-xs text-destructive/80 mt-0.5">
                {Math.abs(remaining).toFixed(1)}M€ fazla harcadın. Bir oyuncuyu çıkar veya reklam izleyerek bütçeyi artır.
              </div>
            </div>
          </div>
        )}

        {/* Watch Ad */}
        <button
          onClick={watchAd}
          disabled={bonus >= 5 || watching}
          className="w-full rounded-2xl border border-accent/40 bg-gradient-to-r from-accent/15 to-accent/5 p-4 flex items-center gap-3 active:scale-[0.99] transition disabled:opacity-50 disabled:active:scale-100"
        >
          <div className="size-11 rounded-xl bg-accent text-accent-foreground grid place-items-center">
            {watching ? <Loader2 className="size-5 animate-spin" /> : <Clapperboard className="size-5" />}
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold">
              {watching ? "Reklam oynatılıyor..." : "Reklam İzle +1M€ Bütçe"}
            </div>
            <div className="text-xs text-muted-foreground">
              Bu hafta {5 - bonus} hak kaldı · Max 105M€
            </div>
          </div>
          <div className="text-xs font-mono text-accent">+1M€</div>
        </button>

        {/* Jokers */}
        <section>
          <h2 className="text-sm font-semibold mb-2 flex items-center justify-between">
            <span>Haftalık Joker <span className="text-muted-foreground font-normal">(1 zorunlu)</span></span>
            {joker && <span className="text-[10px] text-neon">SEÇİLDİ</span>}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {JOKERS.map((j) => {
              const active = joker === j.id;
              return (
                <button
                  key={j.id}
                  onClick={() => actions.setJoker(j.id)}
                  className={`text-left p-3 rounded-xl border transition ${
                    active
                      ? "border-neon bg-neon/10 glow-neon"
                      : "border-border bg-card hover:border-neon/40"
                  }`}
                >
                  <div className="text-xl mb-1">{j.emoji}</div>
                  <div className={`text-sm font-semibold ${active ? "text-neon" : ""}`}>{j.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{j.desc}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Captain hint */}
        {squad.length > 0 && !captain && (
          <div className="text-xs text-center text-muted-foreground">
            İpucu: Bir oyuncuya dokunup yıldız ikonundan kaptan seç.
          </div>
        )}

        {/* Confirm */}
        <Button
          disabled={!canConfirm}
          onClick={() => actions.confirm()}
          className="w-full h-14 text-base font-bold bg-neon text-neon-foreground hover:bg-neon/90 glow-neon disabled:opacity-40 disabled:bg-muted disabled:text-muted-foreground disabled:glow-none"
        >
          {confirmed ? "✓ Kadro Onaylandı" :
            overBudget ? "Bütçe Aşıldı — Onaylayamazsın" :
            !complete ? `Kadronu Tamamla (${picked.length}/11)` :
            !joker ? "Joker Seç" :
            !captain ? "Kaptan Seç" :
            "Kadroyu Onayla"}
        </Button>
      </div>

      <BottomNav />

      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="max-w-xs text-center">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3">
              <CheckCircle2 className="size-12 text-neon" />
              <span>+1M€ kazandın!</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Yeni bütçen: {budget}M€</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
