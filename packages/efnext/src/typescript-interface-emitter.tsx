import { EmitContext, Program } from "@typespec/compiler";
import { format } from "prettier";
import { EmitOutput, SourceFile } from "../src/framework/components/index.js";
import { EnumDeclaration } from "../src/typescript/enum-declaration.js";
import { Function } from "../src/typescript/function.js";
import { InterfaceDeclaration } from "../src/typescript/interface-declaration.js";
import { ScalarDeclaration } from "../src/typescript/scalar-declaration.js";
import { UnionDeclaration } from "../src/typescript/union-declaration.js";
import { renderToSourceFiles } from "./framework/core/render.js";

export async function $onEmit(context: EmitContext) {
  const rendered = await renderToSourceFiles(emitTypescriptInterfaces(context.program));
  for (const file of rendered) {
    const output = await format(file.content, { parser: "typescript" });
    await context.program.host.writeFile(file.path, output);
  }
}

export function emitTypescriptInterfaces(program: Program) {
  const globalNamespace = program.getGlobalNamespaceType();

  const namespaces = [...globalNamespace.namespaces.values()].filter(
    (ns) => ns.name !== "TypeSpec"
  );
  const models = [...globalNamespace.models.values()];
  const operations = [...globalNamespace.operations.values()];
  const enums = [...globalNamespace.enums.values()];
  const unions = [...globalNamespace.unions.values()];
  const interfaces = [...globalNamespace.interfaces.values()];
  const scalars = [...globalNamespace.scalars.values()];

  for (const namespace of namespaces) {
    models.push(...namespace.models.values());
    operations.push(...namespace.operations.values());
    enums.push(...namespace.enums.values());
    unions.push(...namespace.unions.values());
    interfaces.push(...namespace.interfaces.values());
    scalars.push(...namespace.scalars.values());
  }

  return (
    <EmitOutput>
      <SourceFile path="test1.ts" filetype="typescript">
        {models.map((model) => (
          <InterfaceDeclaration type={model} />
        ))}
        {operations.map((operation) => (
          <Function type={operation} />
        ))}
        {enums.map((enumType) => (
          <EnumDeclaration type={enumType} />
        ))}
        {unions.map((union) => (
          <UnionDeclaration type={union}></UnionDeclaration>
        ))}
        {interfaces.map((iface) => (
          <InterfaceDeclaration type={iface} />
        ))}
        {scalars.map((scalar) => (
          <ScalarDeclaration type={scalar} />
        ))}
      </SourceFile>
    </EmitOutput>
  );
}
