import { createContext, useContext } from "../core/context.js";
import { BinderContext, Scope } from "../core/binder.js";
import { ComponentChildren } from "#jsx/jsx-runtime";

export const ScopeContext = createContext<Scope>();

export interface ScopeProps {
  name: string;
  children?: ComponentChildren;
  meta?: unknown;
}
export function Scope({ name, children, meta }: ScopeProps) {
  const binder = useContext(BinderContext);
  if (!binder) {
    throw new Error("Scope requires binder context");
  }
  const currentScope = useContext(ScopeContext);
  const newScope = binder.createScope(name, currentScope, meta);
  return <ScopeContext.Provider value={newScope}>
    {children}
  </ScopeContext.Provider>;
}