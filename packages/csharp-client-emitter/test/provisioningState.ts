import { CSharpDocument, SyntaxKind } from "../src/csharp-syntax.js";

export const ProvisioningState: CSharpDocument = {
  kind: SyntaxKind.CSharpDocument,
  headerComments: [
    {
      kind: SyntaxKind.Comment,
      leading: false,
      trailing: false,
      value: `//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------`,
    },
  ],
  statements: [
    {
      kind: SyntaxKind.Namespace,
      id: "Microsoft.Confluent.Service.Models",
      statements: [
        {
          kind: SyntaxKind.Struct,
          id: "ProvisioningState",
          visibility: "public",
          comments: [
            {
              kind: SyntaxKind.Comment,
              leading: true,
              trailing: false,
              value: `/// <summary>
/// Status of the resource operation.
/// </summary>`,
            },
          ],
          members: [
            {
              kind: SyntaxKind.Field,
              type: { kind: SyntaxKind.TypeReference, id: "ProvisioningState" },
              visibility: "public",
              static: true,
              readonly: true,
              declarations: [
                { id: "Completed", value: { kind: SyntaxKind.StringLiteral, value: "Completed" } },
                {
                  id: "ResolvingDNS",
                  value: { kind: SyntaxKind.StringLiteral, value: "ResolvingDNS" },
                },
                {
                  id: "Moving",
                  value: { kind: SyntaxKind.StringLiteral, value: "Moving" },
                },
                {
                  id: "Deleting",
                  value: { kind: SyntaxKind.StringLiteral, value: "Deleting" },
                },
                {
                  id: "Succeeded",
                  value: { kind: SyntaxKind.StringLiteral, value: "Succeeded" },
                },
                {
                  id: "Failed",
                  value: { kind: SyntaxKind.StringLiteral, value: "Failed" },
                },
              ],
            },
            {
              kind: SyntaxKind.Field,
              type: { kind: SyntaxKind.TypeReference, id: "string" },
              visibility: "public",
              declarations: [{ id: "_value" }],
            },
            {
              kind: SyntaxKind.Method,
              visibility: "public",
              id: "ProvisioningState",
              arguments: [
                {
                  kind: SyntaxKind.ArgumentDeclaration,
                  id: "state",
                  type: { kind: SyntaxKind.TypeReference, id: "string" },
                },
              ],
              body: [
                {
                  kind: SyntaxKind.Raw,
                  value: "_value = state;",
                },
              ],
            },
            {
              kind: SyntaxKind.Method,
              visibility: "public",
              override: true,
              id: "ToString",
              body: [
                {
                  kind: SyntaxKind.Raw,
                  value: "return _value;",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
