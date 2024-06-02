import { ComponentChildren } from "#jsx/jsx-runtime";
import { BinderContext, createOutputBinder } from "../core/binder.js";

export interface EmitOutputProps {
  children?: ComponentChildren
}
export function EmitOutput({ children }: EmitOutputProps) {
  const binder = createOutputBinder();
  return <BinderContext.Provider value={binder}>
    {children}
  </BinderContext.Provider>
}
