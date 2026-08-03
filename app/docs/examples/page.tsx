import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsNavigation } from "@/components/docs/DocsNavigation";

export const metadata: Metadata = {
  title: "Examples",
  description: "Complete Exon programs: Fibonacci, FizzBuzz, counter, and linked list.",
};

export default function ExamplesPage() {
  return (
    <article className="docs-prose animate-fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Examples</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
          Full working programs demonstrating Exon features.
        </p>
      </div>

      <h2>1. Recursive Fibonacci</h2>
      <CodeBlock
        code={`fxn fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

for (set i = 0; i < 10; i = i + 1) {
  out "fib(" + i + ") = " + fib(i);
}`}
        filename="fibonacci.exon"
      />

      <h2>2. FizzBuzz</h2>
      <CodeBlock
        code={`for (set i = 1; i <= 15; i = i + 1) {
  if (i - (i / 15) * 15 == 0) {
    out "FizzBuzz";
  } else {
    if (i - (i / 3) * 3 == 0) {
      out "Fizz";
    } else {
      if (i - (i / 5) * 5 == 0) {
        out "Buzz";
      } else {
        out i;
      }
    }
  }
}`}
        filename="fizzbuzz.exon"
      />

      <h2>3. Linked List</h2>
      <CodeBlock
        code={`class Node {
  init(val, next) {
    this.val = val;
    this.next = next;
  }
}

class LinkedList {
  init() {
    this.head = nil;
  }
  push(val) {
    this.head = Node(val, this.head);
  }
  printAll() {
    set curr = this.head;
    when (curr != nil) {
      out curr.val;
      curr = curr.next;
    }
  }
}

set list = LinkedList();
list.push(30);
list.push(20);
list.push(10);
list.printAll();`}
        filename="linked_list.exon"
      />

      <DocsNavigation slug="examples" />
    </article>
  );
}
