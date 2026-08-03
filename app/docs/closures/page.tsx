import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Closures",
  description: "Lexical closures and state encapsulation in Exon.",
};

export default function ClosuresPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Closures</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Encapsulate private state using lexical closures.
        </p>
      </div>

      <h2>What is a Closure?</h2>
      <p>
        A <strong>closure</strong> is a function that retains access to variables from its surrounding lexical scope,
        even after the outer function has finished executing.
      </p>

      <h2>Counter Factory Pattern</h2>
      <p>
        Here is a classic example of creating an encapsulated counter using closures:
      </p>
      <CodeBlock
        code={`fxn makeCounter() {
  set count = 0;
  fxn counter() {
    count = count + 1;
    return count;
  }
  return counter;
}

set counterA = makeCounter();
set counterB = makeCounter();

out counterA(); // 1
out counterA(); // 2
out counterB(); // 1 (independent state!)`}
        filename="closure_counter.exon"
      />

      <h2>Environment Chain</h2>
      <p>
        When an inner function is created, the Exon interpreter holds a reference to the <code>Environment</code> active
        at definition time. Variable resolution walks up this environment chain to locate variables declared in outer scopes.
      </p>

      <DocsNavigation slug="closures" />
    </article>
  );
}
