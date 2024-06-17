import { IntrinsicType, Model, Scalar, Type } from "@typespec/compiler";
// COMMENT: I don't love these kinds of things because I feel like you have to "know" to call them, which seems like a pit of failure.
// I could see people reimplementing these on their own, not realizing they exist.
import { isDeclaration } from "../framework/utils/typeguards.js";
import { Reference } from "./reference.js";
import { TypeLiteral } from "./type-literal.js";

export interface TypeExpressionModel {
  type: Type;
}

export function TypeExpression({ type }: TypeExpressionModel) {
  // COMMENT: Ideally someone doesn't have to "know" to call these, especially
  // the "no indexer" aspect. This was something EFv1 kind of handled for you.
  if (isDeclaration(type) && !(type as Model).indexer) {
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
    // TODO: Enable these as we support them
    // case "Union":
    //   return <UnionExpression type={type} />;
    // case "Tuple":
    //   return (
    //     <>
    //       <Reference builtin={stdlib.typing.Tuple} />[
    //       {type.values.map((element) => (
    //         <>
    //           <TypeExpression type={element} />,
    //         </>
    //       ))}
    //       ]
    //     </>
    //   );
    // case "EnumMember":
    //   return (
    //     <>
    //       <Reference builtin={stdlib.typing.Literal} />[{type.enum.name}.{type.name}.value]
    //     </>
    //   );
    // case "Model":
    //   if (isArray(type)) {
    //     const elementType = type.indexer.value;
    //     return <ArrayExpression elementType={elementType} />;
    //   }

    //   if (isRecord(type)) {
    //     const elementType = type.indexer.value;
    //     return <DictionaryExpression elementType={elementType} />;
    //   }

    //   return <ClassExpression type={type} />;

    default:
      throw new Error(type.kind + " not supported in TypeExpression");
  }
}

// COMMENT: Since every language is going to have its own intrinsic types,
// I wonder if there's a way to make the outline of this solution generic,
// like namePolicy.
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
    // This is a declared scalar
    return <Reference refkey={type} />;
  }
  const pythonType = intrinsicNameToPythonType.get(type.name);
  if (!pythonType) {
    throw new Error(`Unknown scalar type ${type.name}`);
  }
  return pythonType;
}
