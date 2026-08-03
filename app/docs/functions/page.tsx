import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Functions",
  description: "Declare functions with fxn, pass parameters, return values, and recursion in Exon.",
};

export default function FunctionsPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Functions</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Declare reusable blocks of code using the <code>fxn</code> keyword.
        </p>
      </div>

      <h2>Declaration</h2>
      <p>
        Functions are declared with <code>fxn</code>, followed by the function name, a parameter list in parentheses,
        and a block body.
      </p>
      <CodeBlock
        code={`fxn add(a, b) {
  return a + b;
}

out add(15, 27); // 42`}
        filename="function.exon"
      />

      <h2>Return Values</h2>
      <p>
        Use the <code>return</code> statement to exit a function early and return a value.
        If a function reaches the end of its body without executing a <code>return</code> statement, it returns <code>nil</code> automatically.
      </p>
      <CodeBlock
        code={`fxn checkPositive(num) {
  if (num > 0) return true;
  return false;
}

out checkPositive(10);  // true
out checkPositive(-5);  // false`}
        filename="return.exon"
      />

      <h2>Recursion</h2>
      <p>
        Functions in Exon can call themselves recursively.
      </p>
      <CodeBlock
        code={`fxn factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

out factorial(5); // 120`}
        filename="recursion.exon"
      />

      <h2>First-Class Functions</h2>
      <p>
        Functions are first-class values in Exon. You can store them in variables or pass them as parameters.
      </p>
      <CodeBlock
        code={`fxn applyTwice(fn, val) {
  return fn(fn(val));
}

fxn double(x) {
  return x * 2;
}

out applyTwice(double, 5); // 20`}
        filename="first_class.exon"
      />

      <DocsNavigation slug="functions" />
    </article>
  );
}
