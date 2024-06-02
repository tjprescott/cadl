import { createContext } from "./context.js";

export interface OutputDeclaration {
  name: string;
  scope: Scope;
  refkey: unknown;
}

export interface Scope {
  name: string;
  bindings: Map<string, OutputDeclaration>;
  bindingsByKey: Map<unknown, OutputDeclaration>;
  children: Map<string, Scope>;
  parent: Scope | undefined;
  binder: Binder;
}

export const BinderContext = createContext<Binder>();

export interface Binder {
  createScope(name: string, parent: Scope | undefined): Scope;
  createDeclaration(name: string, scope?: Scope, refkey?: unknown): void;
  resolveDeclarationByKey(currentScope: Scope, refkey: unknown): ResolutionResult;
}

export interface ResolutionResult {
  targetDeclaration: OutputDeclaration;
  pathUp: Scope[];
  pathDown: Scope[];
  commonScope: Scope | undefined;
}

export function createOutputBinder(): Binder {
  const binder: Binder = {
    createScope,
    createDeclaration,
    resolveDeclarationByKey,
  };

  const globalScope: Scope = {
    name: "<global>",
    bindings: new Map(),
    bindingsByKey: new Map(),
    children: new Map(),
    parent: undefined,
    binder,
  };

  const knownDeclarations = new Map<unknown, OutputDeclaration>();

  return binder;

  function createScope(name: string, parent: Scope = globalScope): Scope {
    const scope = {
      name,
      bindings: new Map(),
      bindingsByKey: new Map(),
      children: new Map(),
      parent,
      binder,
    };

    if (parent) {
      parent.children.set(name, scope);
    }

    return scope;
  }

  function createDeclaration(name: string, scope: Scope = globalScope, refkey: unknown) {
    const declaration: OutputDeclaration = {
      name,
      scope,
      refkey,
    };

    const targetScope = scope ? scope : globalScope;
    targetScope.bindings.set(name, declaration);
    knownDeclarations.set(refkey, declaration);
    return declaration;
  }

  // todo: handle key not yet found because its yet to be declared
  function resolveDeclarationByKey(currentScope: Scope, key: unknown) {
    const targetDeclaration = knownDeclarations.get(key);
    if (!targetDeclaration) {
      throw new Error("Declaration must exist to be referenced");
    }
    const targetScope = targetDeclaration.scope;
    const targetChain = scopeChain(targetScope);
    const currentChain = scopeChain(currentScope);
    let diffStart = 0;
    while (
      targetChain[diffStart] &&
      currentChain[diffStart] &&
      targetChain[diffStart] === currentChain[diffStart]
    ) {
      diffStart++;
    }

    const pathUp = currentChain.slice(diffStart);
    const pathDown = targetChain.slice(diffStart);
    const commonScope = targetChain[diffStart - 1] ?? null;

    return { pathUp, pathDown, commonScope, targetDeclaration };
  }

  function scopeChain(scope: Scope | undefined) {
    const chain = [];
    while (scope) {
      chain.unshift(scope);
      scope = scope.parent;
    }

    return chain;
  }
}
