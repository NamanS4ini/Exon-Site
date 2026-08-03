"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  /** If provided, highlights keywords/strings/numbers/comments */
  highlight?: boolean;
}

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

export function CodeBlock({ code, language = "exon", filename, highlight = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const content = highlight && language === "exon" ? tokenise(code) : code;

  return (
    <div className="code-block" style={{ margin: "1.25rem 0" }}>
      {/* Header */}
      <div className="code-block-header">
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {filename ?? language}
        </span>
        <button
          onClick={copy}
          aria-label="Copy code to clipboard"
          className="btn btn-ghost btn-sm"
          style={{ padding: "0.2rem 0.5rem", gap: "0.35rem", fontSize: "0.75rem" }}
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

      {/* Code */}
      <pre style={{ padding: "1.25rem 1.5rem", overflowX: "auto", margin: 0 }}>
        <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", lineHeight: 1.7 }}>
          {content}
        </code>
      </pre>
    </div>
  );
}
