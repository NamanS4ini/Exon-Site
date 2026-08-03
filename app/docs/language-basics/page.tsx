import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Language Basics",
  description: "Comments, semicolons, blocks, truthiness, and dynamic typing in Exon.",
};

export default function LanguageBasicsPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Language Basics</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Core rules that apply throughout the entire language.
        </p>
      </div>

      <h2>Comments</h2>
      <p>
        Exon supports line comments. A comment starts with <code>//</code> and ends at the next
        newline. There are no block comments.
      </p>
      <CodeBlock
        code={`// This is a comment.
set x = 42; // Inline comment.
out x;`}
        filename="comments.exon"
      />

      <h2>Semicolons</h2>
      <p>
        Every statement ends with a semicolon (<code>;</code>). This includes variable declarations,
        assignments, <code>out</code> statements, and <code>return</code> statements.
      </p>
      <CodeBlock
        code={`set name = "Exon";
out name;
return 0;`}
        filename="semicolons.exon"
      />

      <h2>Blocks</h2>
      <p>
        A block is a sequence of statements enclosed in braces. Blocks create a new scope. Variables
        declared inside a block are not visible outside it.
      </p>
      <CodeBlock
        code={`{
  set local = "inside";
  out local; // Works.
}
// out local; // Error: 'local' is not defined here.`}
        filename="blocks.exon"
      />

      <h2>Dynamic Typing</h2>
      <p>
        Exon is dynamically typed. A variable can hold any value. You do not declare its type.
      </p>
      <CodeBlock
        code={`set x = 42;       // x holds a number.
x = "hello";      // x now holds a string.
x = true;         // x now holds a boolean.
out x;            // Prints: true`}
        filename="dynamic.exon"
      />

      <h2>Value Types</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Examples</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>number</code></td><td><code>42</code>, <code>3.14</code></td><td>64-bit floating-point double</td></tr>
          <tr><td><code>string</code></td><td><code>&quot;hello&quot;</code></td><td>Sequence of characters</td></tr>
          <tr><td><code>boolean</code></td><td><code>true</code>, <code>false</code></td><td>Logical true/false</td></tr>
          <tr><td><code>nil</code></td><td><code>nil</code></td><td>Absence of a value</td></tr>
          <tr><td><code>function</code></td><td><code>fxn f() {"{}"}</code></td><td>First-class callable</td></tr>
          <tr><td><code>instance</code></td><td><code>Point(1, 2)</code></td><td>Class instance</td></tr>
        </tbody>
      </table>

      <h2>Truthiness</h2>
      <p>
        In Exon, <code>false</code> and <code>nil</code> are falsy. Every other value is truthy.
        This includes <code>0</code>, empty strings, and empty objects — they are all truthy.
      </p>
      <CodeBlock
        code={`if (0)   out "0 is truthy";    // Prints.
if ("")  out "empty is truthy"; // Prints.
if (nil) out "nil is truthy";   // Does NOT print.
if (false) out "false is truthy"; // Does NOT print.`}
        filename="truthiness.exon"
      />

      <h2>String Concatenation</h2>
      <p>
        Use <code>+</code> to concatenate strings. If one operand is a string and the other is a
        number, the number is converted to a string automatically.
      </p>
      <CodeBlock
        code={`out "Score: " + 42;    // Score: 42
out "Pi is " + 3.14;  // Pi is 3.14`}
        filename="concat.exon"
      />

      <DocsNavigation slug="language-basics" />
    </article>
  );
}
