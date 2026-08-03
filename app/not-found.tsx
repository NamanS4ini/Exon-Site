import Link from "next/link";
import { Zap, ArrowLeft, Code2 } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="animate-fade-in" style={{ position: "relative", maxWidth: "480px" }}>
        <div
          className="animate-float"
          style={{
            fontSize: "7rem",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.06em",
            marginBottom: "1rem",
          }}
        >
          <span className="gradient-text">404</span>
        </div>

        <div
          className="badge badge-brand"
          style={{ marginBottom: "1rem", justifyContent: "center" }}
        >
          <Zap size={11} fill="currentColor" />
          Page not found
        </div>

        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
          This page doesn&apos;t exist
        </h1>

        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
          The page you&apos;re looking for may have been moved or deleted. Try the documentation
          or open the playground to write some Exon code.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-secondary" id="not-found-home">
            <ArrowLeft size={16} />
            Back to home
          </Link>
          <Link href="/playground" className="btn btn-primary" id="not-found-playground">
            <Code2 size={16} />
            Try the Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
