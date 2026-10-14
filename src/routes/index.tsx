import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Check, Copy, RefreshCw, ShieldCheck, Terminal, KeyRound, AlertTriangle } from "lucide-react";
import { entropyBits, generatePassphrase, generatePassword, rating, type Options } from "@/lib/generator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CipherVault — Secure Password Generator" },
      { name: "description", content: "Cryptographically secure password and passphrase generator with live entropy meter." },
      { property: "og:title", content: "CipherVault — Secure Password Generator" },
      { property: "og:description", content: "Generate uncrackable passwords and passphrases in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TOGGLES: { key: keyof Options; label: string; hint: string }[] = [
  { key: "upper", label: "Uppercase", hint: "A-Z" },
  { key: "lower", label: "Lowercase", hint: "a-z" },
  { key: "numbers", label: "Numbers", hint: "0-9" },
  { key: "symbols", label: "Symbols", hint: "!@#$%^&*" },
  { key: "excludeSimilar", label: "Exclude similar", hint: "i l 1 L o 0 O" },
];

function Index() {
  const [mode, setMode] = useState<"chars" | "phrase">("chars");
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState<Options>({ upper: true, lower: true, numbers: true, symbols: true, excludeSimilar: false });
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  const noSets = mode === "chars" && !opts.upper && !opts.lower && !opts.numbers && !opts.symbols;

  const regenerate = useCallback(() => {
    if (noSets) return setValue("");
    setValue(mode === "phrase" ? generatePassphrase(4) : generatePassword(length, opts));
  }, [mode, length, opts, noSets]);

  useEffect(() => { regenerate(); }, [regenerate]);

  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const bits = noSets ? 0 : entropyBits(length, opts, mode);
  const r = rating(bits);
  const setLen = (n: number) => setLength(Math.min(64, Math.max(6, Number.isFinite(n) ? n : 6)));

  return (
    <main className="cyber-grid min-h-screen px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary glow-primary">
              <Terminal size={22} />
            </div>
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-[0.2em] text-foreground">CIPHERVAULT</h1>
              <p className="font-mono text-xs text-muted-foreground">$ ./generate --secure</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/40 bg-warn/10 px-3 py-1 font-mono text-xs text-warn">
            <ShieldCheck size={14} /> Cryptographically Secure
          </span>
        </header>

        <section className="glass-card rounded-2xl p-5 sm:p-7">
          {/* Mode tabs */}
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-border bg-background/60 p-1 font-mono text-sm">
            {(["chars", "phrase"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`rounded-md py-2 transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {m === "chars" ? "Random Characters" : "Passphrase"}
              </button>
            ))}
          </div>

          {/* Output */}
          <div className="relative rounded-xl border border-primary/30 bg-background/80 p-4 glow-primary">
            <div className="flex items-center gap-3">
              <p className="min-h-[2.5rem] flex-1 break-all font-mono text-lg text-primary sm:text-2xl">
                {value || <span className="text-muted-foreground">— no output —</span>}
              </p>
              <button onClick={regenerate} disabled={noSets} aria-label="Regenerate"
                className="rounded-md p-2 text-muted-foreground transition hover:rotate-180 hover:text-primary disabled:opacity-30 duration-500">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
          <div className="relative mt-3">
            <button onClick={copy} disabled={!value}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-mono font-semibold transition active:scale-[0.98] disabled:opacity-40 ${copied ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground hover:brightness-110"}`}>
              {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>

          {/* Strength */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between font-mono text-xs">
              <span className="text-muted-foreground">ENTROPY <span className="text-foreground">{bits.toFixed(0)} bits</span></span>
              <span className="rounded border border-warn/40 bg-warn/10 px-2 py-0.5 text-warn">{noSets ? "—" : r.label}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-warn transition-all duration-500" style={{ width: `${noSets ? 0 : r.pct}%` }} />
            </div>
          </div>

          {mode === "chars" ? (
            <>
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <label htmlFor="len" className="text-sm text-muted-foreground">Character length</label>
                  <input type="number" min={6} max={64} value={length} onChange={(e) => setLen(parseInt(e.target.value))}
                    className="w-16 rounded-md border border-border bg-background px-2 py-1 text-center font-mono text-primary focus:border-primary focus:outline-none" />
                </div>
                <input id="len" type="range" min={6} max={64} value={length} onChange={(e) => setLen(+e.target.value)} className="cyber-range w-full" />
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {TOGGLES.map((t) => (
                  <button key={t.key} onClick={() => setOpts((o) => ({ ...o, [t.key]: !o[t.key] }))}
                    className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-4 py-3 text-left transition hover:border-primary/50">
                    <span>
                      <span className="block text-sm text-foreground">{t.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">{t.hint}</span>
                    </span>
                    <span className={`relative h-5 w-9 rounded-full transition ${opts[t.key] ? "bg-primary" : "bg-muted"}`}>
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all ${opts[t.key] ? "left-[1.125rem]" : "left-0.5"}`} />
                    </span>
                  </button>
                ))}
              </div>
              {noSets && (
                <p className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangle size={16} /> Select at least one character set to generate a password.
                </p>
              )}
            </>
          ) : (
            <p className="mt-7 flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <KeyRound size={16} className="text-primary" /> 4 random words, hyphen-separated — easy to remember, hard to crack.
            </p>
          )}
        </section>
        <p className="mt-6 text-center font-mono text-xs text-muted-foreground">Generated locally via window.crypto — nothing leaves your device.</p>
      </div>
    </main>
  );
}
