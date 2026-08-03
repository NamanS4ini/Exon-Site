"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "@/components/docs/SearchModal";
import { BookOpen, Code2, GitFork, Search } from "lucide-react";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
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
              gap: "0.6rem",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--text-primary)",
            }}
          >
            <Image
              src="/icon.png"
              alt="Exon logo"
              width={28}
              height={28}
              style={{ borderRadius: "var(--radius-sm)", objectFit: "contain" }}
            />
            <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>Exon</span>
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
              href="https://github.com/NamanS4ini/Exon-Site"
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
            <button
              onClick={() => setSearchOpen(true)}
              className="btn btn-ghost btn-sm"
              style={{ gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem" }}
              title="Search documentation (Cmd+K)"
            >
              <Search size={14} />
              <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>⌘K</span>
            </button>
            <ThemeToggle />
            <Link href="/playground" className="btn btn-primary btn-sm" id="header-cta">
              Try It
            </Link>
          </div>
        </div>
      </header>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
