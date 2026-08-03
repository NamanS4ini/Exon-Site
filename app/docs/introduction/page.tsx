import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Zap, GitBranch, Cpu, FileCode } from "lucide-react";

export const metadata: Metadata = {
  title: "Introduction",
  description: "What Exon is, how it works, and why it exists.",
};

export default function IntroductionPage() {
  return (
    <article className="docs-prose animate-fade-in">
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <span className="badge badge-brand" style={{ marginBottom: "0.75rem" }}>
          <Zap size={11} fill="currentColor" />
          Getting started
        </span>
        <h1>Introduction</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Exon is a dynamically-typed, tree-walk interpreted programming language written in Java.
          It features variables, functions, closures, classes, and inheritance.
        </p>
      </div>

      <h2>What is Exon?</h2>
      <p>
        Exon is a programming language designed to demonstrate how interpreters work. It uses the
        classic pipeline: source text flows through a scanner, a parser, a resolver, and finally an
        interpreter. Each stage transforms the program into a more structured form until the
        interpreter can evaluate it directly.
      </p>
      <p>
        Exon is <strong>dynamically typed</strong>. You do not declare the type of a variable. The
        interpreter determines the type at runtime. This keeps the syntax simple and the code
        readable.
      </p>

      {/* Architecture diagram */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          padding: "1.5rem",
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-default)",
          margin: "1.5rem 0",
          fontSize: "0.85rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        {[
          { icon: <FileCode size={14} />, label: "Source" },
          "→",
          { icon: <Cpu size={14} />, label: "Scanner" },
          "→",
          { icon: <GitBranch size={14} />, label: "Parser" },
          "→",
          { icon: <Cpu size={14} />, label: "Resolver" },
          "→",
          { icon: <Zap size={14} />, label: "Interpreter" },
          "→",
          { icon: null, label: "Output" },
        ].map((step, i) =>
          typeof step === "string" ? (
            <span key={i} style={{ color: "var(--text-muted)" }}>
              {step}
            </span>
          ) : (
            <span
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.3rem 0.7rem",
                background: "var(--bg-base)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                color: step.label === "Output" ? "var(--status-success)" : "var(--text-brand)",
              }}
            >
              {step.icon}
              {step.label}
            </span>
          )
        )}
      </div>

      <h2>The Pipeline</h2>

      <h3>1. Scanner (Lexical Analysis)</h3>
      <p>
        The scanner reads the raw source text one character at a time. It groups characters into
        tokens: keywords, identifiers, numbers, strings, and punctuation. It also reports errors
        for unknown characters.
      </p>

      <h3>2. Parser (Syntactic Analysis)</h3>
      <p>
        The parser takes the token stream and builds an Abstract Syntax Tree (AST). It implements a
        recursive-descent parser that mirrors the language grammar directly. Each grammar rule
        becomes a method. If the token stream does not match the grammar, the parser reports a syntax
        error.
      </p>

      <h3>3. Resolver (Static Analysis)</h3>
      <p>
        The resolver performs a single pass over the AST before execution. It resolves variable
        bindings, validates uses of <code>this</code> and <code>super</code>, and detects errors
        like reading a variable before its declaration inside the same scope.
      </p>

      <h3>4. Interpreter (Tree-Walk Evaluation)</h3>
      <p>
        The interpreter walks the AST and evaluates each node. It implements the Visitor pattern,
        where each AST node type has a corresponding <code>visit</code> method. The interpreter
        carries a chain of environments (scopes) that store variable bindings.
      </p>

      <h2>A Quick Example</h2>
      <p>Here is a complete Exon program that defines a function and calls it:</p>
      <CodeBlock
        code={`fxn greet(name) {
  out "Hello, " + name + "!";
}

greet("World");`}
        filename="hello.exon"
      />

      <p>
        The program prints <code>Hello, World!</code> to the console. The{" "}
        <code>fxn</code> keyword declares a function. The <code>out</code> statement prints a value.
        String concatenation uses <code>+</code>.
      </p>

      <h2>Design Goals</h2>
      <ul>
        <li>
          <strong>Readable syntax.</strong> Exon uses distinct keywords (<code>set</code>,{" "}
          <code>fxn</code>, <code>out</code>, <code>when</code>) so the language&apos;s intent is
          always clear.
        </li>
        <li>
          <strong>Full OOP support.</strong> Classes, inheritance, <code>this</code>, and{" "}
          <code>super</code> are all built into the language.
        </li>
        <li>
          <strong>First-class functions.</strong> Functions are values. You can store them in
          variables, pass them as arguments, and return them from other functions.
        </li>
        <li>
          <strong>No surprises.</strong> Lexical scoping and closures behave exactly as you expect.
        </li>
      </ul>

      <DocsNavigation slug="introduction" />
    </article>
  );
}
