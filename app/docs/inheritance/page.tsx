import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Inheritance",
  description: "Class inheritance using the < operator, method overriding, and super in Exon.",
};

export default function InheritancePage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Inheritance</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Subclassing, method overriding, and <code>super</code> dispatch.
        </p>
      </div>

      <h2>Subclassing with &lt;</h2>
      <p>
        To inherit from a parent class, use the <code>&lt;</code> operator in the class declaration:
      </p>
      <CodeBlock
        code={`class Animal {
  speak() {
    out "Some generic sound";
  }
}

class Dog < Animal {
  speak() {
    out "Woof! Woof!";
  }
}

set d = Dog();
d.speak(); // Woof! Woof!`}
        filename="inheritance.exon"
      />

      <h2>Method Overriding & super</h2>
      <p>
        A subclass can override a parent method. To call the superclass method from within an overridden method, use <code>super.method()</code>:
      </p>
      <CodeBlock
        code={`class Shape {
  describe() {
    out "I am a shape.";
  }
}

class Circle < Shape {
  init(radius) {
    this.radius = radius;
  }
  describe() {
    super.describe();
    out "Specifically, a circle of radius " + this.radius;
  }
}

set c = Circle(5);
c.describe();`}
        filename="super.exon"
      />

      <DocsNavigation slug="inheritance" />
    </article>
  );
}
