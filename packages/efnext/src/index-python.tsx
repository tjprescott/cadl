import { ComponentChildren, SourceNode } from "#jsx/jsx-runtime";
import { EmitContext, Model, ModelProperty, Operation, Type, Union, getService } from "@typespec/compiler";
import { EmitOutput, SourceFile } from "./framework/components/index.js";
import { Block } from "./typescript/block.js";
import { Function } from "./typescript/function.js";
import { $verbatim, ObjectValue } from "./typescript/value.js";
import { render, renderToSourceFiles } from "./framework/core/render.js";
import { TypeDeclaration } from "./typescript/type-declaration.js";
import { code } from "./framework/core/code.js";
import { TypeExpression } from "./typescript/type-expression.js";
import { Reference } from "./typescript/reference.js";

type Declaration = Type & { name: string };

interface AppFolder {
  path: string;
  types: Declaration[];
  operations: Operation[];
  subfolders: AppFolder[];
}

export async function $onEmit(context: EmitContext) {
  const rootFolder = queryApp(context);

  return <EmitOutput>
    <AppFolder folder={rootFolder} />
  </EmitOutput>
}

interface AppFolderProps {
  folder: AppFolder;
}

export function AppFolder({folder}: AppFolderProps) {
  const models = folder.types.map(t => (
    <TypeDeclaration type={t} /> // rote conversion of typespec type to python type
  ));

  const operations = folder.operations.map(o => (
    <ClientOperation operation={o} />
  ))

  const internalOperations = folder.operations.map(o => (
    <InternalClientOperation operation={o} />
  ))

  const subfolders = folder.subfolders.map(s => (
    <AppFolder folder={s} />
  ))

  return (
    <SourceDirectory path={folder.path}>
      <SourceFile path="__init__.py" filetype="python">
        // todo
      </SourceFile>
      <SourceFile path="models.py" filetype="python">
        {models}
      </SourceFile>
      <SourceFile path="operations.py" filetype="python">
        {operations}
      </SourceFile>
      <SourceFile path="_operations.py" filetype="python">
        {internalOperations}
      </SourceFile>

      {subfolders}
    </SourceDirectory>
  )
}



export interface InitPyProps {
  folder: AppFolder;
}

export function InitPy({folder}: InitPyProps) {
  let imports = [];
  let all = [];

  for (const subfolder of folder.subfolders) {
    imports.push(`from .${subfolder.path} import *`);
    all.push(subfolder.path);
  }

  if (folder.types.length > 0) {
    const typeNames = folder.types.map(t => t.name);
    imports.push(`from models import ${typeNames.join(",")}`);
    all.concat(typeNames);
  }

  if (folder.operations.length > 0) {
    const opNames = folder.operations.map(t => t.name);
    imports.push(`from operations import ${opNames.join(",")}`);
    all.concat(opNames);
  }

  return code`
    ${imports}
    
    __all__ = [
      ${all.map(v => `"{v}"`).join("\n")}
    ]

  `
}

interface ClientOperationProps {
  operation: Operation
}

// Todo: should list import be conditional?
export function ClientOperation({ operation }: ClientOperationProps) {
  const functionDef = (
    <Function type={operation}>
      return <Reference refkey={getRefkey(operation, "internal")} />
    </Function>
  )

  return code`
    from typings import List

    ${functionDef}
  `
}

interface InternalClientOperationProps {
  operation: Operation;
}
export function InternalClientOperation({ operation }: InternalClientOperationProps) {
  const name = setName(operation, defaultName => `_${defaultName}`);
  const functionDef = (
    <Function type={operation} name={name} refkey={getRefkey(operation, "internal")}>
      raise NotImplementedError
    </Function>
  )

  return code`
    from typings import List
    
    def ${operation.name}() => ${<TypeExpression type={operation.returnType} />}
      return ${<Reference refkey={getRefkey(operation, "internal")} />};
  `
}

// use compiler APIs to assemble this structure.
function queryApp({ program }: EmitContext) {
  const rootFolder: AppFolder = {
    path: "./",
    types: [],
    operations: [],
    subfolders: []
  }


  return rootFolder;
}

// a function which implements the emitter's naming strategy.
declare function getName(type: Type): string;
// registers names so you can always get the name you previously set
declare function setName(type: Type, name: string | ((cb: string) => string)): string;

declare function getRefkey(type: Type, variant: string): symbol;