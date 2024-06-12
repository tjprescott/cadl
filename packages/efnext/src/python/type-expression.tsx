import { IntrinsicType, Model, Scalar, Type } from "@typespec/compiler";
import { isArray, isDeclaration, isRecord } from "../framework/utils/typeguards.js";
import { ArrayExpression } from "./array-expression.js";
import { ClassExpression } from "./class-expression.js";
import { DictionaryExpression } from "./dictionary-expression.js";
import { Reference } from "./reference.js";
import { TypeLiteral } from "./type-literal.js";
import { UnionExpression } from "./union-expression.js";
import { stdlib } from "./builtins.js";

export interface TypeExpressionProps {
  type: Type;
}

export function TypeExpression({ type }: TypeExpressionProps) {
  if (isDeclaration(type) && !(type as Model).indexer) {
    // todo: probably need abstraction around deciding what's a declaration in the output
    // (it may not correspond to things which are declarations in TypeSpec?)
    return <Reference refkey={type} />;
  }

  switch (type.kind) {
    case "Scalar":
    case "Intrinsic":
      return getScalarIntrinsicExpression(type);
    case "Boolean":
    case "Number":
    case "String":
      return <TypeLiteral type={type} />;
    case "Union":
      return <UnionExpression type={type} />;
    case "Tuple":
      return (
        <>
          <Reference builtin={stdlib.typing.Tuple} />[
          {type.values.map((element) => (
            <>
              <TypeExpression type={element} />,
            </>
          ))}
          ]
        </>
      );
    case "EnumMember":
      return (
        <>
          <Reference builtin={stdlib.typing.Literal} />[{type.enum.name}.{type.name}.value]
        </>
      );
    case "Model":
      if (isArray(type)) {
        const elementType = type.indexer.value;
        return <ArrayExpression elementType={elementType} />;
      }

      if (isRecord(type)) {
        const elementType = type.indexer.value;
        return <DictionaryExpression elementType={elementType} />;
      }

      return <ClassExpression type={type} />;

    default:
      throw new Error(type.kind + " not supported in TypeExpression");
  }
}

const intrinsicNameToPythonType = new Map<string, string>([
  ["unknown", "Any"],
  ["string", "str"],
  ["int32", "int"],
  ["int16", "int"],
  ["float16", "float"],
  ["integer", "int"],
  ["float", "float"],
  ["float32", "float"],
  ["int64", "int"], // Python's int can handle arbitrarily large integers
  ["boolean", "bool"],
  ["null", "None"],
  ["void", "None"],
  ["numeric", "float"], // Alternatively, "Union[int, float]" if mixed types are common
  ["uint64", "int"], // Python's int can handle unsigned 64-bit integers
  ["uint32", "int"],
  ["uint16", "int"],
  ["bytes", "bytes"],
  ["float64", "float"],
  ["safeint", "int"],
  ["utcDateTime", "datetime.datetime"],
  ["url", "str"],
]);

function getScalarIntrinsicExpression(type: Scalar | IntrinsicType): string {
  if (type.kind === "Scalar" && type.baseScalar && type.namespace?.name !== "TypeSpec") {
    // This is a delcared scalar
    return <Reference refkey={type} />;
  }
  const pythonType = intrinsicNameToPythonType.get(type.name);
  if (!pythonType) {
    throw new Error(`Unknown scalar type ${type.name}`);
  }
  return pythonType;
}
