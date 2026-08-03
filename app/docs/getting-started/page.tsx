import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { Terminal, Download, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Getting Started",
  description: "Install, build, and run your first Exon program.",
};

function Step({ n, icon, title, children }: { n: number; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginTop: "1.5rem" }}>
      <div style={{
        flexShrink: 0,
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "var(--brand-glow)",
        border: "1px solid var(--border-brand)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-brand)",
        fontWeight: 700,
        fontSize: "0.85rem",
      }}>
        {n}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {icon} {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

export default function GettingStartedPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Getting Started</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Build and run your first Exon program in three steps.
        </p>
      </div>

      <h2>Prerequisites</h2>
      <p>You need <strong>Java 17 or later</strong> and <strong>Gradle 8+</strong> installed.</p>
      <CodeBlock code={"java --version\ngradle --version"} language="bash" highlight={false} filename="terminal" />

      <h2>Quick Start</h2>

      <Step n={1} icon={<Download size={16} />} title="Clone the repository">
        <CodeBlock
          code={"git clone https://github.com/namansaini1463/exon-interpreter.git\ncd exon-interpreter"}
          language="bash"
          highlight={false}
          filename="terminal"
        />
      </Step>

      <Step n={2} icon={<Terminal size={16} />} title="Build with Gradle">
        <p>Build the interpreter JAR:</p>
        <CodeBlock code={"./gradlew jar"} language="bash" highlight={false} filename="terminal" />
        <p>
          This produces <code>build/libs/exon-interpreter-1.0.0.jar</code>.
        </p>
      </Step>

      <Step n={3} icon={<Play size={16} />} title="Run a program">
        <p>Create a file called <code>hello.exon</code>:</p>
        <CodeBlock code={'out "Hello, World!";'} filename="hello.exon" />
        <p>Run it:</p>
        <CodeBlock code={"java -jar build/libs/exon-interpreter-1.0.0.jar hello.exon"} language="bash" highlight={false} filename="terminal" />
        <p>You should see:</p>
        <CodeBlock code={"Hello, World!"} language="output" highlight={false} filename="output" />
      </Step>

      <h2>REPL Mode</h2>
      <p>
        Run the interpreter with no file argument to start the interactive REPL (Read-Eval-Print
        Loop):
      </p>
      <CodeBlock code={"java -jar build/libs/exon-interpreter-1.0.0.jar"} language="bash" highlight={false} filename="terminal" />
      <p>You can then type Exon code line by line:</p>
      <CodeBlock
        code={`> set x = 10;
> out x * 2;
20
> out "Hello from REPL!";
Hello from REPL!`}
        language="repl"
        highlight={false}
        filename="REPL session"
      />

      <h2>Makefile shortcuts</h2>
      <p>The repository includes a Makefile with common tasks:</p>
      <table>
        <thead>
          <tr>
            <th>Command</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>make build</code></td><td>Compile all sources</td></tr>
          <tr><td><code>make run FILE=prog.exon</code></td><td>Run a specific file</td></tr>
          <tr><td><code>make repl</code></td><td>Start the REPL</td></tr>
          <tr><td><code>make test</code></td><td>Run test.exon</td></tr>
          <tr><td><code>make clean</code></td><td>Remove compiled files</td></tr>
        </tbody>
      </table>

      <DocsNavigation slug="getting-started" />
    </article>
  );
}
