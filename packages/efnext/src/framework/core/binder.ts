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
  meta: any;
}

export const BinderContext = createContext<Binder>();

export interface Binder {
  createScope(name: string, parent: Scope | undefined, meta?: unknown): Scope;
  createDeclaration(name: string, scope?: Scope, refkey?: unknown): void;
  resolveDeclarationByKey(
    currentScope: Scope,
    refkey: unknown
  ): ResolutionResult | ResolutionFailure;
  resolveOrWaitForDeclaration(
    currentScope: Scope,
    refkey: unknown
  ): Promise<ResolutionResult | ResolutionFailure>;
}

export interface ResolutionFailure {
  resolved: false;
}

export interface ResolutionResult {
  resolved: true;
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
    resolveOrWaitForDeclaration,
  };

  const globalScope: Scope = {
    name: "<global>",
    bindings: new Map(),
    bindingsByKey: new Map(),
    children: new Map(),
    parent: undefined,
    binder,
    meta: {},
  };

  const knownDeclarations = new Map<unknown, OutputDeclaration>();
  const waitingDeclarations = new Map<unknown, ((value: unknown) => void)[]>();
  return binder;

  function createScope(name: string, parent: Scope = globalScope, meta?: unknown): Scope {
    const scope = {
      name,
      bindings: new Map(),
      bindingsByKey: new Map(),
      children: new Map(),
      parent,
      binder,
      meta,
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
    if (waitingDeclarations.has(refkey)) {
      const cbs = waitingDeclarations.get(refkey)!;
      for (const cb of cbs) {
        console.log("Resolving for", (refkey as any).name);
        cb(declaration);
      }
    }
    return declaration;
  }

  // todo: handle key not yet found because its yet to be declared
  function resolveDeclarationByKey(
    currentScope: Scope,
    key: unknown
  ): ResolutionFailure | ResolutionResult {
    const targetDeclaration = knownDeclarations.get(key);
    if (!targetDeclaration) {
      return { resolved: false };
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

    return { resolved: true, pathUp, pathDown, commonScope, targetDeclaration };
  }

  async function resolveOrWaitForDeclaration(scope: Scope, refkey: unknown) {
    if (!knownDeclarations.has(refkey)) {
      await declarationAvailable(refkey);
    }

    return resolveDeclarationByKey(scope, refkey);
  }

  function declarationAvailable(refkey: unknown) {
    if (!waitingDeclarations.has(refkey)) {
      waitingDeclarations.set(refkey, []);
    }

    const waitingList = waitingDeclarations.get(refkey);
    return new Promise((resolve) => {
      waitingList?.push(resolve);
    });
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
