import type { Monaco } from "@monaco-editor/react";

/**
 * Registers the Exon language definition and Monarch syntax highlighter in Monaco Editor.
 */
export function registerExonLanguage(monaco: Monaco) {
  // Prevent duplicate registration
  if (monaco.languages.getLanguages().some((lang: { id: string }) => lang.id === "exon")) {
    return;
  }

  // Register language id
  monaco.languages.register({ id: "exon", extensions: [".exon"] });

  // Set language configuration (comments, brackets, auto-closing)
  monaco.languages.setLanguageConfiguration("exon", {
    comments: {
      lineComment: "//",
    },
    brackets: [
      ["{", "}"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
    ],
  });

  // Define Monarch tokens provider for syntax highlighting
  monaco.languages.setMonarchTokensProvider("exon", {
    keywords: [
      "set", "fxn", "class", "if", "else", "when", "for", "return",
      "out", "and", "or", "true", "false", "nil", "this", "super",
    ],
    builtins: ["clock", "len", "str", "type"],

    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, "comment"],

        // Strings
        [/"[^"]*"/, "string"],

        // Numbers
        [/\b[0-9]+(\.[0-9]+)?\b/, "number"],

        // Identifiers & Keywords
        [
          /[a-zA-Z_][a-zA-Z0-9_]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@builtins": "type.identifier",
              "@default": "identifier",
            },
          },
        ],

        // Brackets & Delimiters
        [/[{}()]/, "@brackets"],

        // Operators
        [/[=><!+\-*/]/, "operator"],
      ],
    },
  });
}
