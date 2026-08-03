import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Error Handling",
  description: "Scanning, parsing, and runtime error reporting in Exon.",
};

export default function ErrorsPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Error Handling</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          How Exon reports syntax, resolution, and runtime errors.
        </p>
      </div>

      <h2>Categories of Errors</h2>

      <h3>1. Scan Errors</h3>
      <p>
        Occur during lexical analysis when the scanner encounters invalid or unterminated tokens.
      </p>
      <CodeBlock
        code={`set x = "unterminated string;`}
        filename="scan_error.exon"
      />

      <h3>2. Parse Errors</h3>
      <p>
        Occur during syntactic analysis when tokens do not match the expected grammar rules.
      </p>
      <CodeBlock
        code={`if 10 > 5 { // Error: missing '(' around condition
  out "Hi";
}`}
        filename="parse_error.exon"
      />

      <h3>3. Resolution Errors</h3>
      <p>
        Occur during static resolution before runtime (e.g. reading a variable in its own initializer or invalid <code>return</code> outside a function).
      </p>

      <h3>4. Runtime Errors</h3>
      <p>
        Occur during program execution (e.g. applying binary arithmetic to incompatible types or calling a non-callable value).
      </p>
      <CodeBlock
        code={`set val = 10;
val(); // Runtime Error: Can only call functions and classes.`}
        filename="runtime_error.exon"
      />

      <h2>Exit Codes</h2>
      <table>
        <thead>
          <tr>
            <th>Exit Code</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Successful execution</td></tr>
          <tr><td><code>65</code></td><td>Data format error (Syntax / Scan / Parse / Resolution Error)</td></tr>
          <tr><td><code>70</code></td><td>Software error (Runtime Error)</td></tr>
        </tbody>
      </table>

      <DocsNavigation slug="errors" />
    </article>
  );
}
