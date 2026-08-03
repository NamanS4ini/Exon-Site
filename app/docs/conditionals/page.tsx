import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Conditionals",
  description: "if/else, logical and/or operators, and short-circuit evaluation in Exon.",
};

export default function ConditionalsPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Conditionals</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Branch control flow using <code>if</code>, <code>else</code>, <code>and</code>, and <code>or</code>.
        </p>
      </div>

      <h2>if / else Statement</h2>
      <p>
        The <code>if</code> statement evaluates a condition. If the condition is truthy, the then-branch executes.
        An optional <code>else</code> branch executes if the condition is falsy.
      </p>
      <CodeBlock
        code={`set score = 85;

if (score >= 90) {
  out "Grade: A";
} else {
  if (score >= 80) {
    out "Grade: B";
  } else {
    out "Grade: C";
  }
}`}
        filename="if_else.exon"
      />

      <h2>Logical Operators</h2>
      <p>
        Exon uses keywords <code>and</code> and <code>or</code> for logical operations.
      </p>

      <h3>Logical AND</h3>
      <p>
        Returns the left operand if it is falsy; otherwise returns the right operand.
      </p>
      <CodeBlock
        code={`out true and "yes";  // "yes"
out false and "yes"; // false
out nil and 100;     // nil`}
        filename="and.exon"
      />

      <h3>Logical OR</h3>
      <p>
        Returns the left operand if it is truthy; otherwise returns the right operand.
      </p>
      <CodeBlock
        code={`out "default" or "fallback"; // "default"
out nil or "fallback";       // "fallback"
out false or 42;             // 42`}
        filename="or.exon"
      />

      <h2>Short-Circuit Evaluation</h2>
      <p>
        Logical expressions evaluation stops as soon as the outcome is determined:
      </p>
      <ul>
        <li>In <code>A and B</code>, if <code>A</code> is falsy, <code>B</code> is never evaluated.</li>
        <li>In <code>A or B</code>, if <code>A</code> is truthy, <code>B</code> is never evaluated.</li>
      </ul>

      <DocsNavigation slug="conditionals" />
    </article>
  );
}
