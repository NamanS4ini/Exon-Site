"use client";

import { useState } from "react";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { BookOpen, X } from "lucide-react";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileDocsNavOpen, setMobileDocsNavOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        minHeight: "calc(100vh - var(--header-height))",
        position: "relative",
      }}
    >
      {/* Sidebar — desktop */}
      <div className="sidebar-desktop">
        <DocsSidebar />
      </div>

      {/* Main content */}
      <main
        id="docs-content"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "2rem 1.5rem 4rem",
          maxWidth: "900px",
        }}
      >
        {/* Mobile Sidebar Toggle Button */}
        <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center" }} className="mobile-menu-btn">
          <button
            onClick={() => setMobileDocsNavOpen(!mobileDocsNavOpen)}
            className="btn btn-ghost btn-sm"
            style={{ border: "1px solid var(--border-default)", gap: "0.4rem", fontSize: "0.8rem" }}
          >
            {mobileDocsNavOpen ? <X size={15} /> : <BookOpen size={15} />}
            {mobileDocsNavOpen ? "Close Menu" : "Documentation Menu"}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileDocsNavOpen && (
          <div
            className="mobile-docs-menu animate-fade-in"
            style={{
              position: "fixed",
              inset: 0,
              top: "var(--header-height)",
              background: "var(--bg-surface)",
              zIndex: 40,
              overflowY: "auto",
              padding: "1rem",
            }}
            onClick={() => setMobileDocsNavOpen(false)}
          >
            <DocsSidebar />
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
