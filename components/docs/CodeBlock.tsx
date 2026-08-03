"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Play, ExternalLink, Terminal, AlertCircle, Clock } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  /** If provided, highlights keywords/strings/numbers/comments */
  highlight?: boolean;
  /** If true, adds interactive Run button and execution output panel (default: true for exon language) */
  runnable?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Tokenises Exon source code into HTML spans for syntax highlighting. */
function tokenise(code: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const lines = code.split("\n");

  const KEYWORDS = new Set([
    "set", "out", "if", "else", "for", "when", "return",
    "fxn", "class", "this", "super", "and", "or",
    "true", "false", "nil",
  ]);
  const BUILTINS = new Set(["clock", "len", "str", "type"]);

  lines.forEach((line, li) => {
    let i = 0;
    while (i < line.length) {
      // Line comment
      if (line[i] === "/" && line[i + 1] === "/") {
        tokens.push(
          <span key={`${li}-${i}`} className="token-comment">
            {line.slice(i)}
          </span>
        );
        i = line.length;
        continue;
      }
      // String literal
      if (line[i] === '"') {
        let j = i + 1;
        while (j < line.length && line[j] !== '"') j++;
        tokens.push(
          <span key={`${li}-${i}`} className="token-string">
            {line.slice(i, j + 1)}
          </span>
        );
        i = j + 1;
        continue;
      }
      // Number literal
      if (/[0-9]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[0-9.]/.test(line[j])) j++;
        tokens.push(
          <span key={`${li}-${i}`} className="token-number">
            {line.slice(i, j)}
          </span>
        );
        i = j;
        continue;
      }
      // Identifier / keyword / builtin
      if (/[a-zA-Z_]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
        const word = line.slice(i, j);
        if (KEYWORDS.has(word)) {
          tokens.push(
            <span key={`${li}-${i}`} className="token-keyword">
              {word}
            </span>
          );
        } else if (BUILTINS.has(word)) {
          tokens.push(
            <span key={`${li}-${i}`} className="token-builtin">
              {word}
            </span>
          );
        } else {
          tokens.push(word);
        }
        i = j;
        continue;
      }
      // Plain character
      tokens.push(line[i]);
      i++;
    }
    if (li < lines.length - 1) tokens.push("\n");
  });

  return tokens;
}

export function CodeBlock({
  code,
  language = "exon",
  filename,
  highlight = true,
  runnable = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const isExonCode = language === "exon" && runnable;

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function runCode() {
    setIsRunning(true);
    setOutput(null);
    setErrorDetails(null);
    setHasRun(true);
    const startTime = performance.now();

    try {
      const res = await fetch(`${API_BASE_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: code }),
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (!res.ok) {
        setExecutionTime(elapsed);
        setErrorDetails(`API Error (${res.status}): ${res.statusText}`);
        setIsRunning(false);
        return;
      }

      const data = await res.json();
      setExecutionTime(data.executionTimeMs || elapsed);

      if (data.success) {
        setOutput(data.output || "(Program completed with no output)");
      } else {
        setOutput(data.output || "");
        if (data.errors && data.errors.length > 0) {
          const formatted = data.errors
            .map((err: { line: number; message: string; type: string }) => `[Line ${err.line}] ${err.type}: ${err.message}`)
            .join("\n");
          setErrorDetails(formatted);
        } else {
          setErrorDetails("Execution failed.");
        }
      }
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - startTime);
      setExecutionTime(elapsed);
      const message = err instanceof Error ? err.message : String(err);
      setErrorDetails(`Connection Error: Ensure Exon API is running at ${API_BASE_URL}.\nDetail: ${message}`);
    } finally {
      setIsRunning(false);
    }
  }

  const content = highlight && language === "exon" ? tokenise(code) : code;

  return (
    <div className="code-block" style={{ margin: "1.25rem 0", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-default)", overflow: "hidden" }}>
      {/* Header Toolbar */}
      <div className="code-block-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.4rem 0.85rem", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-subtle)" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {filename ?? language}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {isExonCode && (
            <>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="btn btn-primary btn-sm"
                style={{ padding: "0.2rem 0.6rem", gap: "0.3rem", fontSize: "0.75rem" }}
              >
                <Play size={12} fill="currentColor" />
                {isRunning ? "Running..." : "Run"}
              </button>
              <Link
                href={`/playground#${encodeURIComponent(code)}`}
                className="btn btn-ghost btn-sm"
                style={{ padding: "0.2rem 0.5rem", gap: "0.3rem", fontSize: "0.75rem", color: "var(--text-muted)" }}
                title="Open in Playground"
              >
                Playground <ExternalLink size={11} />
              </Link>
            </>
          )}
          <button
            onClick={copy}
            aria-label="Copy code to clipboard"
            className="btn btn-ghost btn-sm"
            style={{ padding: "0.2rem 0.5rem", gap: "0.35rem", fontSize: "0.75rem", color: "var(--text-muted)" }}
          >
            {copied ? (
              <>
                <Check size={12} />
                Copied
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Source Code */}
      <pre style={{ padding: "1.25rem 1.5rem", overflowX: "auto", margin: 0, background: "var(--code-bg)" }}>
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", lineHeight: 1.7 }}>
          {content}
        </code>
      </pre>

      {/* Interactive Execution Output Panel */}
      {hasRun && (
        <div
          style={{
            borderTop: "1px solid var(--border-default)",
            background: "var(--bg-base)",
            padding: "0.85rem 1.25rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.825rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.75rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 600 }}>
              <Terminal size={12} />
              Execution Output
            </span>
            {executionTime !== null && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Clock size={11} />
                {executionTime} ms
              </span>
            )}
          </div>

          {output && (
            <pre style={{ margin: 0, color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
              {output}
            </pre>
          )}

          {errorDetails && (
            <pre style={{ margin: "0.4rem 0 0", color: "#f87171", whiteSpace: "pre-wrap", background: "rgba(248,113,113,0.08)", padding: "0.6rem 0.85rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <AlertCircle size={12} style={{ display: "inline", marginRight: "0.3rem" }} />
              {errorDetails}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
