import { IntrinsicType, Model, Scalar, Type } from "@typespec/compiler";
import { isArray, isDeclaration, isRecord } from "../framework/utils/typeguards.js";
import { ArrayExpression } from "./array-expression.js";
import { InterfaceExpression } from "./interface-expression.js";
import { RecordExpression } from "./record-expression.js";
import { Reference } from "./reference.js";
import { TypeLiteral } from "./type-literal.js";

export interface TypeExpressionProps {
  type: Type;
}

export function TypeExpression({ type }: TypeExpressionProps) {
  if (isDeclaration(type) && !(type as Model).indexer) {
    console.log("TypeExpression:", type.name);
    return <Reference refkey={type} />;
  }

  switch (type.kind) {
    case "Scalar":
    case "Intrinsic":
      return <>{getScalarIntrinsicExpression(type)}</>;
    case "Boolean":
    case "Number":
    case "String":
      return <TypeLiteral type={type} />;
    case "Model":
      if (isArray(type)) {
        const elementType = type.indexer.value;
        return <ArrayExpression elementType={elementType} />;
      }

      if (isRecord(type)) {
        const elementType = type.indexer.value;
        return <RecordExpression elementType={elementType} />;
      }

      return <InterfaceExpression type={type} />;

    default:
      throw new Error(type.kind + " not supported in TypeExpression");
  }
}

const intrinsicNameToTSType = new Map<string, string>([
  ["unknown", "unknown"],
  ["string", "string"],
  ["int32", "number"],
  ["int16", "number"],
  ["float16", "number"],
  ["float32", "number"],
  ["int64", "bigint"],
  ["boolean", "boolean"],
  ["null", "null"],
  ["void", "void"],
]);

function getScalarIntrinsicExpression(type: Scalar | IntrinsicType): string {
  const tsType = intrinsicNameToTSType.get(type.name);
  if (!tsType) {
    throw new Error(`Unknown scalar type ${type.name}`);
  }
  return tsType;
}
