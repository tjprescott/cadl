import { DecoratorContext, ModelProperty, Program } from "@typespec/compiler";

function createStateSymbol(name: string) {
  return Symbol.for(`TypeSpec.Python.${name}`);
}

const classVariableKey = createStateSymbol("classVariable");
/**
 * Marks a property as a class variable. By default, they are
 * treated as instance variables.
 */
export function $classVariable(context: DecoratorContext, target: ModelProperty) {
  context.program.stateSet(classVariableKey).add(target);
}

export function getSummary(program: Program, type: ModelProperty): boolean {
  return program.stateSet(classVariableKey).has(type);
}
