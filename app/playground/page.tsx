"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCcw, Copy, Share2, Terminal, Check, AlertCircle, Clock, Zap } from "lucide-react";

// Dynamically import Monaco Editor to avoid SSR hydration issues
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const EXAMPLES = [
  {
    id: "hello",
    name: "Hello World",
    code: `// Welcome to Exon Playground!
set greeting = "Hello, Exon!";
out greeting;
out "Execution powered by Java backend API.";`,
  },
  {
    id: "fibonacci",
    name: "Fibonacci Sequence",
    code: `fxn fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

out "Calculating Fibonacci numbers:";
for (set i = 0; i < 10; i = i + 1) {
  out "fib(" + i + ") = " + fibonacci(i);
}`,
  },
  {
    id: "fizzbuzz",
    name: "FizzBuzz",
    code: `for (set i = 1; i <= 15; i = i + 1) {
  if (i - (i / 15) * 15 == 0) {
    out "FizzBuzz";
  } else {
    if (i - (i / 3) * 3 == 0) {
      out "Fizz";
    } else {
      if (i - (i / 5) * 5 == 0) {
        out "Buzz";
      } else {
        out i;
      }
    }
  }
}`,
  },
  {
    id: "counter",
    name: "Closure Counter",
    code: `fxn makeCounter() {
  set count = 0;
  fxn counter() {
    count = count + 1;
    return count;
  }
  return counter;
}

set c1 = makeCounter();
out "c1: " + c1(); // 1
out "c1: " + c1(); // 2

set c2 = makeCounter();
out "c2: " + c2(); // 1 (independent state)`,
  },
  {
    id: "oop",
    name: "Classes & Inheritance",
    code: `class Shape {
  describe() {
    out "I am a generic shape.";
  }
}

class Circle < Shape {
  init(radius) {
    this.radius = radius;
  }
  describe() {
    super.describe();
    out "I am a Circle with radius " + this.radius;
  }
}

set c = Circle(7);
c.describe();`,
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function PlaygroundPage() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [selectedExample, setSelectedExample] = useState("hello");
  const [output, setOutput] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "timeout">("idle");
  const [copied, setCopied] = useState(false);

  // Read code from URL hash on load if present
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      try {
        const decoded = decodeURIComponent(window.location.hash.substring(1));
        if (decoded) setCode(decoded);
      } catch (e) {
        // ignore invalid hash
      }
    }
  }, []);

  const handleExampleChange = (id: string) => {
    setSelectedExample(id);
    const found = EXAMPLES.find((ex) => ex.id === id);
    if (found) {
      setCode(found.code);
      setOutput("");
      setErrorDetails(null);
      setStatus("idle");
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setStatus("idle");
    setOutput("");
    setErrorDetails(null);
    const startTime = performance.now();

    try {
      const res = await fetch(`${API_BASE_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: code }),
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (!res.ok) {
        if (res.status === 429) {
          setStatus("error");
          setErrorDetails("Rate limit exceeded: 30 requests per minute limit.");
        } else {
          setStatus("error");
          setErrorDetails(`HTTP ${res.status}: ${res.statusText}`);
        }
        setExecutionTime(elapsed);
        setIsRunning(false);
        return;
      }

      const data = await res.json();
      setExecutionTime(data.executionTimeMs || elapsed);

      if (data.success) {
        setStatus("success");
        setOutput(data.output || "(Program completed with no output)");
      } else {
        setStatus("error");
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
      setStatus("error");
      const message = err instanceof Error ? err.message : String(err);
      setErrorDetails(`Connection Error: Could not connect to Exon API at ${API_BASE_URL}.\nEnsure Spring Boot API is running.\nDetail: ${message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/playground#${encodeURIComponent(code)}`;
      navigator.clipboard.writeText(url);
      alert("Shareable link copied to clipboard!");
    }
  };

  const handleReset = () => {
    const found = EXAMPLES.find((ex) => ex.id === selectedExample);
    if (found) setCode(found.code);
    setOutput("");
    setErrorDetails(null);
    setStatus("idle");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "calc(100vh - var(--header-height))" }}>
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.6rem 1.25rem",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-default)",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Left: Example dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Example:</label>
          <select
            value={selectedExample}
            onChange={(e) => handleExampleChange(e.target.value)}
            style={{
              padding: "0.35rem 0.75rem",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            {EXAMPLES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        {/* Center: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={handleRun} disabled={isRunning} className="btn btn-primary btn-sm" id="playground-run-btn">
            <Play size={14} fill="currentColor" />
            {isRunning ? "Running..." : "Run Code"}
          </button>
          <button onClick={handleReset} className="btn btn-ghost btn-sm" title="Reset to initial example">
            <RotateCcw size={14} />
            Reset
          </button>
          <button onClick={handleCopy} className="btn btn-ghost btn-sm">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={handleShare} className="btn btn-ghost btn-sm" title="Share URL with encoded code">
            <Share2 size={14} />
            Share
          </button>
        </div>

        {/* Right: Status badge & execution time */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {executionTime !== null && (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={12} />
              {executionTime} ms
            </span>
          )}
          {status === "success" && (
            <span className="badge badge-success">
              <Check size={11} /> Success
            </span>
          )}
          {status === "error" && (
            <span className="badge" style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
              <AlertCircle size={11} /> Error
            </span>
          )}
        </div>
      </div>

      {/* ── Main Split View ─────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1, minHeight: 0 }}>
        {/* Left: Code Editor */}
        <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid var(--border-default)", background: "var(--code-bg)" }}>
          <div style={{ padding: "0.5rem 1rem", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            editor.exon
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                fontFamily: "var(--font-mono)",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>

        {/* Right: Output / Console */}
        <div style={{ display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
          <div style={{ padding: "0.5rem 1rem", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Terminal size={13} />
            Output Terminal
          </div>
          <div style={{ flex: 1, padding: "1.25rem", overflowY: "auto", fontFamily: "var(--font-mono)", fontSize: "0.875rem", lineHeight: 1.75 }}>
            {status === "idle" && !output && !errorDetails && (
              <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                Click &quot;Run Code&quot; to execute your Exon program.
              </div>
            )}
            {output && (
              <pre style={{ margin: 0, color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
                {output}
              </pre>
            )}
            {errorDetails && (
              <pre style={{ margin: "0.75rem 0 0", color: "#f87171", whiteSpace: "pre-wrap", background: "rgba(248,113,113,0.08)", padding: "0.875rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(248,113,113,0.2)" }}>
                {errorDetails}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
