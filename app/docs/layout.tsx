import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        minHeight: "calc(100vh - var(--header-height))",
      }}
    >
      {/* Sidebar — hidden on mobile via CSS */}
      <div className="sidebar-desktop">
        <DocsSidebar />
      </div>

      {/* Main content */}
      <main
        id="docs-content"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "2.5rem 2rem 4rem",
          maxWidth: "900px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
