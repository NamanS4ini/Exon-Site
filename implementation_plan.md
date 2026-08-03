# Exon Ecosystem — Architecture & Implementation Plan

## Executive Summary

This plan designs a complete ecosystem around the Exon programming language interpreter: an interactive documentation website, a browser-based playground, a Spring Boot API, and first-class syntax highlighting for VS Code and Monaco Editor. The architecture uses a **monorepo** approach and prioritizes modularity, reusability, and a polished developer experience.

---

## 1. Current State Analysis

### Interpreter Inventory

After a full audit of the codebase at [Exon/com/interpreter/exon/](file:///f:/Coding/interpreator/Exon/com/interpreter/exon), here is what exists:

| File | Role | Lines |
|:---|:---|---:|
| [Exon.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Exon.java) | Entry point (CLI + REPL) | 94 |
| [Scanner.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Scanner.java) | Lexical analysis (16 keywords) | 227 |
| [Parser.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Parser.java) | Recursive-descent parser | 417 |
| [Resolver.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Resolver.java) | Static scope resolution | 316 |
| [Interpreter.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Interpreter.java) | Tree-walk evaluator (Visitor pattern) | 390 |
| [Environment.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Environment.java) | Lexical scope chain | 62 |
| [Expr.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Expr.java) | AST expression nodes (12 types) | 191 |
| [Stmt.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Stmt.java) | AST statement nodes (9 types) | 146 |
| [Token.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Token.java) / [TokenType.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/TokenType.java) | Token model & types | 38 |
| [ExonCallable.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/ExonCallable.java) / [ExonFunction.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/ExonFunction.java) | Callable interface + closures | 60 |
| [ExonClass.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/ExonClass.java) / [ExonInstance.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/ExonInstance.java) | OOP runtime | 88 |
| [RuntimeError.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/RuntimeError.java) / [Return.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Return.java) | Error & return flow control | 19 |

### Language Features (Complete)

| Feature | Keyword/Syntax | Example |
|:---|:---|:---|
| Variables | `set name = value;` | `set x = 42;` |
| Output | `out expression;` | `out "hello";` |
| If/Else | `if (cond) { } else { }` | `if (x > 0) { out x; }` |
| While loop | `when (cond) { }` | `when (x < 10) { x = x + 1; }` |
| For loop | `for (init; cond; incr) { }` | `for (set i = 0; i < 5; i = i + 1) { }` |
| Functions | `fxn name(params) { }` | `fxn add(a, b) { return a + b; }` |
| Closures | First-class functions capturing enclosing scope | See [test.exon](file:///f:/Coding/interpreator/Exon/test.exon) L99–L110 |
| Classes | `class Name { }` | `class Point { init(x, y) { ... } }` |
| Inheritance | `class Child < Parent { }` | `class Donut < BakeryItem { }` |
| `this` / `super` | Method binding, superclass dispatch | `super.cook()` |
| Logical ops | `and`, `or` (short-circuit) | `x > 0 and x < 10` |
| **Native Built-ins**| `clock()` returns Unix timestamp in seconds | `set t = clock();` |

> [!NOTE]
> Three additional builtins will be added during Milestone 1: `len(string)` returns the string length, `str(value)` converts any value to a string, and `type(value)` returns the type name as a string.

### 16 Keywords

```
and, class, else, false, for, fxn, if, nil, or, out, return, super, this, true, set, when
```

### Key Architectural Constraint

The interpreter currently uses **static mutable state** in [Exon.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Exon.java) (`static boolean hadError`, `static boolean hadRuntimeError`) and writes directly to `System.out` / `System.err`. This must be refactored before the interpreter can serve concurrent web requests.

### Existing Website

A scaffold [Next.js 16 app](file:///f:/Coding/interpreator/Exon%20Site/package.json) exists with Tailwind CSS v4, but contains only the default template page. The [Interpreter/](file:///f:/Coding/interpreator/Exon%20Site/Interpreter) directory is a copy of the Exon interpreter.

---

## 2. Architecture Decision: Monorepo

### Recommended: Single Monorepo

```
exon/
├── interpreter/                    ← Java interpreter (library + CLI)
│   ├── src/main/java/com/interpreter/exon/
│   │   ├── core/                   ← Refactored core (Scanner, Parser, Resolver, Interpreter)
│   │   ├── runtime/                ← Runtime classes (Environment, ExonFunction, ExonClass, etc.)
│   │   ├── ast/                    ← Expr.java, Stmt.java, Token.java, TokenType.java
│   │   └── cli/                    ← Exon.java (CLI entry point, thin wrapper)
│   ├── build.gradle                ← or pom.xml
│   └── test/
│
├── api/                            ← Spring Boot REST API
│   ├── src/main/java/com/exon/api/
│   │   ├── controller/             ← RunController.java
│   │   ├── service/                ← ExecutionService.java
│   │   ├── model/                  ← RunRequest.java, RunResponse.java
│   │   ├── sandbox/                ← SandboxedRunner.java (timeout, output capture)
│   │   └── config/                 ← CorsConfig.java, RateLimitConfig.java
│   ├── build.gradle
│   └── application.yml
│
├── website/                        ← Next.js 16 documentation + playground
│   ├── app/
│   │   ├── (marketing)/            ← Landing page
│   │   ├── docs/                   ← Documentation pages
│   │   │   ├── layout.tsx          ← Sidebar + prev/next nav
│   │   │   ├── introduction/
│   │   │   ├── getting-started/
│   │   │   ├── variables/
│   │   │   ├── output/
│   │   │   ├── expressions/
│   │   │   ├── conditionals/
│   │   │   ├── loops/
│   │   │   ├── functions/
│   │   │   ├── classes/
│   │   │   ├── inheritance/
│   │   │   ├── examples/
│   │   │   └── reference/
│   │   └── playground/             ← Monaco-based playground
│   │       └── page.tsx
│   ├── components/
│   │   ├── docs/                   ← DocsSidebar, DocsNavigation, CodeBlock, RunButton
│   │   ├── playground/             ← Editor, Console, ExampleSelector
│   │   ├── ui/                     ← Button, Badge, ThemeToggle, SearchDialog
│   │   └── layout/                 ← Header, Footer, MobileNav
│   ├── lib/
│   │   ├── docs-config.ts          ← Documentation structure & navigation
│   │   ├── exon-api.ts             ← API client
│   │   ├── exon-language.ts        ← Monaco language definition (shared keywords)
│   │   └── examples.ts             ← Playground example programs
│   ├── content/                    ← MDX documentation content
│   │   ├── docs/
│   │   │   ├── introduction.mdx
│   │   │   ├── getting-started.mdx
│   │   │   └── ...
│   │   └── meta.json               ← Navigation ordering
│   └── public/
│
├── vscode-extension/               ← VS Code extension for .exon files
│   ├── syntaxes/
│   │   └── exon.tmLanguage.json    ← TextMate grammar
│   ├── language-configuration.json
│   ├── package.json                ← Extension manifest
│   └── src/                        ← (Future) LSP client
│
├── shared/                         ← Shared keyword/token definitions
│   └── exon-keywords.json          ← Single source of truth for keywords
│
├── .github/
│   └── workflows/                  ← CI/CD
│       ├── interpreter.yml
│       ├── api.yml
│       ├── website.yml
│       └── vscode-extension.yml
│
├── docker-compose.yml              ← Local dev (API + website)
├── README.md
└── LICENSE
```

### Why Monorepo over Multi-Repo

| Criterion | Monorepo ✅ | Multi-repo ❌ |
|:---|:---|:---|
| **Keyword synchronization** | One JSON file; all consumers read it | Manual sync across repos |
| **Atomic changes** | One PR updates API + website + grammar | Coordinated PRs across 4+ repos |
| **Portfolio presentation** | Single GitHub link shows full competency | Scattered repos dilute impact |
| **CI/CD** | One pipeline, selective triggers per path | Separate pipelines, duplicated config |
| **Local development** | `docker-compose up` starts everything | Manual service orchestration |
| **Refactoring** | Rename a keyword once, fix everywhere | Hunt-and-fix across repos |

> [!IMPORTANT]
> For a portfolio project, a monorepo provides a single, impressive GitHub URL that demonstrates full-stack ownership: interpreter → API → frontend → tooling.

---

## 3. Interpreter Refactoring Design

The current interpreter must be refactored to serve as a **reusable library** before any web integration.

### 3.1 Problem: Static Mutable State

Current [Exon.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Exon.java) uses:
- `static boolean hadError` (line 13)
- `static boolean hadRuntimeError` (line 14)
- `System.out.println()` in [Interpreter.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Interpreter.java#L148) (line 148)
- `System.err.println()` in [Exon.java](file:///f:/Coding/interpreator/Exon/com/interpreter/exon/Exon.java#L76-L78) (lines 76–78, 90–92)

This makes the interpreter **not thread-safe** and **not embeddable**.

### 3.2 Proposed Solution: `ExonEngine` + `OutputCollector`

```java
// NEW: Core execution engine (replaces static Exon methods)
public class ExonEngine {
    
    public static ExonResult run(String source) {
        return run(source, ExonConfig.defaults());
    }
    
    public static ExonResult run(String source, ExonConfig config) {
        OutputCollector collector = new OutputCollector(config.maxOutputLines());
        ErrorCollector errors = new ErrorCollector();
        
        Interpreter interpreter = new Interpreter(collector);
        
        Scanner scanner = new Scanner(source, errors);
        List<Token> tokens = scanner.scanTokens();
        
        if (errors.hasErrors()) {
            return ExonResult.failure(errors.getErrors(), collector.getOutput());
        }
        
        Parser parser = new Parser(tokens, errors);
        List<Stmt> statements = parser.parse();
        
        if (errors.hasErrors()) {
            return ExonResult.failure(errors.getErrors(), collector.getOutput());
        }
        
        Resolver resolver = new Resolver(interpreter, errors);
        resolver.resolve(statements);
        
        if (errors.hasErrors()) {
            return ExonResult.failure(errors.getErrors(), collector.getOutput());
        }
        
        interpreter.interpret(statements);
        
        if (errors.hasErrors()) {
            return ExonResult.failure(errors.getErrors(), collector.getOutput());
        }
        
        return ExonResult.success(collector.getOutput());
    }
}
```

```java
// NEW: Immutable result container
public record ExonResult(
    boolean success,
    String output,
    List<ExonError> errors,
    long executionTimeMs
) {
    static ExonResult success(String output) { ... }
    static ExonResult failure(List<ExonError> errors, String partialOutput) { ... }
}
```

```java
// NEW: Replaces System.out in Interpreter
public class OutputCollector {
    private final StringBuilder buffer = new StringBuilder();
    private final int maxLines;
    private int lineCount = 0;
    
    public void println(String value) {
        if (lineCount >= maxLines) {
            throw new OutputLimitExceededException();
        }
        buffer.append(value).append("\n");
        lineCount++;
    }
    
    public String getOutput() {
        return buffer.toString();
    }
}
```

### 3.3 Changes Required Per File

| File | Change | Difficulty |
|:---|:---|:---|
| `Exon.java` | Keep as CLI-only thin wrapper calling `ExonEngine.run()` | Low |
| `Scanner.java` | Accept `ErrorCollector` instead of calling `Exon.error()` | Low |
| `Parser.java` | Accept `ErrorCollector` instead of calling `Exon.error()` | Low |
| `Resolver.java` | Accept `ErrorCollector` instead of calling `Exon.error()` | Low |
| `Interpreter.java` | Accept `OutputCollector`; use `collector.println()` instead of `System.out.println()` | Medium |
| All files | Change visibility from package-private to `public` where needed for API consumption | Low |

### 3.4 Build System Migration

Migrate from raw `javac` + Makefile to **Gradle** (recommended over Maven for its flexibility):

```groovy
// interpreter/build.gradle
plugins {
    id 'java-library'
}

group = 'com.exon'
version = '1.0.0'

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

// Produces exon-interpreter-1.0.0.jar
jar {
    archiveBaseName = 'exon-interpreter'
}
```

> [!TIP]
> The interpreter becomes a JAR dependency that both the CLI and the Spring Boot API consume. This is the key architectural unlock.

---

## 4. Spring Boot API Design

### 4.1 API Surface

| Endpoint | Method | Purpose |
|:---|:---|:---|
| `POST /api/run` | POST | Execute Exon source code |
| `GET /api/health` | GET | Health check |
| `GET /api/examples` | GET | List example programs |
| `GET /api/examples/{id}` | GET | Get a specific example |

### 4.2 Request / Response Models

```java
// POST /api/run
public record RunRequest(
    @NotBlank String source
) {}

public record RunResponse(
    boolean success,
    String output,
    List<ErrorDetail> errors,
    long executionTimeMs
) {}

public record ErrorDetail(
    int line,
    String message,
    String type    // "SYNTAX", "RESOLUTION", "RUNTIME"
) {}
```

### 4.3 Safe Execution Flow

> [!CAUTION]
> User-submitted code is **untrusted**. The API must sandbox execution to prevent abuse.

```java
@Service
public class ExecutionService {
    
    private static final long TIMEOUT_MS = 5000;
    private static final int MAX_OUTPUT_LINES = 1000;
    private static final int MAX_SOURCE_LENGTH = 10_000;

    private final ExecutorService executor = Executors.newCachedThreadPool();
    
    public RunResponse execute(RunRequest request) {
        if (request.source().length() > MAX_SOURCE_LENGTH) {
            return RunResponse.error("Source code exceeds maximum length.");
        }
        
        Future<ExonResult> future = executor.submit(() -> {
            ExonConfig config = ExonConfig.builder()
                .maxOutputLines(MAX_OUTPUT_LINES)
                .build();
            return ExonEngine.run(request.source(), config);
        });
        
        try {
            ExonResult result = future.get(TIMEOUT_MS, TimeUnit.MILLISECONDS);
            return RunResponse.from(result);
        } catch (TimeoutException e) {
            future.cancel(true);
            return RunResponse.timeout();
        }
    }
}
```

#### Security Measures

| Threat | Mitigation |
|:---|:---|
| Infinite loops | `Future.get()` with 5-second timeout |
| Memory exhaustion | JVM `-Xmx` flag; output buffer limit |
| Output flooding | `OutputCollector` with `maxLines = 1000` |
| Oversized input | `MAX_SOURCE_LENGTH = 10,000` characters |
| DDoS | Rate limiting with Bucket4j or Spring Rate Limiter |
| Code injection | Exon has no file I/O, network, or system access — it is inherently sandboxed |

> [!NOTE]
> Because Exon lacks file I/O, network access, or system call primitives, the language itself is a natural sandbox. The only attack vectors are resource exhaustion (infinite loops, memory), which the timeout and limits address.

### 4.4 CORS Configuration

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:3000",    // Local dev
                "https://exon-lang.vercel.app"  // Production
            )
            .allowedMethods("GET", "POST")
            .allowedHeaders("Content-Type");
    }
}
```

### 4.5 Rate Limiting

```java
@Component
public class RateLimitFilter extends OncePerRequestFilter {
    // Bucket4j: 30 requests per minute per IP
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    
    private Bucket createBucket() {
        return Bucket.builder()
            .addLimit(Bandwidth.classic(30, Refill.intervally(30, Duration.ofMinutes(1))))
            .build();
    }
}
```

---

## 5. Documentation Website Design

### 5.1 Technology Stack

| Layer | Technology | Rationale |
|:---|:---|:---|
| Framework | Next.js 16 (already scaffolded) | SSR, file-based routing, portfolio-relevant |
| Content | MDX (Markdown + JSX) | Embed runnable code blocks |
| Styling | Tailwind CSS v4 + shadcn/ui | Modern, responsive, rapid development |
| Code Editor | Monaco Editor | Same engine as VS Code, full language support |
| Icons | Lucide React | Lightweight, consistent |
| Search | Client-side FlexSearch | No backend needed for search |
| Theme | System-aware dark/light | CSS `prefers-color-scheme` + toggle |

### 5.2 Documentation Structure & Content

All documentation follows **ADS-STE100 Simplified Technical English** rules:
- Use short sentences (max 25 words).
- Use the active voice.
- Use approved words where applicable.
- Do not use more than one thought per sentence.
- Avoid jargon and ambiguity.

#### Pages (in navigation order)

| # | Page | Route | Content Summary |
|---:|:---|:---|:---|
| 1 | Introduction | `/docs/introduction` | What Exon is, the architecture pipeline, design philosophy |
| 2 | Getting Started | `/docs/getting-started` | Install, build, first program, REPL |
| 3 | Language Basics | `/docs/language-basics` | Comments, semicolons, blocks, truthiness |
| 4 | Variables | `/docs/variables` | `set`, dynamic typing, scope rules |
| 5 | Output | `/docs/output` | `out` statement, stringification rules |
| 6 | Expressions | `/docs/expressions` | Arithmetic, comparison, string concatenation, unary, grouping |
| 7 | Conditionals | `/docs/conditionals` | `if/else`, logical `and/or`, short-circuit evaluation |
| 8 | Loops | `/docs/loops` | `when` (while), `for` (desugared), loop patterns |
| 9 | Functions | `/docs/functions` | `fxn`, parameters, return, recursion |
| 10 | Closures | `/docs/closures` | First-class functions, captured scope, counter pattern |
| 11 | Classes | `/docs/classes` | `class`, `init`, fields, methods, `this` |
| 12 | Inheritance | `/docs/inheritance` | `<` operator, method overriding, `super` |
| 13 | Built-in Functions | `/docs/builtins` | `clock()`, future native functions |
| 14 | Error Handling | `/docs/errors` | Scan errors, parse errors, runtime errors, exit codes |
| 15 | Examples | `/docs/examples` | Fibonacci, FizzBuzz, linked list, calculator, etc. |
| 16 | Language Reference | `/docs/reference` | Full keyword table, operator precedence, grammar (EBNF) |
| 17 | Architecture | `/docs/architecture` | Pipeline diagram, visitor pattern, AST structure |
| 18 | Future Features | `/docs/future` | Arrays, hash maps, modules, standard library |

### 5.3 Interactive Code Block Component

Every documentation page contains runnable Exon code snippets. The component architecture:

```
<InteractiveCodeBlock>
  ├── <CodeEditor>          ← Monaco Editor (small, syntax-highlighted)
  ├── <Toolbar>
  │     ├── <RunButton>     ← Calls API POST /api/run
  │     ├── <CopyButton>    ← Copies source to clipboard
  │     └── <ResetButton>   ← Resets to original code
  └── <OutputPanel>
        ├── <OutputText>    ← stdout results
        └── <ErrorText>     ← stderr / error results (red)
```

### 5.4 Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ Exon    Docs    Playground    GitHub          🌙 / ☀️       │
├───────────┬─────────────────────────────────────────────────────┤
│           │                                                     │
│  Sidebar  │   # Page Title                                      │
│           │                                                     │
│  □ Intro  │   Explanation paragraph (STE100).                   │
│  □ Start  │                                                     │
│  ■ Vars   │   ┌──────────────────────────────────────────────┐  │
│  □ Output │   │  set greeting = "Hello";                     │  │
│  □ Expr   │   │  out greeting;                               │  │
│  □ Cond   │   ├──────────────────────────────────────────────┤  │
│  □ Loops  │   │  ▶ Run     📋 Copy     ↺ Reset               │  │
│  □ Fxns   │   ├──────────────────────────────────────────────┤  │
│  □ Close  │   │  > Hello                                     │  │
│  □ Class  │   └──────────────────────────────────────────────┤  │
│  □ Inher  │                                                     │
│  □ Built  │   More explanation...                               │
│  □ Error  │                                                     │
│  □ Examp  │   ┌──────────────────────────────────────────────┐  │
│  □ Ref    │   │  ← Variables          Expressions →          │  │
│  □ Arch   │   └──────────────────────────────────────────────┘  │
│  □ Futur  │                                                     │
│           │                                                     │
└───────────┴─────────────────────────────────────────────────────┘
```

### 5.5 Landing Page Sections

1. **Hero** — "The Exon Programming Language" with animated code sample, CTA buttons to Docs and Playground.
2. **Feature Cards** — 6 cards (Variables, Functions, Classes, Closures, Inheritance, REPL).
3. **Interactive Demo** — Embedded mini-playground with a pre-loaded example.
4. **Architecture Diagram** — Animated pipeline: Source → Scanner → Parser → Resolver → Interpreter → Output.
5. **Getting Started** — 3-step quick start.
6. **Footer** — GitHub, license, "Built by Naman Saini".

---

## 6. Playground Design

### 6.1 Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ Exon    Docs    Playground    GitHub          🌙 / ☀️       │
├────────────────────────────────┬────────────────────────────────┤
│                                │                                │
│   Monaco Editor                │   Output Console               │
│                                │                                │
│   set x = 10;                  │   > 10                         │
│   out x;                       │   > 20                         │
│   out x + 10;                  │   > Hello, Exon!               │
│   out "Hello, Exon!";          │                                │
│                                │                                │
│                                │                                │
│                                │                                │
│                                │                                │
├────────────────────────────────┴────────────────────────────────┤
│  ▶ Run (Ctrl+Enter)    🗑 Clear    📋 Copy    📤 Share          │
├─────────────────────────────────────────────────────────────────┤
│  Examples: ▾ Hello World | Fibonacci | Closures | Classes | ... │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Features

| Feature | Implementation |
|:---|:---|
| **Editor** | Monaco Editor with custom Exon language mode |
| **Run** | `POST /api/run` with loading spinner |
| **Keyboard shortcut** | `Ctrl+Enter` / `Cmd+Enter` to run |
| **Output console** | Monospace output area with stdout/stderr separation |
| **Clear** | Clears output console |
| **Copy** | Copies source to clipboard |
| **Share** | Encodes source as Base64 in URL query parameter (`?code=...`) |
| **Examples dropdown** | Pre-loaded example programs from [examples.ts](file:///f:/Coding/interpreator/Exon%20Site/lib/examples.ts) |
| **Responsive** | Stacked layout on mobile (editor on top, console below) |
| **Dark mode** | Synced with site theme; Monaco uses `vs-dark` / `vs-light` |
| **Error display** | Red-highlighted error messages with line numbers |
| **Execution time** | Display `executionTimeMs` from API response |

### 6.3 Example Programs

```typescript
export const examples = [
  { name: "Hello World", code: 'out "Hello, World!";' },
  { name: "Variables", code: 'set x = 42;\nset name = "Exon";\nout x;\nout name;' },
  { name: "Fibonacci", code: 'fxn fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}\nfor (set i = 0; i < 10; i = i + 1) {\n  out fib(i);\n}' },
  { name: "Closures", code: 'fxn makeCounter() {\n  set count = 0;\n  fxn increment() {\n    count = count + 1;\n    return count;\n  }\n  return increment;\n}\nset c = makeCounter();\nout c();\nout c();\nout c();' },
  { name: "Classes & Inheritance", code: '...' },
  { name: "FizzBuzz", code: '...' },
  { name: "Linked List", code: '...' },
];
```

---

## 7. Syntax Highlighting Strategy

### 7.1 Single Source of Truth

Create a shared keyword definition file that all consumers read:

```json
// shared/exon-keywords.json
{
  "keywords": {
    "control_flow": ["if", "else", "for", "when", "return"],
    "declaration": ["set", "fxn", "class"],
    "output": ["out"],
    "logical": ["and", "or"],
    "literal": ["true", "false", "nil"],
    "object": ["this", "super"]
  },
  "operators": ["+", "-", "*", "/", "=", "==", "!=", "<", ">", "<=", ">=", "!"],
  "builtins": ["clock"],
  "comment_line": "//",
  "string_delimiter": "\"",
  "inheritance_operator": "<",
  "file_extension": ".exon"
}
```

### 7.2 VS Code Extension

#### Package Structure

```
vscode-extension/
├── package.json                    ← Extension manifest
├── language-configuration.json     ← Brackets, comments, auto-close
├── syntaxes/
│   └── exon.tmLanguage.json       ← TextMate grammar
├── themes/
│   └── exon-dark.json             ← Optional custom theme
├── icons/
│   └── exon-icon.png              ← File icon
├── snippets/
│   └── exon.code-snippets.json    ← Snippets (fxn, class, for, when)
└── scripts/
    └── generate-grammar.js        ← Reads exon-keywords.json → tmLanguage
```

#### TextMate Grammar (core)

```json
{
  "scopeName": "source.exon",
  "name": "Exon",
  "fileTypes": ["exon"],
  "patterns": [
    { "include": "#comments" },
    { "include": "#strings" },
    { "include": "#numbers" },
    { "include": "#keywords" },
    { "include": "#builtins" },
    { "include": "#operators" }
  ],
  "repository": {
    "comments": {
      "name": "comment.line.double-slash.exon",
      "match": "//.*$"
    },
    "strings": {
      "name": "string.quoted.double.exon",
      "begin": "\"",
      "end": "\""
    },
    "numbers": {
      "name": "constant.numeric.exon",
      "match": "\\b[0-9]+(\\.[0-9]+)?\\b"
    },
    "keywords": {
      "patterns": [
        {
          "name": "keyword.control.exon",
          "match": "\\b(if|else|for|when|return)\\b"
        },
        {
          "name": "keyword.declaration.exon",
          "match": "\\b(set|fxn|class)\\b"
        },
        {
          "name": "keyword.other.exon",
          "match": "\\b(out)\\b"
        },
        {
          "name": "keyword.operator.logical.exon",
          "match": "\\b(and|or)\\b"
        },
        {
          "name": "constant.language.exon",
          "match": "\\b(true|false|nil)\\b"
        },
        {
          "name": "variable.language.exon",
          "match": "\\b(this|super)\\b"
        }
      ]
    },
    "builtins": {
      "name": "support.function.builtin.exon",
      "match": "\\b(clock)\\b"
    }
  }
}
```

#### Language Configuration

```json
{
  "comments": { "lineComment": "//" },
  "brackets": [ ["{", "}"], ["(", ")"] ],
  "autoClosingPairs": [
    { "open": "{", "close": "}" },
    { "open": "(", "close": ")" },
    { "open": "\"", "close": "\"" }
  ],
  "surroundingPairs": [
    { "open": "{", "close": "}" },
    { "open": "(", "close": ")" },
    { "open": "\"", "close": "\"" }
  ],
  "indentationRules": {
    "increaseIndentPattern": "\\{\\s*$",
    "decreaseIndentPattern": "^\\s*\\}"
  }
}
```

### 7.3 Monaco Editor Integration

Register a custom language in the playground:

```typescript
// lib/exon-language.ts
import * as monaco from 'monaco-editor';
import keywords from '../../shared/exon-keywords.json';

export function registerExonLanguage() {
  monaco.languages.register({ id: 'exon', extensions: ['.exon'] });
  
  monaco.languages.setMonarchTokensProvider('exon', {
    keywords: Object.values(keywords.keywords).flat(),
    builtins: keywords.builtins,
    
    tokenizer: {
      root: [
        [/\/\/.*$/, 'comment'],
        [/"[^"]*"/, 'string'],
        [/\b[0-9]+(\.[0-9]+)?\b/, 'number'],
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@builtins': 'support.function',
            '@default': 'identifier'
          }
        }],
        [/[{}()\[\]]/, '@brackets'],
        [/[<>]=?|[!=]=|[+\-*/=!]/, 'operator'],
      ],
    },
  });
  
  // Auto-completion
  monaco.languages.registerCompletionItemProvider('exon', {
    provideCompletionItems: (model, position) => {
      const suggestions = Object.values(keywords.keywords).flat().map(kw => ({
        label: kw,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: kw,
      }));
      return { suggestions };
    }
  });
}
```

---

## 8. Development Roadmap

### Milestone 1: Refactor Interpreter into Reusable Library
**Duration:** 4–5 days

#### Deliverables
- [x] `ExonEngine.run(String source)` → `ExonResult` public API
- [x] `OutputCollector` replacing `System.out.println()`
- [x] `ErrorCollector` replacing static `hadError` / `hadRuntimeError`
- [x] `ExonConfig` for sandboxing (max output lines, etc.)
- [x] `ExonResult` record (success, output, errors, executionTimeMs)
- [x] Migrate from Makefile to Gradle with `java-library` plugin
- [x] CLI wrapper (`Exon.java`) calls `ExonEngine` internally
- [x] Add native builtins: `len(string)` → number, `str(value)` → string, `type(value)` → string
- [x] All existing `test.exon` tests still pass + new tests for builtins

---

### Milestone 2: Build Spring Boot API
**Duration:** 2–3 days

#### Deliverables
- [x] Spring Boot 3.x project with `exon-interpreter` as a Gradle dependency
- [x] `POST /api/run` endpoint with request validation
- [x] `ExecutionService` with timeout (5s), output limit (1000 lines), source limit (10KB)
- [x] CORS configuration for `localhost:3000`
- [x] Rate limiting (30 req/min per IP)
- [x] `GET /api/health` endpoint
- [x] `GET /api/examples` / `GET /api/examples/{id}` endpoints
- [x] Dockerfile for the API
- [x] Integration tests

---

### Milestone 3: Create Documentation Website Foundation
**Duration:** 5–7 days

#### Deliverables
- [x] Next.js 16 app with Tailwind CSS + shadcn/ui
- [x] Global layout: Header (logo, nav, theme toggle), Footer
- [x] Docs layout: Sidebar navigation, Previous/Next pagination
- [x] MDX pipeline: Content separation in `content/`
- [x] Theme system: Dark/light with CSS custom properties
- [x] `docs-config.ts`: Navigation structure (order, titles, slugs)
- [x] 3–4 initial documentation pages (Introduction, Getting Started, Variables)
- [x] Responsive design: Mobile sidebar as drawer
- [x] SEO: `<title>`, `<meta>` description per page, Open Graph tags

---

### Milestone 4: Build Playground Page
**Duration:** 3–4 days

#### Deliverables
- [x] `/playground` route with split-pane layout
- [x] Monaco Editor integration with basic JavaScript/text mode
- [x] API client calling `POST /api/run`
- [x] Output console with stdout/stderr styling
- [x] Run, Clear, Copy buttons
- [x] Example program selector
- [x] Keyboard shortcut (Ctrl+Enter)
- [x] Loading spinner during execution
- [x] Error display with line highlighting
- [x] Responsive: stacked on mobile

---

### Milestone 5: Integrate Monaco Editor with Exon Language
**Duration:** 2–3 days

#### Deliverables
- [x] `shared/exon-keywords.json` — single source of truth
- [x] Monaco Monarch tokenizer for Exon (keywords, strings, numbers, comments, operators)
- [x] Auto-completion for all 16 keywords + `clock()` builtin
- [x] Custom editor theme matching the website's dark/light modes
- [x] Bracket matching and auto-closing for `{}`, `()`, `""`
- [x] Comment toggling (`Ctrl+/`)

---

### Milestone 6: VS Code Extension for .exon Files
**Duration:** 2–3 days

#### Deliverables
- [x] `vscode-extension/package.json` with `contributes.languages` and `contributes.grammars`
- [x] `exon.tmLanguage.json` — full TextMate grammar
- [x] `language-configuration.json` — brackets, comments, indentation
- [x] Code snippets (`fxn`, `class`, `for`, `when`)
- [x] File icon for `.exon` files
- [x] README with screenshots
- [x] `scripts/generate-grammar.js` — generates tmLanguage from `exon-keywords.json`

---

### Milestone 7: Complete Documentation Content
**Duration:** 5–7 days

#### Deliverables
- [x] All 18 documentation pages written in STE100 Simplified Technical English
- [x] Each page contains 2–4 runnable code snippets
- [x] `InteractiveCodeBlock` component wired to API
- [x] Copy-to-clipboard on all code blocks
- [x] "Open in Playground" button on code blocks
- [x] Language Reference page with:
  - Complete keyword table
  - Operator precedence table
  - Formal grammar in EBNF
- [x] Examples page with 6–8 complete programs
- [x] Client-side search (FlexSearch indexing all page content)

---

### Milestone 8: Deploy
**Duration:** 2–3 days

#### Deployment Architecture

| Component | Platform | Why |
|:---|:---|:---|
| **Website** | Vercel | Zero-config Next.js deployment, global CDN, free |
| **API** | Render | Free tier JVM hosting with Dockerfile support |
| **Domain** | `exon-lang.vercel.app` | Default Vercel subdomain |

#### Deliverables
- [x] Website deployed to Vercel at `exon-lang.vercel.app`
- [x] API deployed to Render free tier with Dockerfile
- [x] Keep-alive cron via GitHub Actions: `GET /api/health` every 14 minutes
- [x] GitHub Actions CI/CD: Automated builds and deploys
- [x] SSL / HTTPS on all endpoints

---

### Milestone 9: Polish & DX
**Duration:** 3–5 days (ongoing)

#### Deliverables
- [x] Shareable playground links (`?code=base64encoded`)
- [x] Analytics (Vercel Analytics)
- [x] Accessibility audit (WCAG 2.1 AA)
- [x] Open Graph images for social sharing
- [x] GitHub repository polish:
  - Professional README with badges, screenshots, architecture diagram
  - Issue templates
- [x] 404 page with "Try the playground" CTA

---

## 9. Additional Features for Portfolio Impact

### High-Impact Features

| Feature | Why It Matters | Effort |
|:---|:---|:---|
| **Playground share links** | Viral loop; demonstrates deep frontend thinking | Low |
| **Cmd+K search** | Modern DX pattern (like shadcn, Vercel, Stripe) | Medium |
| **"Edit on GitHub" links** | Shows open-source mindset | Low |
| **Mobile playground** | Shows responsive design mastery | Medium |
| **Execution time display** | Shows attention to detail | Low |

> [!WARNING]
> **Risk 2: JVM cold start on free hosting.** The API will be slow to respond after idle periods. Mitigate with a keep-alive ping or plan for a GraalVM native image build.

> [!WARNING]
> **Risk 3: Interpreter limitations for demos.** Exon lacks arrays, string methods, and standard library functions. Complex playground examples will feel limited. Consider adding 2–3 builtins (`len`, `str`, `input`) as a quick win before launch.

### Suggested Improvements

1. **Add `len(string)` and `str(value)` builtins** — trivial to implement, makes examples much more interesting.
2. **Add array literals** (`[1, 2, 3]`) — significant language addition but makes examples dramatically better. Consider post-launch.
3. **Add an `AstPrinter` output mode** to the API (`POST /api/ast`) — visualise the AST of any program. This is a unique feature no other playground offers and demonstrates compiler knowledge. An [AstPrinter.java](file:///f:/Coding/interpreator/Exon%20Site/Interpreter/com/interpreter/exon/AstPrinter.java) already exists in the codebase and can be reused.
4. **Write a blog post** about building Exon — link from the docs site. Technical writing is a strong portfolio signal.
5. **Record a demo video** — 2-minute screen recording showing the playground, docs, and VS Code extension. Embed on the landing page.

---

## Open Questions

> [!IMPORTANT]
> **Q1: Tailwind CSS.** The existing `package.json` includes Tailwind v4 and `@tailwindcss/postcss`. Per the project rules, I will use Vanilla CSS. However, should I remove Tailwind from the project, or do you want to keep using it?

> [!IMPORTANT]
> **Q2: MDX vs. Hardcoded Pages.** Do you want documentation as MDX files in a `content/` directory (easier to edit, content/code separation), or as `.tsx` page components (more control, inline interactivity)? I recommend MDX for maintainability.

> [!IMPORTANT]
> **Q3: API Hosting Budget.** Free-tier JVM hosting (Railway, Render) has cold start delays. Are you willing to use a paid tier ($5–7/month), or should I plan for cold-start mitigations (keep-alive pings, GraalVM native image)?

> [!IMPORTANT]
> **Q4: Interpreter Enhancements.** Before building the ecosystem, do you want to add a few builtins (`len`, `str`, `type`) to make playground examples more compelling? This is a 1–2 day detour that significantly improves demo quality.

> [!IMPORTANT]
> **Q5: Domain Name.** Do you have a domain in mind (e.g., `exon-lang.dev`, `exonlang.org`), or should the plan assume deployment to a Vercel subdomain (`exon.vercel.app`)?
