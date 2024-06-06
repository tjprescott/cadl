import { Operation, Type } from "@typespec/compiler";
import { SourceDirectory } from "../../framework/components/source-directory.js";
import { SourceFile } from "../../framework/components/source-file.js";
import { ClientOperation } from "./client-operation.js";
import { InitPy } from "./init-py.js";
import { InternalClientOperation } from "./internal-client-operation.js";
import { TypeDeclaration } from "./type-declaration.js";

export interface AppFolderRecord {
  path: string;
  types: Declaration[];
  operations: Operation[];
  subfolders: AppFolderRecord[];
}

export interface AppFolderProps {
  folder: AppFolderRecord;
}

type Declaration = Type & { name: string };
/**
 * This component takes an AppFolder and unpacks it, creating the needed directory,
 * source files, etc.
 */
export function AppFolder({ folder }: AppFolderProps) {
  const models = folder.types.map((t) => (
    <TypeDeclaration type={t} /> // rote conversion of typespec type to python type
  ));

  const operations = folder.operations.map((o) => <ClientOperation operation={o} />);

  const internalOperations = folder.operations.map((o) => (
    <InternalClientOperation operation={o} />
  ));

  const subfolders = folder.subfolders.map((s) => <AppFolder folder={s} />);
  console.log(`Models in ${folder.path}: ${models.map((m) => m.props.type.name)}`);

  return (
    <SourceDirectory path={folder.path}>
      <SourceFile path="__init__.py" filetype="python">
        <InitPy folder={folder} />
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
  );
}
