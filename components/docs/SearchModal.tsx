"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, ArrowRight } from "lucide-react";
import { DOCS_NAV } from "@/lib/docs-config";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten nav items
  const allItems = DOCS_NAV.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.label }))
  );

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 6);

  const handleSelect = (slug: string) => {
    router.push(`/docs/${slug}`);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "540px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.75rem 1rem",
            borderBottom: "1px solid var(--border-subtle)",
            gap: "0.75rem",
          }}
        >
          <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
              fontFamily: "var(--font-sans)",
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.2rem",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results list */}
        <div style={{ maxHeight: "320px", overflowY: "auto", padding: "0.5rem" }}>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.slug}
                onClick={() => handleSelect(item.slug)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "background var(--transition-fast)",
                }}
                className="card-interactive"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <BookOpen size={15} style={{ color: "var(--text-brand)" }} />
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {item.category}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
              </div>
            ))
          ) : (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
              No matching pages found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
