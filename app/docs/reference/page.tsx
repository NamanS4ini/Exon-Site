import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Language Reference",
  description: "Keyword table, operator precedence, and EBNF grammar specification for Exon.",
};

export default function ReferencePage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Language Reference</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Formal specification of keywords, operators, and EBNF grammar.
        </p>
      </div>

      <h2>Keywords</h2>
      <table>
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Category</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>set</code></td><td>Variable</td><td>Declares a variable</td></tr>
          <tr><td><code>out</code></td><td>Statement</td><td>Prints an expression to stdout</td></tr>
          <tr><td><code>if</code></td><td>Control</td><td>Conditional statement</td></tr>
          <tr><td><code>else</code></td><td>Control</td><td>Alternative branch</td></tr>
          <tr><td><code>when</code></td><td>Control</td><td>While loop</td></tr>
          <tr><td><code>for</code></td><td>Control</td><td>For loop (desugared to when)</td></tr>
          <tr><td><code>fxn</code></td><td>Function</td><td>Declares a function</td></tr>
          <tr><td><code>return</code></td><td>Function</td><td>Returns a value from a function</td></tr>
          <tr><td><code>class</code></td><td>OOP</td><td>Declares a class</td></tr>
          <tr><td><code>this</code></td><td>OOP</td><td>Refers to current instance</td></tr>
          <tr><td><code>super</code></td><td>OOP</td><td>Refers to superclass method</td></tr>
          <tr><td><code>and</code></td><td>Logical</td><td>Short-circuit logical AND</td></tr>
          <tr><td><code>or</code></td><td>Logical</td><td>Short-circuit logical OR</td></tr>
          <tr><td><code>true</code></td><td>Literal</td><td>Boolean true</td></tr>
          <tr><td><code>false</code></td><td>Literal</td><td>Boolean false</td></tr>
          <tr><td><code>nil</code></td><td>Literal</td><td>Null/absent value</td></tr>
        </tbody>
      </table>

      <h2>Operator Precedence</h2>
      <p>From lowest precedence to highest precedence:</p>
      <table>
        <thead>
          <tr>
            <th>Precedence</th>
            <th>Operators</th>
            <th>Associativity</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td><code>=</code></td><td>Right</td></tr>
          <tr><td>2</td><td><code>or</code></td><td>Left</td></tr>
          <tr><td>3</td><td><code>and</code></td><td>Left</td></tr>
          <tr><td>4</td><td><code>==</code> <code>!=</code></td><td>Left</td></tr>
          <tr><td>5</td><td><code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code></td><td>Left</td></tr>
          <tr><td>6</td><td><code>+</code> <code>-</code></td><td>Left</td></tr>
          <tr><td>7</td><td><code>*</code> <code>/</code></td><td>Left</td></tr>
          <tr><td>8</td><td><code>!</code> <code>-</code> (unary)</td><td>Right</td></tr>
          <tr><td>9</td><td><code>.</code> <code>()</code></td><td>Left</td></tr>
        </tbody>
      </table>

      <h2>Grammar (EBNF)</h2>
      <CodeBlock
        code={`program        → declaration* EOF ;
declaration    → classDecl | funDecl | varDecl | statement ;
classDecl      → "class" IDENTIFIER ( "<" IDENTIFIER )? "{" function* "}" ;
funDecl        → "fxn" function ;
function       → IDENTIFIER "(" parameters? ")" block ;
varDecl        → "set" IDENTIFIER "=" expression ";" ;
statement      → exprStmt | ifStmt | outStmt | returnStmt | whenStmt | forStmt | block ;`}
        language="ebnf"
        highlight={false}
        filename="grammar.ebnf"
      />

      <DocsNavigation slug="reference" />
    </article>
  );
}
