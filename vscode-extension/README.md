# Exon Language Support for Visual Studio Code

Official VS Code extension for the **Exon** programming language. Provides syntax highlighting, auto-closing brackets, line comments, and code snippets.

---

## ✨ Features

- **Syntax Highlighting:** TextMate grammar for Exon keywords (`set`, `fxn`, `class`, `out`, `when`, `for`, `if`, `else`, `return`, `this`, `super`, `and`, `or`, `true`, `false`, `nil`), native functions (`clock`, `len`, `str`, `type`), strings, numbers, and comments (`//`).
- **Smart Indentation & Auto-Closing:** Automatic bracket matching (`{}`, `()`), quote pairing (`""`), and auto-indenting for block structures.
- **Code Snippets:** Autocomplete snippets for common Exon patterns:
  - `fxn` → Function declaration
  - `class` → Class definition with constructor
  - `set` → Variable declaration
  - `out` → Output statement
  - `for` → For loop
  - `when` → While-style loop
  - `if` / `ifelse` → Conditionals

---

## 🚀 Installation

### Option 1: Manual VSIX Installation (Local)

1. Build the `.vsix` package:
   ```bash
   npx vsce package
   ```
2. In VS Code, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and run **Extensions: Install from VSIX...**.
3. Select `exon-vscode-1.0.0.vsix`.

### Option 2: Copy to Extensions Folder

Copy the `vscode-extension` directory to your local VS Code extensions folder:
- **Windows:** `%USERPROFILE%\.vscode\extensions\exon-vscode`
- **macOS / Linux:** `~/.vscode/extensions/exon-vscode`

---

## 📜 Language Overview

```exon
// Exon Example Program
class Counter {
  init(start) {
    this.value = start;
  }
  tick() {
    this.value = this.value + 1;
    out "Count: " + str(this.value);
  }
}

set c = Counter(0);
for (set i = 0; i < 3; i = i + 1) {
  c.tick();
}
```

---

## 📄 License

MIT © [Naman Saini](https://github.com/NamanS4ini)
