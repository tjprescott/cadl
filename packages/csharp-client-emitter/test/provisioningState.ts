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
          body: [
            {
              kind: SyntaxKind.Field,
              type: { kind: SyntaxKind.TypeReference, id: "string" },
              visibility: "public",
              id: "_value",
            },
          ],
        },
      ],
    },
  ],
};
