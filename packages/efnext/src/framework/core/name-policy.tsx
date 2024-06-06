import { ComponentChildren, FunctionComponent } from "#jsx/jsx-runtime";
import { Type } from "@typespec/compiler";
import { createContext, useContext } from "./context.js";

export interface RenamerCallback {
  (type: Type): string;
}

export interface NamePolicyProviderProps {
  children?: ComponentChildren;
}

export interface Renamer {
  getName(type: Type): string;
  setName(type: Type, name: string): void;
}

export interface NamePolicy {
  renamer: Renamer;
  Provider: FunctionComponent;
}

export const RenamingPolicyContext = createContext<Renamer>();
export function useNamePolicy() {
  // it's possible this is undefined if you don't use the <EmitOutput> component
  // which initializes the default naming policy, but that seems rare.
  return useContext(RenamingPolicyContext)!;
}

export function createNamePolicy(namer: RenamerCallback) {
  const overrides = new WeakMap<Type, string>();

  const renamer: Renamer = {
    getName(type: Type) {
      if (overrides.has(type)) {
        return overrides.get(type)!;
      }

      return namer(type);
    },
    setName(type: Type, name: string) {
      overrides.set(type, name);
    },
  };

  function Provider(props: NamePolicyProviderProps) {
    return (
      <RenamingPolicyContext.Provider value={renamer}>
        {props.children}
      </RenamingPolicyContext.Provider>
    );
  }

  return {
    renamer,
    Provider,
  };
}
