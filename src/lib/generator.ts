// Cryptographically secure generation helpers (window.crypto only).
export const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};
const SIMILAR = /[il1Lo0OI|]/g;

export type Options = { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean; excludeSimilar: boolean };

/** Unbiased secure integer in [0, max) via rejection sampling. */
export function secureInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let v: number;
  do { crypto.getRandomValues(buf); v = buf[0]!; } while (v >= limit);
  return v % max;
}

export function buildPool(o: Options): string[] {
  const groups = (["upper", "lower", "numbers", "symbols"] as const)
    .filter((k) => o[k])
    .map((k) => (o.excludeSimilar ? SETS[k].replace(SIMILAR, "") : SETS[k]));
  return groups;
}

export function generatePassword(length: number, o: Options): string {
  const groups = buildPool(o);
  if (!groups.length) return "";
  const pool = groups.join("");
  // Guarantee at least one char from each selected set
  const chars = groups.map((g) => g[secureInt(g.length)]);
  while (chars.length < length) chars.push(pool[secureInt(pool.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, length).join("");
}

const WORDS = "acid alpha amber anchor atlas autumn binary bishop blade blaze border breeze bridge bronze cable canyon carbon castle cedar cipher circuit cobalt comet copper coral cosmic crystal delta desert drift echo ember falcon fiber flint forest fractal galaxy garnet glacier granite harbor hazel helix horizon hydra iron ivory jade jaguar jungle kernel lantern laser lemon lunar magnet maple marble matrix meadow meteor mint nebula neon nickel noble oasis obsidian ocean onyx orbit oxygen panda pixel planet plasma prism pulse quantum quartz radar raven reactor river rocket ruby saber shadow signal silver socket solar sonic spark sphinx storm summit tango thunder tiger titan token topaz tundra turbo vapor vector velvet vortex walrus willow wizard xenon yonder zenith zephyr".split(" ");

export function generatePassphrase(count = 4): string {
  return Array.from({ length: count }, () => WORDS[secureInt(WORDS.length)]).join("-");
}

export function entropyBits(length: number, o: Options, mode: "chars" | "phrase", words = 4): number {
  if (mode === "phrase") return words * Math.log2(WORDS.length);
  const size = buildPool(o).join("").length;
  return size ? length * Math.log2(size) : 0;
}

export function rating(bits: number) {
  if (bits < 40) return { label: "Weak", pct: Math.max(8, (bits / 128) * 100) };
  if (bits < 64) return { label: "Good", pct: (bits / 128) * 100 };
  if (bits < 100) return { label: "Strong", pct: (bits / 128) * 100 };
  return { label: "Uncrackable / Military-Grade", pct: 100 };
}
