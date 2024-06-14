import { Model, ModelProperty } from "@typespec/compiler";
import { Declaration } from "../framework/components/index.js";
import { code } from "../framework/core/index.js";
import { useNamePolicy } from "../framework/core/name-policy.js";
import { BaseClasses } from "./base-classes.js";
import { ClassVariable } from "./class-variable.js";
import { Decorators } from "./decorators.js";
import { mapWithSep } from "./utils.js";

/**
 * Represents the properties for a class declaration.
 */
export interface ClassDeclarationProps {
  /** The TypeSpec type this understands */
  type: Model;
  /** Name of the class. If not provided, it will be inferred from the type name per naming policy. */
  name?: string;
  /** List of decorators to apply */
  decorators?: string[];
  /** List of base classes this class derives from, in order. */
  baseClasses?: string[];
  /** List of class variables. */
  classVariables?: string[];
  /** List of instance variables. */
  instanceVariables?: string[];
  /** List of initializers. */
  initializers?: string[];
  /** List of methods the class supports. */
  methods?: string[];
  // COMMENT: Would you ever *not* have children? Could this model derive from a
  // base class that has automatically has children?
  // children?: ComponentChildren;
}

export function ClassDeclaration(props: ClassDeclarationProps) {
  // COMMENT: Is there a way for me to create and set the naming policy I want? What does that look like?
  const namer = useNamePolicy();
  const className = props.name ?? namer.getName(props.type, "class");

  // TODO: Sort the model properties based on presence of decorator to separate class and instance variables.
  const classProperties: ModelProperty[] = [];
  const instanceProperties: ModelProperty[] = [...props.type.properties.values()];

  const decorators = <Decorators values={props.decorators} />;
  const baseClasses = <BaseClasses values={props.baseClasses} />;
  const classVariables = mapWithSep(
    classProperties,
    (prop) => {
      return <ClassVariable type={prop} />;
    },
    "\n"
  );
  // TODO: Implement these
  const initializers = "";
  const methods = "";

  return (
    // COMMENT: refkey is confusing to me. What is it? Add JS docs to core components would help.
    <Declaration name={className} refkey={props.type}>
      {code`
        ${decorators}
        class ${className}${baseClasses}:
          ${classVariables}
          ${initializers}
          ${methods}
      `}
    </Declaration>
  );
}
