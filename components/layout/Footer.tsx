import Link from "next/link";
import { Zap, GitFork, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="site-footer"
      style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
        padding: "3rem 0 2rem",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand column */}
          <div>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 26,
                  height: 26,
                  borderRadius: "var(--radius-sm)",
                  background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                  color: "#fff",
                }}
              >
                <Zap size={14} strokeWidth={2.5} fill="currentColor" />
              </span>
              <span className="gradient-text">Exon</span>
            </Link>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
              A tree-walk interpreter written in Java. Built for learning compiler internals.
            </p>
          </div>

          {/* Resources */}
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.8rem", marginBottom: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Resources
            </p>
            <nav aria-label="Footer resources" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <Link href="/docs/introduction" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Documentation</Link>
              <Link href="/playground" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Playground</Link>
              <Link href="/docs/examples" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Examples</Link>
              <Link href="/docs/reference" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Language Reference</Link>
            </nav>
          </div>

          {/* Language */}
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.8rem", marginBottom: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Language
            </p>
            <nav aria-label="Footer language" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <Link href="/docs/variables" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Variables</Link>
              <Link href="/docs/functions" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Functions</Link>
              <Link href="/docs/classes" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Classes</Link>
              <Link href="/docs/closures" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Closures</Link>
            </nav>
          </div>

          {/* Project */}
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.8rem", marginBottom: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Project
            </p>
            <nav aria-label="Footer project" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <a
                href="https://github.com/namansaini1463/exon-interpreter"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.875rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <GitFork size={13} /> GitHub <ExternalLink size={11} />
              </a>
              <Link href="/docs/architecture" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Architecture</Link>
              <Link href="/docs/future" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Roadmap</Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Built by{" "}
            <a
              href="https://github.com/namansaini1463"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-brand)" }}
            >
              Naman Saini
            </a>{" "}
            · MIT License
          </p>
          <span className="badge badge-brand" style={{ fontSize: "0.7rem" }}>
            <Zap size={10} fill="currentColor" />
            Exon v1.0
          </span>
        </div>
      </div>
    </footer>
  );
}
