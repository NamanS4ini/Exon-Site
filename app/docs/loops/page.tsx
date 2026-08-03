import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Loops",
  description: "when (while) and for loops in Exon.",
};

export default function LoopsPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Loops</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Iterate over code blocks with <code>when</code> and <code>for</code> loops.
        </p>
      </div>

      <h2>when Loop (While)</h2>
      <p>
        The <code>when</code> statement is Exon&apos;s <code>while</code> loop. It evaluates a condition before each iteration.
        As long as the condition is truthy, the body executes.
      </p>
      <CodeBlock
        code={`set i = 1;
when (i <= 5) {
  out "Count: " + i;
  i = i + 1;
}`}
        filename="when_loop.exon"
      />

      <h2>for Loop</h2>
      <p>
        The <code>for</code> loop provides standard C-style iteration with an initializer, condition, and increment step.
      </p>
      <CodeBlock
        code={`for (set i = 0; i < 3; i = i + 1) {
  out "Iteration: " + i;
}`}
        filename="for_loop.exon"
      />

      <h2>Desugaring Architecture</h2>
      <p>
        In Exon&apos;s parser, <code>for</code> loops are <strong>syntactic sugar</strong>. The parser automatically transforms
        a <code>for</code> loop into a <code>when</code> loop inside an enclosing block environment during parsing:
      </p>
      <CodeBlock
        code={`// Parser desugars this for loop:
// for (initializer; condition; increment) body

// Into this equivalent structure:
{
  initializer;
  when (condition) {
    body;
    increment;
  }
}`}
        filename="desugar.exon"
      />

      <DocsNavigation slug="loops" />
    </article>
  );
}
