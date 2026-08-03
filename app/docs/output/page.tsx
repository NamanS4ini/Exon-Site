import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Output",
  description: "Print values to the console with the out statement in Exon.",
};

export default function OutputPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Output</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Use the <code>out</code> statement to print a value to standard output.
        </p>
      </div>

      <h2>Basic Usage</h2>
      <p>
        The <code>out</code> keyword is followed by any expression. It evaluates the expression
        and prints the result, followed by a newline.
      </p>
      <CodeBlock
        code={`out "Hello, World!";
out 42;
out true;
out nil;`}
        filename="output.exon"
      />
      <CodeBlock code={"Hello, World!\n42\ntrue\nnil"} language="output" highlight={false} filename="output" />

      <h2>Printing Expressions</h2>
      <p>
        You can print the result of any expression, including arithmetic, comparisons, and function
        calls.
      </p>
      <CodeBlock
        code={`out 2 + 2;           // 4
out 10 / 3;          // 3.3333333333333335 (double division)
out "Pi: " + 3.14;   // Pi: 3.14
out 5 > 3;           // true
out 5 == 5;          // true`}
        filename="expressions.exon"
      />

      <h2>Printing Variables</h2>
      <CodeBlock
        code={`set greeting = "Hi";
set target = "World";
out greeting + ", " + target + "!";  // Hi, World!`}
        filename="vars.exon"
      />

      <h2>Stringification Rules</h2>
      <p>
        When you print a value that is not a string, Exon converts it to a string automatically:
      </p>
      <table>
        <thead>
          <tr>
            <th>Value</th>
            <th>Printed as</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>42</code></td><td><code>42</code> (no decimal point for whole numbers)</td></tr>
          <tr><td><code>3.14</code></td><td><code>3.14</code></td></tr>
          <tr><td><code>true</code></td><td><code>true</code></td></tr>
          <tr><td><code>false</code></td><td><code>false</code></td></tr>
          <tr><td><code>nil</code></td><td><code>nil</code></td></tr>
          <tr><td>function</td><td><code>&lt;fn name&gt;</code></td></tr>
          <tr><td>class</td><td><code>&lt;class Name&gt;</code></td></tr>
          <tr><td>instance</td><td><code>&lt;Name instance&gt;</code></td></tr>
        </tbody>
      </table>

      <h2>Multiple Values</h2>
      <p>
        Each <code>out</code> statement prints one value and a newline. To print multiple values on
        one line, concatenate them into a single string.
      </p>
      <CodeBlock
        code={`set a = 1;
set b = 2;
set c = 3;
out a + " " + b + " " + c;  // 1 2 3`}
        filename="multi.exon"
      />

      <DocsNavigation slug="output" />
    </article>
  );
}
