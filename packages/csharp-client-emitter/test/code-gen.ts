// Simple smoke test verifying the plugin is able to be loaded via prettier.
import { writeFileSync } from "fs";
import prettier, { Parser, SupportLanguage } from "prettier";
import { CSharpDocument, SyntaxKind } from "../src/csharp-syntax.js";
import { csharpPrinter } from "../src/index.js";

const csTypes = {
  string: { kind: SyntaxKind.TypeReference, id: "string" },
} as const;

const ast2: CSharpDocument = {
  kind: SyntaxKind.CSharpDocument,
  statements: [
    {
      kind: SyntaxKind.Class,
      id: "Foo",
      visibility: "public",
      body: [
        {
          kind: SyntaxKind.ClassProperty,
          type: csTypes.string,
          visibility: "public",
          id: "Prop1",
          get: true,
        },
        {
          kind: SyntaxKind.ClassProperty,
          type: { ...csTypes.string, nullable: true },
          visibility: "public",
          id: "Prop2",
          get: true,
          set: true,
          default: { kind: SyntaxKind.StringLiteral, value: "my-default" },
        },
      ],
    },
  ],
};

const ast: CSharpDocument = {
  kind: SyntaxKind.CSharpDocument,
  statements: [
    {
      kind: SyntaxKind.Class,
      id: "UserDetails",
      visibility: "public",
      body: [
        {
          kind: SyntaxKind.ClassProperty,
          type: csTypes.string,
          visibility: "public",
          id: "FirstName",
          get: true,
          set: true,
          attributes: [
            {
              kind: SyntaxKind.Attribute,
              funcs: [
                {
                  kind: SyntaxKind.AttributeFunc,
                  name: "Length",
                  arguments: [{ kind: SyntaxKind.NumericLiteral, value: "50" }],
                },
              ],
            },
          ],
        },
        {
          kind: SyntaxKind.ClassProperty,
          type: csTypes.string,
          visibility: "public",
          id: "LastName",
          get: true,
          set: true,
          attributes: [
            {
              kind: SyntaxKind.Attribute,
              funcs: [
                {
                  kind: SyntaxKind.AttributeFunc,
                  name: "Length",
                  arguments: [{ kind: SyntaxKind.NumericLiteral, value: "50" }],
                },
              ],
            },
          ],
        },
        {
          kind: SyntaxKind.ClassProperty,
          type: csTypes.string,
          visibility: "public",
          id: "EmailAddress",
          get: true,
          set: true,
          attributes: [
            {
              kind: SyntaxKind.Attribute,
              funcs: [
                {
                  kind: SyntaxKind.AttributeFunc,
                  name: "Pattern",
                  arguments: [{ kind: SyntaxKind.StringLiteral, value: "\\w+\\@\\w+\\.\\w+" }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
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
  plugins: [
    {
      parsers,
      printers,
      defaultOptions: {
        tabWidth: 4,
      },
    },
  ],
});

console.log(`Output:\n${output}`);
writeFileSync("./output.cs", output);
