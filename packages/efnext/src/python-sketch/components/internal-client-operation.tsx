import { Operation } from "@typespec/compiler";
import { code } from "../../framework/core/code.js";
import { useNamePolicy } from "../../framework/core/name-policy.js";
import { getRefkey } from "../../framework/core/refkeyer.js";
import { Function } from "../../python/function.js";
export interface InternalClientOperationProps {
  operation: Operation;
}
/**
 * Emits an internal thing that will eventually have a declaration.
 */
export function InternalClientOperation({ operation }: InternalClientOperationProps) {
  const namer = useNamePolicy();
  const name = `_` + namer.getName(operation);
  const functionDef = (
    <Function type={operation} name={name} refkey={getRefkey(operation, "internal")}>
      raise NotImplementedError
    </Function>
  );

  return code`
    from typing import List
    
    ${functionDef}
  `;
}
