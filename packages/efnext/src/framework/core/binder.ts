export interface OutputDeclaration {
  name: string;
}

export interface Scope {
  name: string;
  bindings: Map<string, OutputDeclaration>;
  children: Map<string, Scope>;
  parent: Scope | null;
}

export function createOutputBinder() {
  const globalScope = createScope("<global>");

  return {
    createScope,
    createDeclaration,
  };

  function createScope(name: string, parent: Scope | null = null): Scope {
    const scope = {
      name,
      bindings: new Map(),
      children: new Map(),
      parent,
    };

    if (parent) {
      parent.children.set(name, scope);
    }

    return scope;
  }

  function createDeclaration(name: string, scope: Scope) {
    const declaration: OutputDeclaration = {
      name,
    };

    scope.bindings.set(name, declaration);
  }
}
