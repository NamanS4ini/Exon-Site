# ⚡ Exon Programming Language Ecosystem

> A modern, object-oriented, dynamically typed programming language implementation featuring a Java 21 Tree-Walk Interpreter, Spring Boot REST API, Next.js 16 Interactive Playground & Documentation Platform, and official VS Code Extension.

[![CI](https://github.com/NamanS4ini/Exon-Site/actions/workflows/ci.yml/badge.svg)](https://github.com/NamanS4ini/Exon-Site/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black.svg)](https://nextjs.org/)
[![Spring Boot 3.4](https://img.shields.io/badge/Spring%20Boot-3.4%20Java%2021-brightgreen.svg)](https://spring.io/)

---

## ✨ Features

- **🌳 Tree-Walk Interpreter:** Built from scratch in Java 21 with 5 execution pipeline stages (Scanner -> Parser -> Resolver -> Evaluator -> OutputCollector).
- **🚀 Sandboxed Spring Boot API (`POST /api/run` & `POST /api/ast`):** Multithreaded execution service with strict 5-second timeouts, line limits, CORS policy, and Bucket4j rate limiting (30 req/min).
- **💻 Interactive Playground (`/playground`):** Monaco Editor integration with custom Monarch syntax highlighting engine, live stdout/stderr console, AST visualizer tab, execution timer (ms), status badges, and shareable encoded URLs.
- **📚 18-Page Interactive Documentation Suite (`/docs`):** Complete documentation covering language basics, control flow, functions, closures, classes, inheritance, builtins, and error handling. Every code snippet includes an interactive **▶ Run** button and inline output terminal.
- **🔍 Cmd+K Documentation Search:** Fast keyboard-driven client-side search modal (`Cmd+K` / `Ctrl+K`) to jump directly to any topic.
- **🎨 Official VS Code Extension (`vscode-extension/`):** Full TextMate syntax grammar (`.exon`), bracket matching, line comments (`//`), auto-closing pairs, and autocomplete snippets (`fxn`, `class`, `set`, `out`, `for`, `when`).
- **📱 Responsive Mobile Design:** Fully optimized drawer navigation, stacked IDE containers, and responsive grids for mobile, tablet, and desktop screens.
- **🔄 GitHub Actions CI/CD:** Automated builds verifying Next.js static site generation and Spring Boot Gradle compilation on every push & pull request.

---

## 💻 Exon Code Example

```exon
// Declare a class with constructors and methods
class Greeter {
  init(name) {
    this.name = name;
  }

  sayHello(times) {
    for (set i = 0; i < times; set i = i + 1) {
      out "Hello, " + this.name + "! (count: " + str(i + 1) + ")";
    }
  }
}

// Instantiate and invoke
set g = Greeter("Alice");
g.sayHello(3);
```

---

## 🛠️ Repository Architecture

```text
Exon-Site/
├── api/                                # Spring Boot 3.4 REST API & Core Java Interpreter
│   ├── src/main/java/com/
│   │   ├── interpreter/exon/           # Scanner, Parser, Resolver, Interpreter, AstPrinter
│   │   └── exon/api/                   # Controllers (/run, /ast, /health), Services, Rate-Limiting
│   └── build.gradle.kts                # Gradle configuration (Java 21 bytecode target)
├── app/                                # Next.js 16 (App Router) Website
│   ├── docs/                           # 18 static documentation pages
│   ├── playground/                     # Monaco IDE & AST Visualizer page
│   ├── layout.tsx                      # Root layout, Header with logo (icon.png), ThemeToggle
│   └── globals.css                     # Responsive CSS design system (No radial/linear gradients)
├── components/                         # React Components (SearchModal, CodeBlock, Header, Footer)
├── lib/                                # Monaco Exon syntax tokenizer (exon-monaco.ts)
├── shared/                             # Single source of truth keyword spec (exon-keywords.json)
├── vscode-extension/                   # Official Exon VS Code Extension package
└── .github/workflows/ci.yml            # CI/CD GitHub Actions pipeline
```

---

## ⚡ Quick Start (Run Locally)

### 1. Next.js Web App & Playground

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
# Open http://localhost:3000
```

### 2. Spring Boot Backend API

```bash
cd api

# Run API backend
./gradlew bootRun
# REST API listens on http://localhost:8080
```

---

## 🧪 Building & Verification

```bash
# Build Next.js static production bundle (24 prerendered routes)
npm run build

# Compile & test Spring Boot API
cd api
./gradlew build --no-daemon
```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

Developed by [Naman Saini](https://github.com/NamanS4ini).
