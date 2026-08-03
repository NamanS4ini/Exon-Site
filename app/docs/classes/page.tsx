import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Classes",
  description: "Object-oriented programming with class, init, fields, methods, and this in Exon.",
};

export default function ClassesPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Classes</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Object-oriented programming with constructors, methods, and instances.
        </p>
      </div>

      <h2>Declaring a Class</h2>
      <p>
        Use the <code>class</code> keyword to define a class. Methods are declared without the <code>fxn</code> keyword inside the class body.
      </p>
      <CodeBlock
        code={`class Greeter {
  sayHello(name) {
    out "Hello, " + name + "!";
  }
}

set greeter = Greeter();
greeter.sayHello("Alice");`}
        filename="class_basic.exon"
      />

      <h2>Constructors (init)</h2>
      <p>
        If a class defines a method named <code>init</code>, it acts as the constructor. When you instantiate the class by calling it like a function,
        Exon automatically invokes <code>init</code> with the provided arguments and returns the new instance.
      </p>
      <CodeBlock
        code={`class Point {
  init(x, y) {
    this.x = x;
    this.y = y;
  }
  print() {
    out "Point(" + this.x + ", " + this.y + ")";
  }
}

set p = Point(10, 20);
p.print(); // Point(10, 20)`}
        filename="constructor.exon"
      />

      <h2>The this Keyword</h2>
      <p>
        Inside a method, <code>this</code> refers to the current instance. Access fields or invoke other methods on the instance via dot syntax (<code>this.field</code>).
      </p>

      <h2>Dynamic Fields</h2>
      <p>
        Fields on instances are created dynamically upon assignment:
      </p>
      <CodeBlock
        code={`class Point {
  init(x, y) {
    this.x = x;
    this.y = y;
  }
}

set p = Point(0, 0);
p.z = 5; // Dynamically add field 'z'
out p.z; // 5`}
        filename="fields.exon"
      />

      <DocsNavigation slug="classes" />
    </article>
  );
}
