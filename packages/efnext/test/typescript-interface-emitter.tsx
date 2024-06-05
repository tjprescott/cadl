import { EmitContext, Program } from "@typespec/compiler";
import { EmitOutput, SourceFile } from "../src/framework/components/index.js";
import { EnumDeclaration } from "../src/typescript/enum-declaration.js";
import { Function } from "../src/typescript/function.js";
import { InterfaceDeclaration } from "../src/typescript/interface-declaration.js";
import { UnionDeclaration } from "../src/typescript/union-declaration.js";

export function $onEmit(context: EmitContext) {
  return emitTypescriptInterfaces(context.program);
}

export function emitTypescriptInterfaces(program: Program) {
  const globalNamespace = program.getGlobalNamespaceType();

  // const namespaces = [...globalNamespace.namespaces.values()];
  const models = [...globalNamespace.models.values()];
  const operations = [...globalNamespace.operations.values()];
  const enums = [...globalNamespace.enums.values()];
  const unions = [...globalNamespace.unions.values()];
  const interfaces = [...globalNamespace.interfaces.values()];
  // const scalars = [...globalNamespace.scalars.values()];

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
      </SourceFile>
    </EmitOutput>
  );
}
