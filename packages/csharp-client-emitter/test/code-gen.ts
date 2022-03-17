// Simple smoke test verifying the plugin is able to be loaded via prettier.
import { writeFileSync } from "fs";
import prettier, { Parser, SupportLanguage } from "prettier";
import { CSharpDocument, SyntaxKind } from "../src/csharp-syntax.js";
import { csharpPrinter } from "../src/index.js";

const ast: CSharpDocument = {
  kind: SyntaxKind.CSharpDocument,
  statements: [{ kind: SyntaxKind.Class }],
};

export const languages: SupportLanguage[] = [
  {
    name: "CSharp",
    parsers: ["cs"],
    extensions: [".cs"],
    vscodeLanguageIds: ["cs"],
  },
];

const CSharpParser: Parser = {
  parse: () => ast,
  astFormat: "cs-format",
  locStart(node) {
    return 0;
  },
  locEnd(node) {
    return 0;
  },
};

export const parsers = {
  cs: CSharpParser,
};

export const printers = {
  "cs-format": csharpPrinter,
};

const output = prettier.format(".", {
  parser: "cs",
  plugins: [{ parsers, printers }],
});

console.log("Output", output);
writeFileSync("./output.cs", output);
