/**
 * Single source of truth for documentation navigation structure.
 * Used by: DocsLayout sidebar, DocsNavigation prev/next, SEO metadata.
 */

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  section: string;
}

export interface DocSection {
  label: string;
  items: DocPage[];
}

export const DOCS_NAV: DocSection[] = [
  {
    label: "Introduction",
    items: [
      {
        slug: "introduction",
        title: "Introduction",
        description: "What Exon is, how it works, and why it exists.",
        section: "Introduction",
      },
      {
        slug: "getting-started",
        title: "Getting Started",
        description: "Install, build, and run your first Exon program.",
        section: "Introduction",
      },
      {
        slug: "language-basics",
        title: "Language Basics",
        description: "Comments, semicolons, blocks, truthiness, and dynamic typing.",
        section: "Introduction",
      },
    ],
  },
  {
    label: "Core Language",
    items: [
      {
        slug: "variables",
        title: "Variables",
        description: "Declare and use variables with set.",
        section: "Core Language",
      },
      {
        slug: "output",
        title: "Output",
        description: "Print values to the console with out.",
        section: "Core Language",
      },
      {
        slug: "expressions",
        title: "Expressions",
        description: "Arithmetic, comparison, string concatenation, and grouping.",
        section: "Core Language",
      },
      {
        slug: "conditionals",
        title: "Conditionals",
        description: "if/else, logical and/or, short-circuit evaluation.",
        section: "Core Language",
      },
      {
        slug: "loops",
        title: "Loops",
        description: "when (while) and for loops with loop patterns.",
        section: "Core Language",
      },
    ],
  },
  {
    label: "Functions & OOP",
    items: [
      {
        slug: "functions",
        title: "Functions",
        description: "Declare functions with fxn, pass parameters, return values.",
        section: "Functions & OOP",
      },
      {
        slug: "closures",
        title: "Closures",
        description: "First-class functions and captured scope.",
        section: "Functions & OOP",
      },
      {
        slug: "classes",
        title: "Classes",
        description: "OOP with class, init, fields, methods, and this.",
        section: "Functions & OOP",
      },
      {
        slug: "inheritance",
        title: "Inheritance",
        description: "Class inheritance with <, method overriding, and super.",
        section: "Functions & OOP",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        slug: "builtins",
        title: "Built-in Functions",
        description: "Native functions: clock(), len(), str(), type().",
        section: "Reference",
      },
      {
        slug: "errors",
        title: "Error Handling",
        description: "Scan, parse, and runtime errors with exit codes.",
        section: "Reference",
      },
      {
        slug: "examples",
        title: "Examples",
        description: "Complete programs: Fibonacci, FizzBuzz, linked list, and more.",
        section: "Reference",
      },
      {
        slug: "reference",
        title: "Language Reference",
        description: "Full keyword table, operator precedence, and formal grammar.",
        section: "Reference",
      },
      {
        slug: "architecture",
        title: "Architecture",
        description: "Pipeline diagram, visitor pattern, and AST structure.",
        section: "Reference",
      },
      {
        slug: "future",
        title: "Future Features",
        description: "Arrays, hash maps, modules, and standard library roadmap.",
        section: "Reference",
      },
    ],
  },
];

/** Flat list of all pages in order */
export const ALL_DOC_PAGES: DocPage[] = DOCS_NAV.flatMap((s) => s.items);

/** Get a page by slug */
export function getDocPage(slug: string): DocPage | undefined {
  return ALL_DOC_PAGES.find((p) => p.slug === slug);
}

/** Get the previous and next pages for a given slug */
export function getDocAdjacentPages(slug: string): {
  prev: DocPage | undefined;
  next: DocPage | undefined;
} {
  const idx = ALL_DOC_PAGES.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? ALL_DOC_PAGES[idx - 1] : undefined,
    next: idx < ALL_DOC_PAGES.length - 1 ? ALL_DOC_PAGES[idx + 1] : undefined,
  };
}
