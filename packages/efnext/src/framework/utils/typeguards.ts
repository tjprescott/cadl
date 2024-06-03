import { Interface, Model, ModelProperty, Operation } from "@typespec/compiler";

export function isModel(type: any): type is Model {
  return type.kind === "Model";
}

export function isInterface(type: any): type is Interface {
  return type.kind === "Interface";
}

export function isOperation(type: any): type is Operation {
  return type.kind === "Operation";
}

export function isModelProperty(type: any): type is ModelProperty {
  return type.kind === "ModelProperty";
}
