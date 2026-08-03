import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Architecture",
  description: "Exon interpreter internal architecture, Visitor pattern, AST nodes, and resolution pass.",
};

export default function ArchitecturePage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Architecture</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Internal design of the Java tree-walk interpreter.
        </p>
      </div>

      <h2>AST & Visitor Pattern</h2>
      <p>
        Exon separates syntax tree node definitions from the algorithms that operate on them using the <strong>Visitor pattern</strong>.
        The AST generator generates classes for Expressions (<code>Expr</code>) and Statements (<code>Stmt</code>).
      </p>
      <CodeBlock
        code={`public abstract class Expr {
    public interface Visitor<R> {
        R visitBinaryExpr(Binary expr);
        R visitGroupingExpr(Grouping expr);
        R visitLiteralExpr(Literal expr);
        R visitVariableExpr(Variable expr);
        R visitCallExpr(Call expr);
        R visitGetExpr(Get expr);
        R visitSetExpr(Set expr);
        R visitThisExpr(This expr);
        R visitSuperExpr(Super expr);
    }
    public abstract <R> R accept(Visitor<R> visitor);
}`}
        filename="Expr.java"
      />

      <h2>Pipeline Components</h2>
      <ul>
        <li><code>Scanner</code> — Converts character stream into a <code>List&lt;Token&gt;</code>.</li>
        <li><code>Parser</code> — Recursive descent parser building <code>List&lt;Stmt&gt;</code>.</li>
        <li><code>Resolver</code> — Walks the AST and computes variable depth bindings for <code>Interpreter</code>.</li>
        <li><code>Interpreter</code> — Evaluates statements and expressions, holding the active <code>Environment</code> stack.</li>
        <li><code>ExonEngine</code> — Thread-safe execution entry point producing immutable <code>ExonResult</code>.</li>
      </ul>

      <DocsNavigation slug="architecture" />
    </article>
  );
}
