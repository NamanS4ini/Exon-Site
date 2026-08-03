import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Variables",
  description: "Declare and use variables with set in Exon.",
};

export default function VariablesPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Variables</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Declare, assign, and scope variables using the <code>set</code> keyword.
        </p>
      </div>

      <h2>Declaration</h2>
      <p>
        Use <code>set</code> to declare a variable. Every declaration ends with a semicolon.
      </p>
      <CodeBlock
        code={`set name = "Exon";
set version = 1;
set active = true;

out name;
out version;
out active;`}
        filename="variables.exon"
      />
      <p>
        You must initialise a variable when you declare it. Declaring without a value is not
        allowed.
      </p>

      <h2>Assignment</h2>
      <p>
        After declaration, assign a new value without the <code>set</code> keyword.
      </p>
      <CodeBlock
        code={`set x = 10;
out x;     // 10

x = 20;
out x;     // 20`}
        filename="assignment.exon"
      />

      <h2>Scope</h2>
      <p>
        Exon uses <strong>lexical (static) scoping</strong>. A variable is visible from the point
        of its declaration to the end of the enclosing block.
      </p>
      <CodeBlock
        code={`set global = "I am global";

{
  set local = "I am local";
  out global;  // Works — global is in scope.
  out local;   // Works.
}

out global;    // Works.
// out local;  // Error: undefined variable.`}
        filename="scope.exon"
      />

      <h2>Shadowing</h2>
      <p>
        An inner scope can declare a variable with the same name as an outer scope. The inner
        declaration <em>shadows</em> the outer one for the duration of the block.
      </p>
      <CodeBlock
        code={`set x = "outer";
{
  set x = "inner";
  out x;   // inner
}
out x;     // outer`}
        filename="shadowing.exon"
      />

      <h2>Closure Capture</h2>
      <p>
        Functions capture the variables in scope at the time they are created. Modifying a captured
        variable from inside the function modifies the original binding.
      </p>
      <CodeBlock
        code={`set count = 0;

fxn increment() {
  count = count + 1;
  out count;
}

increment(); // 1
increment(); // 2
increment(); // 3`}
        filename="capture.exon"
      />

      <DocsNavigation slug="variables" />
    </article>
  );
}
