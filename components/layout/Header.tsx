"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "@/components/docs/SearchModal";
import { BookOpen, Code2, GitFork, Search, Menu, X } from "lucide-react";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-sm mobile-menu-btn"
              style={{ padding: "0.4rem", display: "none" }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="mobile-nav-panel animate-fade-in"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--bg-surface)",
              borderBottom: "1px solid var(--border-default)",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Link
              href="/docs/introduction"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: "flex-start", gap: "0.5rem" }}
            >
              <BookOpen size={16} />
              Documentation
            </Link>
            <Link
              href="/playground"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: "flex-start", gap: "0.5rem" }}
            >
              <Code2 size={16} />
              Interactive Playground
            </Link>
            <a
              href="https://github.com/NamanS4ini/Exon-Site"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: "flex-start", gap: "0.5rem" }}
            >
              <GitFork size={16} />
              GitHub Repository
            </a>
          </div>
        )}
      </header>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
