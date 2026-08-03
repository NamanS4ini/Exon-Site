import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDocAdjacentPages } from "@/lib/docs-config";

interface DocsNavigationProps {
  slug: string;
}

export function DocsNavigation({ slug }: DocsNavigationProps) {
  const { prev, next } = getDocAdjacentPages(slug);

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Documentation page navigation"
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        marginTop: "3rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          id={`nav-prev-${prev.slug}`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            padding: "0.875rem 1.25rem",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            transition: "all 150ms ease",
            flex: 1,
            maxWidth: "48%",
            textDecoration: "none",
          }}
          className="card-hover-effect"
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            <ChevronLeft size={13} />
            Previous
          </span>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          id={`nav-next-${next.slug}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.2rem",
            padding: "0.875rem 1.25rem",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            transition: "all 150ms ease",
            flex: 1,
            maxWidth: "48%",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            Next
            <ChevronRight size={13} />
          </span>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
