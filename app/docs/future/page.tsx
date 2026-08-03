import type { Metadata } from "next";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Future Features",
  description: "Roadmap for Exon: arrays, hash maps, module imports, and standard library extensions.",
};

export default function FuturePage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Future Features</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Roadmap for future Exon releases and language extensions.
        </p>
      </div>

      <h2>Planned Features</h2>
      <ul>
        <li><strong>Array / List Literals:</strong> Native syntax <code>[1, 2, 3]</code> and indexing <code>arr[0]</code>.</li>
        <li><strong>Hash Maps / Dictionaries:</strong> Key-value maps <code>&#123; &quot;key&quot;: &quot;value&quot; &#125;</code>.</li>
        <li><strong>Module Imports:</strong> <code>import &quot;math.exon&quot;;</code> statement for code reusability.</li>
        <li><strong>Standard Library:</strong> Native math, string manipulation, and file I/O primitives.</li>
        <li><strong>Bytecode VM / JIT:</strong> Phase 2 interpreter optimization replacing tree-walk evaluation with a stack-based bytecode virtual machine.</li>
      </ul>

      <DocsNavigation slug="future" />
    </article>
  );
}
