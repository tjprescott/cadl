import { IntrinsicType, ModelIndexer, Scalar, Type } from "@typespec/compiler";
import { InterfaceExpression } from "./interface-expression.js";
import { Reference } from "./reference.js";
import { TypeLiteral } from "./type-literal.js";

export interface TypeExpressionProps {
  type: Type;
}

export function TypeExpression({ type }: TypeExpressionProps) {
  const arraySuffix = isArrayType(type) ? "[]" : "";
  const resolvedType = isArrayType(type) ? type.indexer.value : type;

  if ("name" in resolvedType && resolvedType.name) {
    if (isScalarOrIntrinsicType(resolvedType)) {
      return (
        <>
          {getScalarIntrinsicExpression(resolvedType)}
          {arraySuffix}
        </>
      );
    }
    return (
      <>
        <Reference refkey={resolvedType} />
        {arraySuffix}
      </>
    );
  }

  switch (type.kind) {
    case "Boolean":
    case "Number":
    case "String":
      return <TypeLiteral type={type} />;
    case "Model":
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

function isArrayType(type: Type): type is Type & { indexer: ModelIndexer } {
  return "indexer" in type && type.indexer !== undefined;
}

function isScalarOrIntrinsicType(type: Type): type is Scalar | IntrinsicType {
  return type.kind === "Scalar" || type.kind === "Intrinsic";
}
