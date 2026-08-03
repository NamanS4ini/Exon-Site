import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Expressions",
  description: "Arithmetic, comparison, logical, string concatenation, and grouping in Exon.",
};

export default function ExpressionsPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Expressions</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Values, operators, precedence, and grouping.
        </p>
      </div>

      <h2>Arithmetic Operators</h2>
      <p>
        Exon supports standard binary arithmetic operators for numbers:
      </p>
      <table>
        <thead>
          <tr>
            <th>Operator</th>
            <th>Description</th>
            <th>Example</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>+</code></td><td>Addition</td><td><code>10 + 5</code></td><td><code>15</code></td></tr>
          <tr><td><code>-</code></td><td>Subtraction</td><td><code>10 - 5</code></td><td><code>5</code></td></tr>
          <tr><td><code>*</code></td><td>Multiplication</td><td><code>10 * 5</code></td><td><code>50</code></td></tr>
          <tr><td><code>/</code></td><td>Division</td><td><code>10 / 4</code></td><td><code>2.5</code></td></tr>
        </tbody>
      </table>

      <h2>Unary Operators</h2>
      <p>
        Exon has two prefix unary operators:
      </p>
      <ul>
        <li><code>-</code> negates a number.</li>
        <li><code>!</code> inverts the truthiness of an expression.</li>
      </ul>
      <CodeBlock
        code={`set num = 42;
out -num;     // -42

out !true;    // false
out !nil;     // true
out !"text";  // false (strings are truthy)`}
        filename="unary.exon"
      />

      <h2>Comparison Operators</h2>
      <p>
        Comparison operators evaluate to booleans (<code>true</code> or <code>false</code>):
      </p>
      <CodeBlock
        code={`out 5 > 3;    // true
out 5 >= 5;   // true
out 2 < 1;    // false
out 2 <= 2;   // true

out 10 == 10; // true
out 10 != 5;  // true`}
        filename="comparison.exon"
      />

      <h2>Equality Rules</h2>
      <p>
        Two values are equal (<code>==</code>) if they have the same type and value:
      </p>
      <ul>
        <li><code>nil == nil</code> is <code>true</code></li>
        <li>Numbers are compared by 64-bit IEEE floating point value</li>
        <li>Strings are compared character by character</li>
        <li>Booleans are equal if both are <code>true</code> or both are <code>false</code></li>
        <li>Objects/Functions are equal only if they refer to the exact same instance in memory</li>
      </ul>

      <h2>Grouping & Precedence</h2>
      <p>
        Use parentheses <code>()</code> to explicitly override operator precedence.
      </p>
      <CodeBlock
        code={`set result1 = 2 + 3 * 4;   // 14 (multiplication first)
set result2 = (2 + 3) * 4; // 20 (grouping first)
out result1;
out result2;`}
        filename="precedence.exon"
      />

      <DocsNavigation slug="expressions" />
    </article>
  );
}
