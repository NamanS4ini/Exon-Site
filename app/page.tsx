import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  Code2,
  Box,
  GitBranch,
  Layers,
  ArrowRight,
  GitFork,
  Lock,
  Cpu,
  FileCode,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Exon — The Programming Language",
  description:
    "Exon is a dynamically-typed, tree-walk interpreted programming language. Features variables, functions, closures, classes, and inheritance.",
};

/* ─── Inline animated code sample ──────────────────────────────────────────── */
const HERO_CODE = `fxn fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1)
       + fibonacci(n - 2);
}

class Sequence {
  init(limit) {
    this.limit = limit;
  }
  run() {
    for (set i = 0; i < this.limit;
         i = i + 1) {
      out fibonacci(i);
    }
  }
}

set seq = Sequence(10);
seq.run();`;

/* ─── Feature cards ─────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Code2 size={22} />,
    title: "Clean Syntax",
    desc: "Distinct keywords like set, fxn, out, and when make intent unmistakable at a glance.",
  },
  {
    icon: <Layers size={22} />,
    title: "First-class Functions",
    desc: "Functions are values. Store, pass, return, and capture them in closures.",
  },
  {
    icon: <Box size={22} />,
    title: "Full OOP",
    desc: "Classes with init, fields, methods, this, single inheritance, and super dispatch.",
  },
  {
    icon: <GitBranch size={22} />,
    title: "Lexical Scoping",
    desc: "Closures capture their enclosing scope exactly at definition time — no surprises.",
  },
  {
    icon: <Zap size={22} />,
    title: "Dynamic Typing",
    desc: "Variables hold any value. The interpreter resolves types at runtime, keeping code concise.",
  },
  {
    icon: <Lock size={22} />,
    title: "Static Resolution",
    desc: "A resolver pass catches scope errors before execution, so bugs surface early.",
  },
];

/* ─── Pipeline steps ─────────────────────────────────────────────────────────── */
const PIPELINE = [
  { icon: <FileCode size={18} />, label: "Source", desc: "Raw .exon text" },
  { icon: <Cpu size={18} />, label: "Scanner", desc: "Tokenise" },
  { icon: <GitBranch size={18} />, label: "Parser", desc: "Build AST" },
  { icon: <Layers size={18} />, label: "Resolver", desc: "Bind scopes" },
  { icon: <Zap size={18} />, label: "Interpreter", desc: "Evaluate tree" },
];

/* ─── Quick-start steps ─────────────────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Clone the repo",
    code: "git clone https://github.com/NamanS4ini/Exon-Site",
  },
  {
    n: "02",
    title: "Build the JAR",
    code: "./gradlew jar",
  },
  {
    n: "03",
    title: "Run a program",
    code: 'java -jar build/libs/exon-interpreter-1.0.0.jar hello.exon',
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ flex: 1 }}>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          padding: "6rem 0 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative" }}>
          <div className="responsive-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            {/* Left: text */}
            <div className="animate-fade-in">
              <div className="badge badge-brand" style={{ marginBottom: "1.25rem" }}>
                <Zap size={11} fill="currentColor" />
                v1.0 — Open Source
              </div>

              <h1 style={{ marginBottom: "1rem" }}>
                The{" "}
                <span className="gradient-text">Exon</span>
                <br />
                Programming
                <br />
                Language
              </h1>

              <p
                style={{
                  fontSize: "1.1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  maxWidth: "42ch",
                }}
              >
                A dynamically-typed, tree-walk interpreted language written in Java.
                Variables, functions, closures, classes, and inheritance — all from scratch.
              </p>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/docs/introduction" className="btn btn-primary btn-lg" id="hero-docs-cta">
                  Read the docs
                  <ArrowRight size={18} />
                </Link>
                <Link href="/playground" className="btn btn-secondary btn-lg" id="hero-playground-cta">
                  <Code2 size={18} />
                  Try Playground
                </Link>
              </div>
            </div>

            {/* Right: code sample */}
            <div
              className="animate-float"
              style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Fake browser chrome */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  background: "var(--bg-elevated)",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f87171" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34d399" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.5rem", fontFamily: "var(--font-mono)" }}>
                  fibonacci.exon
                </span>
              </div>
              <pre
                style={{
                  background: "var(--code-bg)",
                  padding: "1.5rem",
                  margin: 0,
                  overflowX: "auto",
                  fontSize: "0.8rem",
                  lineHeight: 1.75,
                  fontFamily: "var(--font-mono)",
                }}
              >
                <code>
                  {HERO_CODE.split(/\b/).map((part, i) => {
                    const KEYWORDS = new Set(["fxn", "if", "return", "class", "for", "set", "out", "this", "nil"]);
                    const BUILTINS = new Set(["fibonacci"]);
                    if (KEYWORDS.has(part)) return <span key={i} className="token-keyword">{part}</span>;
                    if (BUILTINS.has(part)) return <span key={i} className="token-function">{part}</span>;
                    if (/^[0-9]+$/.test(part)) return <span key={i} className="token-number">{part}</span>;
                    if (part.startsWith('"') && part.endsWith('"')) return <span key={i} className="token-string">{part}</span>;
                    return part;
                  })}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section
        id="features"
        style={{
          padding: "5rem 0",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2>Everything you need</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", maxWidth: "50ch", margin: "0.5rem auto 0" }}>
              Exon is a complete language. All features work together out of the box.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    background: "var(--brand-glow)",
                    border: "1px solid var(--border-brand)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-brand)",
                    marginBottom: "1rem",
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.4rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pipeline diagram ──────────────────────────────────────────────────── */}
      <section
        id="architecture"
        style={{ padding: "5rem 0", borderTop: "1px solid var(--border-subtle)" }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2>How it works</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Every Exon program passes through five stages.
            </p>
          </div>

          {/* Desktop horizontal pipeline */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              gap: 0,
              flexWrap: "wrap",
            }}
          >
            {PIPELINE.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1.5rem 2rem",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-lg)",
                    minWidth: 130,
                    textAlign: "center",
                    transition: "all 200ms ease",
                  }}
                  className="card"
                >
                  <span style={{ color: "var(--text-brand)" }}>{step.icon}</span>
                  <strong style={{ fontSize: "0.9rem" }}>{step.label}</strong>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{step.desc}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <ChevronRight
                    size={20}
                    style={{ color: "var(--text-muted)", margin: "0 -2px", flexShrink: 0 }}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/docs/architecture" className="btn btn-ghost" id="architecture-link">
              Explore the architecture →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Start ───────────────────────────────────────────────────────── */}
      <section
        id="quick-start"
        style={{
          padding: "5rem 0",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
        }}
      >
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
            <div>
              <h2>Get started in minutes</h2>
              <p style={{ color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.7 }}>
                Clone the repo, build the JAR, and run your first Exon program. No package manager
                required.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                <Link href="/docs/getting-started" className="btn btn-primary" id="quickstart-docs-cta">
                  Full setup guide
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://github.com/NamanS4ini/Exon-Site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  id="quickstart-github-cta"
                >
                  <GitFork size={16} />
                  View on GitHub
                </a>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    padding: "1rem 1.25rem",
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--text-brand)",
                      fontFamily: "var(--font-mono)",
                      marginTop: "0.1rem",
                    }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      {step.title}
                    </div>
                    <code
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--code-string)",
                        fontFamily: "var(--font-mono)",
                        wordBreak: "break-all",
                      }}
                    >
                      {step.code}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────────────────────── */}
      <section
        id="cta-banner"
        style={{
          padding: "5rem 0",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <span className="badge badge-brand" style={{ marginBottom: "1rem" }}>
            <Zap size={11} fill="currentColor" />
            Try it now — no install needed
          </span>
          <h2 style={{ marginBottom: "1rem" }}>
            Write Exon in the browser
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "46ch", margin: "0 auto 2rem" }}>
            The playground runs Exon in the cloud. Pick an example or write your own code, then hit
            Run.
          </p>
          <Link href="/playground" className="btn btn-primary btn-lg" id="cta-playground-btn">
            Open Playground
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
