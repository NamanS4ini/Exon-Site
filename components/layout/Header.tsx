import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Zap, BookOpen, Code2, GitFork } from "lucide-react";

export function Header() {
  return (
    <header
      id="site-header"
      className="glass"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "var(--header-height)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="container"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          id="site-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--text-primary)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: "var(--radius-sm)",
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              color: "#fff",
            }}
          >
            <Zap size={16} strokeWidth={2.5} fill="currentColor" />
          </span>
          <span className="gradient-text">Exon</span>
        </Link>

        {/* Desktop nav */}
        <nav
          id="desktop-nav"
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <Link href="/docs/introduction" className="btn btn-ghost btn-sm">
            <BookOpen size={15} />
            Docs
          </Link>
          <Link href="/playground" className="btn btn-ghost btn-sm">
            <Code2 size={15} />
            Playground
          </Link>
          <a
            href="https://github.com/namansaini1463/exon-interpreter"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            id="github-link"
          >
            <GitFork size={15} />
            GitHub
          </a>
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ThemeToggle />
          <Link href="/playground" className="btn btn-primary btn-sm" id="header-cta">
            Try It
          </Link>
        </div>
      </div>
    </header>
  );
}
