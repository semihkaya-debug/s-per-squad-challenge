import { useMemo, useState } from "react";
import { Plus, X, Star, Search } from "lucide-react";
import { PLAYERS, type Player, type Position } from "@/lib/players";
import { actions, useStore } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const POSITION_LABEL: Record<Position, string> = { GK: "Kaleci", DEF: "Defans", MID: "Orta Saha", FWD: "Forvet" };
const POSITION_BADGE: Record<Position, string> = {
  GK: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  DEF: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  MID: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  FWD: "bg-rose-500/20 text-rose-300 border-rose-500/40",
};

export function Pitch({
  formation, slots, budget,
}: {
  formation: { GK: number; DEF: number; MID: number; FWD: number };
  slots: Record<Position, (Player | null)[]>;
  budget: number;
}) {
  const rows: Position[] = ["FWD", "MID", "DEF", "GK"];
  return (
    <div className="pitch-bg relative rounded-2xl overflow-hidden border border-border aspect-[3/4] flex flex-col justify-around p-3">
      {rows.map((pos) => (
        <div key={pos} className="relative z-10 flex justify-around items-center">
          {slots[pos].map((p, i) => (
            <PlayerSlot key={pos + i} position={pos} player={p} budget={budget} />
          ))}
        </div>
      ))}
    </div>
  );
}

function PlayerSlot({
  position, player, budget,
}: { position: Position; player: Player | null; budget: number }) {
  const captain = useStore((s) => s.captain);
  const isCap = player && captain === player.id;

  return (
    <PlayerPicker position={position} budget={budget}>
      <button className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
        <div className="relative">
          <div className={`size-12 rounded-full grid place-items-center border-2 ${
            player ? "border-neon bg-neon/15 glow-neon" : "border-dashed border-white/30 bg-black/30"
          }`}>
            {player ? (
              <span className="text-xs font-bold">{player.name.split(" ").slice(-1)[0].slice(0, 3).toUpperCase()}</span>
            ) : (
              <Plus className="size-5 text-white/60" />
            )}
          </div>
          {isCap && (
            <span className="absolute -top-1 -right-1 size-5 rounded-full bg-accent text-accent-foreground grid place-items-center text-[10px] font-bold border-2 border-pitch">C</span>
          )}
        </div>
        {player ? (
          <div className="text-center max-w-[68px]">
            <div className="text-[10px] font-medium text-white leading-tight truncate">{player.name.split(" ").slice(-1)[0]}</div>
            <div className="text-[9px] text-neon font-semibold">{player.price}M€</div>
          </div>
        ) : (
          <div className="text-[10px] text-white/50">{POSITION_LABEL[position]}</div>
        )}
      </button>
    </PlayerPicker>
  );
}

function PlayerPicker({
  children, position, budget,
}: { children: React.ReactNode; position: Position; budget: number }) {
  const squad = useStore((s) => s.squad);
  const captain = useStore((s) => s.captain);
  const [query, setQuery] = useState("");

  const picked = useMemo(() => PLAYERS.filter((p) => squad.includes(p.id)), [squad]);
  const spent = picked.reduce((acc, p) => acc + p.price, 0);
  const remaining = budget - spent;

  const list = useMemo(() => {
    return PLAYERS
      .filter((p) => p.position === position)
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.team.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.price - a.price);
  }, [position, query]);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col bg-card">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center justify-between">
            <span>{POSITION_LABEL[position]} Seç</span>
            <span className={`text-sm font-mono ${remaining < 0 ? "text-destructive" : "text-neon"}`}>
              Kalan: {remaining.toFixed(1)}M€
            </span>
          </SheetTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Oyuncu veya takım ara..." className="pl-9"
            />
          </div>
        </SheetHeader>
        <div className="overflow-y-auto flex-1 divide-y divide-border">
          {list.map((p) => {
            const selected = squad.includes(p.id);
            const tooExpensive = !selected && spent + p.price > budget;
            return (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`size-10 rounded-full grid place-items-center text-xs font-bold border ${POSITION_BADGE[p.position]}`}>
                  {p.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.team} · Form {p.form}/10</div>
                </div>
                <div className="text-sm font-semibold text-neon mr-2">{p.price}M€</div>
                {selected ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => actions.setCaptain(p.id)}
                      className={`size-9 rounded-lg grid place-items-center border ${
                        captain === p.id ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground"
                      }`}
                      title="Kaptan yap"
                    >
                      <Star className="size-4" fill={captain === p.id ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => actions.togglePlayer(p.id)}
                      className="size-9 rounded-lg grid place-items-center border border-destructive/50 text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={tooExpensive}
                    onClick={() => actions.togglePlayer(p.id)}
                    className="h-9 px-3 rounded-lg bg-neon text-neon-foreground text-xs font-semibold disabled:opacity-40 disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {tooExpensive ? "Bütçe Yok" : "Ekle"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
