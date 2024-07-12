import { ComponentChild } from "#jsx/jsx-runtime";
import { Enum } from "@typespec/compiler";
import { Declaration } from "../framework/components/index.js";
import { code } from "../framework/core/index.js";
import { useNamePolicy } from "../framework/core/name-policy.js";
import { BaseClasses } from "./base-classes.js";
import { ConstantDeclaration } from "./constant-declaration.js";
import { mapWithSep } from "./utils.js";

/**
 * Represents the properties for a class declaration.
 */
export interface EnumDeclarationModel {
  /** The TypeSpec type this understands */
  type: Enum;
  /** Name of the class. If not provided, it will be inferred from the type name per naming policy. */
  name?: string;
  children?: ComponentChild[];
}

export function EnumDeclaration({ type, name, children }: EnumDeclarationModel) {
  if (type.kind !== "Enum") return undefined;

  const namer = useNamePolicy();
  const enumName = name ?? namer.getName(type, "class");
  const memberComponents = mapWithSep(
    type.members.values(),
    (member) => {
      const value = member.value ?? member.name;
      return <ConstantDeclaration name={member.name} value={value} />;
    },
    "\n"
  );
  const baseClasses = ["Enum"];
  const baseClassComponents = <BaseClasses values={baseClasses} />;

  // TODO: Check if anything is already defined in children
  return (
    <Declaration name={enumName} refkey={type}>
      {code`
        class ${enumName}${baseClassComponents}:
          ${memberComponents}
          ${children}
      `}
    </Declaration>
  );
}
