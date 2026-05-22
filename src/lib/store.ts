import { useEffect, useSyncExternalStore } from "react";
import type { FormationKey, JokerId } from "./players";
import { JOKERS, SEASONAL_USES_PER_HALF, MAX_AD_BUDGET } from "./players";

type User = { email: string; name: string };

type State = {
  user: User | null;
  squad: string[];                 // player ids
  captain: string | null;
  formation: FormationKey;

  // --- JOKER SİSTEMİ ---
  weeklyJoker: JokerId | null;            // bu hafta seçilen haftalık joker (1 tane)
  weeklyJokerUnlocked: boolean;           // reklam izlendi mi? haftalık joker hakkı açıldı mı
  seasonalJoker: JokerId | null;          // bu hafta SEÇİLEN sezonluk joker (geçici — onaylanınca kalıcılaşır)
  seasonalUsed: Partial<Record<JokerId, number>>; // her sezonluk joker bu yarıda kaç kez kullanıldı
  seasonalChargedThisWeek: boolean;       // bu hafta sezonluk hak yakıldı mı (çift yakmayı önler)
  seasonHalf: 1 | 2;                      // sezon yarısı — şimdilik elle sabit (bkz. NOT)

  bonusBudget: number;             // M€ added via ads, max MAX_AD_BUDGET
  confirmed: boolean;
};

// NOT (seasonHalf): Şimdilik elle sabit "1". İkinci yarıya geçince elle 2 yapılır,
// ya da maç takvimi/hafta numarası backend'den gelince otomatikleştirilir.
const KEY = "slff_state_v1";

const initial: State = {
  user: null,
  squad: [],
  captain: null,
  formation: "4-3-3",

  weeklyJoker: null,
  weeklyJokerUnlocked: false,
  seasonalJoker: null,
  seasonalUsed: {},
  seasonalChargedThisWeek: false,
  seasonHalf: 1,

  bonusBudget: 0,
  confirmed: false,
};

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

let state: State = initial;
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }
function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
}

export function setState(partial: Partial<State>) {
  state = { ...state, ...partial };
  persist();
  emit();
}

export function useStore<T>(selector: (s: State) => T): T {
  // Ensure initial load from localStorage on mount (SSR safe)
  useEffect(() => {
    if (state === initial) {
      state = load();
      emit();
    }
  }, []);
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => selector(state),
    () => selector(initial),
  );
}

export const actions = {
  login(email: string, name = email.split("@")[0]) {
    setState({ user: { email, name } });
  },
  logout() {
    setState({ user: null });
  },
  togglePlayer(id: string) {
    const squad = state.squad.includes(id)
      ? state.squad.filter((x) => x !== id)
      : [...state.squad, id];
    const captain = squad.includes(state.captain ?? "") ? state.captain : null;
    setState({ squad, captain, confirmed: false });
  },
  setCaptain(id: string) {
    if (!state.squad.includes(id)) return;
    setState({ captain: id });
  },
  setFormation(f: FormationKey) {
    setState({ formation: f, confirmed: false });
  },

  // Reklam izlenince çağrılır → bu haftaki haftalık joker hakkını açar
  unlockWeeklyJoker() {
    setState({ weeklyJokerUnlocked: true });
  },

  // Haftalık joker seç (sadece hak açıldıysa, ve sadece weekly türündense)
  setWeeklyJoker(j: JokerId) {
    const def = JOKERS.find((x) => x.id === j);
    if (!def || def.type !== "weekly") return false;
    if (!state.weeklyJokerUnlocked) return false; // önce reklam izlenmeli
    setState({ weeklyJoker: j, confirmed: false });
    return true;
  },

  // Sezonluk joker SEÇ — hak YAKMAZ, sadece bu haftaki seçimi işaretler.
  // Aynı jokere tekrar tıklamak seçimi iptal eder (toggle). Hak ancak confirm()'de yanar.
  // Bu hafta en fazla 1 sezonluk joker seçili olabilir (yenisi eskisinin yerine geçer).
  useSeasonalJoker(j: JokerId) {
    const def = JOKERS.find((x) => x.id === j);
    if (!def || def.type !== "seasonal") return false;
    // Bu yarıda hakkı bitmişse seçtirme (zaten kullanılmış)
    const usedThisHalf = state.seasonalUsed[j] ?? 0;
    if (usedThisHalf >= SEASONAL_USES_PER_HALF) return false;
    // Eğer bu hafta hak zaten yakıldıysa (onaylanmış), değiştirmeye izin verme
    if (state.seasonalChargedThisWeek) return false;
    // Toggle: aynısına tekrar tıklandıysa iptal et, değilse seç
    const next = state.seasonalJoker === j ? null : j;
    setState({ seasonalJoker: next, confirmed: false });
    return true;
  },

  addBonus() {
    if (state.bonusBudget >= MAX_AD_BUDGET) return false;
    setState({ bonusBudget: state.bonusBudget + 1 });
    return true;
  },
  // Onay — sezonluk joker seçiliyse hakkı BURADA yakılır (seçim anında değil).
  // seasonalChargedThisWeek çift yakmayı önler (tekrar onaylarsan ikinci kez yanmaz).
  confirm() {
    const j = state.seasonalJoker;
    if (j && !state.seasonalChargedThisWeek) {
      const usedThisHalf = state.seasonalUsed[j] ?? 0;
      setState({
        seasonalUsed: { ...state.seasonalUsed, [j]: usedThisHalf + 1 },
        seasonalChargedThisWeek: true,
        confirmed: true,
      });
    } else {
      setState({ confirmed: true });
    }
  },
  // Haftalık reset — yeni haftaya geçişte haftalık şeyleri sıfırlar.
  // DİKKAT: seasonalUsed'a DOKUNMAZ (sezonluk haklar yarı boyunca korunur).
  reset() {
    setState({
      squad: [],
      captain: null,
      weeklyJoker: null,
      weeklyJokerUnlocked: false,
      seasonalJoker: null,
      seasonalChargedThisWeek: false,
      bonusBudget: 0,
      confirmed: false,
    });
  },
};
