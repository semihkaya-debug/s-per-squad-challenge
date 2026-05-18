import { useEffect, useSyncExternalStore } from "react";
import type { FormationKey, JokerId } from "./players";

type User = { email: string; name: string };

type State = {
  user: User | null;
  squad: string[];                 // player ids
  captain: string | null;
  formation: FormationKey;
  joker: JokerId | null;
  bonusBudget: number;             // M€ added via ads, max 5
  confirmed: boolean;
};

const KEY = "slff_state_v1";

const initial: State = {
  user: null,
  squad: [],
  captain: null,
  formation: "4-3-3",
  joker: null,
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
  setJoker(j: JokerId) {
    setState({ joker: j });
  },
  addBonus() {
    if (state.bonusBudget >= 5) return false;
    setState({ bonusBudget: state.bonusBudget + 1 });
    return true;
  },
  confirm() {
    setState({ confirmed: true });
  },
  reset() {
    setState({ squad: [], captain: null, joker: null, confirmed: false });
  },
};
