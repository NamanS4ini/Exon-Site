import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Built-in Functions",
  description: "Native functions in Exon: clock(), len(), str(), type().",
};

export default function BuiltinsPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Built-in Functions</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Native standard library functions provided by the interpreter.
        </p>
      </div>

      <h2>clock()</h2>
      <p>
        Returns the current system timestamp in seconds (as a double). Useful for benchmarking code execution time.
      </p>
      <CodeBlock
        code={`set start = clock();

for (set i = 0; i < 10000; i = i + 1) {
  // benchmark loop
}

set end = clock();
out "Elapsed: " + (end - start) + " seconds";`}
        filename="clock.exon"
      />

      <h2>len(str)</h2>
      <p>
        Returns the length (number of characters) of a string value.
      </p>
      <CodeBlock
        code={`set msg = "Exon Language";
out len(msg); // 13`}
        filename="len.exon"
      />

      <h2>str(val)</h2>
      <p>
        Explicitly converts any value to its string representation.
      </p>
      <CodeBlock
        code={`out str(42);   // "42"
out str(true); // "true"`}
        filename="str.exon"
      />

      <h2>type(val)</h2>
      <p>
        Returns the type name of a value as a string (<code>&quot;number&quot;</code>, <code>&quot;string&quot;</code>, <code>&quot;boolean&quot;</code>, <code>&quot;nil&quot;</code>, <code>&quot;function&quot;</code>, <code>&quot;class&quot;</code>, <code>&quot;instance&quot;</code>).
      </p>
      <CodeBlock
        code={`out type(42);       // number
out type("hello");  // string
out type(nil);      // nil`}
        filename="type.exon"
      />

      <DocsNavigation slug="builtins" />
    </article>
  );
}
