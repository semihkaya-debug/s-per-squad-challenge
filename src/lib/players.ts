export type Position = "GK" | "DEF" | "MID" | "FWD";

export type Player = {
  id: string;
  name: string;
  team: string;
  position: Position;
  price: number; // millions
  form: number;  // 1-10
};

export const PLAYERS: Player[] = [
  // GK
  { id: "p1", name: "Fernando Muslera", team: "Galatasaray", position: "GK", price: 7, form: 7 },
  { id: "p2", name: "Dominik Livaković", team: "Fenerbahçe", position: "GK", price: 8, form: 8 },
  { id: "p3", name: "Mert Günok", team: "Beşiktaş", position: "GK", price: 6, form: 7 },
  { id: "p4", name: "Uğurcan Çakır", team: "Trabzonspor", position: "GK", price: 7, form: 8 },

  // DEF
  { id: "p5", name: "Davinson Sánchez", team: "Galatasaray", position: "DEF", price: 8, form: 8 },
  { id: "p6", name: "Abdülkerim Bardakcı", team: "Galatasaray", position: "DEF", price: 7, form: 7 },
  { id: "p7", name: "Alexander Djiku", team: "Fenerbahçe", position: "DEF", price: 7, form: 7 },
  { id: "p8", name: "Bright Osayi-Samuel", team: "Fenerbahçe", position: "DEF", price: 7, form: 8 },
  { id: "p9", name: "Gabriel Paulista", team: "Beşiktaş", position: "DEF", price: 7, form: 7 },
  { id: "p10", name: "Stefan Savić", team: "Trabzonspor", position: "DEF", price: 6, form: 6 },
  { id: "p11", name: "Kerem Demirbay", team: "Galatasaray", position: "DEF", price: 5, form: 6 },

  // MID
  { id: "p12", name: "Lucas Torreira", team: "Galatasaray", position: "MID", price: 9, form: 8 },
  { id: "p13", name: "Sergio Oliveira", team: "Galatasaray", position: "MID", price: 7, form: 7 },
  { id: "p14", name: "Gedson Fernandes", team: "Beşiktaş", position: "MID", price: 8, form: 7 },
  { id: "p15", name: "Fred", team: "Fenerbahçe", position: "MID", price: 9, form: 8 },
  { id: "p16", name: "İrfan Can Kahveci", team: "Fenerbahçe", position: "MID", price: 8, form: 7 },
  { id: "p17", name: "Rachid Ghezzal", team: "Beşiktaş", position: "MID", price: 7, form: 7 },
  { id: "p18", name: "Anastasios Bakasetas", team: "Trabzonspor", position: "MID", price: 8, form: 7 },
  { id: "p19", name: "Hakim Ziyech", team: "Galatasaray", position: "MID", price: 10, form: 8 },
  { id: "p20", name: "Dušan Tadić", team: "Fenerbahçe", position: "MID", price: 10, form: 8 },

  // FWD
  { id: "p21", name: "Mauro Icardi", team: "Galatasaray", position: "FWD", price: 15, form: 9 },
  { id: "p22", name: "Victor Osimhen", team: "Galatasaray", position: "FWD", price: 18, form: 9 },
  { id: "p23", name: "Edin Džeko", team: "Fenerbahçe", position: "FWD", price: 12, form: 8 },
  { id: "p24", name: "Cenk Tosun", team: "Beşiktaş", position: "FWD", price: 8, form: 7 },
  { id: "p25", name: "Michy Batshuayi", team: "Galatasaray", position: "FWD", price: 9, form: 7 },
  { id: "p26", name: "Dušan Tadić", team: "Trabzonspor", position: "FWD", price: 7, form: 6 },
  { id: "p27", name: "Mame Thiam", team: "Konyaspor", position: "FWD", price: 6, form: 7 },
  { id: "p28", name: "Anthony Nwakaeme", team: "Trabzonspor", position: "FWD", price: 6, form: 6 },
];

export const FORMATIONS = {
  "4-4-2": { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  "4-3-3": { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  "3-5-2": { GK: 1, DEF: 3, MID: 5, FWD: 2 },
} as const;

export type FormationKey = keyof typeof FORMATIONS;

// Joker türleri:
// - "weekly"   → her hafta SADECE 1 tane kullanılabilir, kullanmak için reklam izlemek şart.
// - "seasonal" → sezonda toplam 2 hak (ilk yarı 1 + ikinci yarı 1). Reklamla çoğaltılmaz, herkeste eşit.
export type JokerType = "weekly" | "seasonal";

export type Joker = {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  type: JokerType;
};

export const JOKERS = [
  // --- HAFTALIK (reklam izleyerek, her hafta 1 tane) ---
  { id: "bus", name: "Otobüsü Çek", desc: "Bu hafta defans ve kalecilerin puanı +%50", emoji: "🛡️", type: "weekly" },
  { id: "anatolia", name: "Anadolu Aslanı", desc: "Bu hafta dört büyükler dışındaki takımların oyuncularının puanı +%50", emoji: "🦁", type: "weekly" },
  { id: "fanfire", name: "Taraftar Ateşi", desc: "Tek takımdan en az 4 oyuncun varsa, o takımın oyuncuları bonus puan alır", emoji: "🔵", type: "weekly" },

  // --- SEZONLUK (sezonda 2 hak: ilk yarı 1 + ikinci yarı 1) ---
  { id: "captain3x", name: "Kaptan 3X", desc: "Kaptanın puanını 3 ile çarp", emoji: "👑", type: "seasonal" },
  { id: "bench", name: "Yedek Kulübesi", desc: "Yedek oyuncuların puanları da sayılır", emoji: "🪑", type: "seasonal" },
  { id: "derby", name: "Derbi Canavarı", desc: "Derbi haftasında derbide oynayan oyuncularının puanı 2 ile çarpılır", emoji: "🔥", type: "seasonal" },
] as const satisfies readonly Joker[];

export type JokerId = (typeof JOKERS)[number]["id"];

// Yardımcılar — store ve UI bunları kullanır
export const WEEKLY_JOKERS = JOKERS.filter((j) => j.type === "weekly");
export const SEASONAL_JOKERS = JOKERS.filter((j) => j.type === "seasonal");

export const SEASONAL_USES_PER_HALF = 1; // her sezonluk joker, her yarıda 1 kez
export const MAX_AD_BUDGET = 5;          // reklamla eklenebilecek max bütçe (M€)
