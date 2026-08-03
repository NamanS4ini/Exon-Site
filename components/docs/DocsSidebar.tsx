"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/docs-config";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside
      id="docs-sidebar"
      aria-label="Documentation navigation"
      style={{
        width: "var(--sidebar-width)",
        flexShrink: 0,
        position: "sticky",
        top: "var(--header-height)",
        height: "calc(100vh - var(--header-height))",
        overflowY: "auto",
        padding: "1.5rem 0.75rem",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {DOCS_NAV.map((section) => (
        <div key={section.label} style={{ marginBottom: "1.5rem" }}>
          {/* Section label */}
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              padding: "0 0.75rem",
              marginBottom: "0.35rem",
            }}
          >
            {section.label}
          </p>

          {/* Section items */}
          <nav aria-label={`${section.label} section`}>
            {section.items.map((item) => {
              const href = `/docs/${item.slug}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={item.slug}
                  href={href}
                  className={`sidebar-link${isActive ? " active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      {/* Playground CTA */}
      <div
        style={{
          margin: "1rem 0.75rem 0",
          padding: "0.875rem",
          background: "var(--brand-glow)",
          border: "1px solid var(--border-brand)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
          Want to try Exon?
        </p>
        <Link
          href="/playground"
          className="btn btn-primary btn-sm"
          style={{ width: "100%", justifyContent: "center" }}
          id="sidebar-playground-cta"
        >
          Open Playground →
        </Link>
      </div>
    </aside>
  );
}
