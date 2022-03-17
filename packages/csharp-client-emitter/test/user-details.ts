import { CSharpDocument, SyntaxKind } from "../src/csharp-syntax.js";

export const userDetails: CSharpDocument = {
  kind: SyntaxKind.CSharpDocument,
  usings: [
    {
      kind: SyntaxKind.Using,
      name: "Microsoft.Cadl.ProviderHub",
    },
    {
      kind: SyntaxKind.Using,
      name: "System.Security.Policy",
    },
  ],
  statements: [
    {
      kind: SyntaxKind.Namespace,
      id: "Microsoft.Confluent.Service.Models",
      statements: [
        {
          kind: SyntaxKind.Class,
          id: "UserDetails",
          visibility: "public",
          body: [
            {
              kind: SyntaxKind.ClassProperty,
              type: { kind: SyntaxKind.TypeReference, id: "string" },
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
              type: { kind: SyntaxKind.TypeReference, id: "string" },
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
              type: { kind: SyntaxKind.TypeReference, id: "string" },
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
    },
  ],
};
