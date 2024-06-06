import { Operation } from "@typespec/compiler";
import { code } from "../../framework/core/code.js";
import { getRefkey } from "../../framework/core/refkeyer.js";
import { Reference } from "../../typescript/reference.js";
import { Function } from "../../typescript/function.js";

interface ClientOperationProps {
  operation: Operation;
}

/**
 * Emits a function that now just calls out to the internal one.
 * 
 * Todo: currently hardcodes list, but presumably this should be dynamically imported.
 * Need to support so that line is no longer necessary.
 */
export function ClientOperation({ operation }: ClientOperationProps) {
  const functionDef = (
    <Function type={operation}>
      return <Reference refkey={getRefkey(operation, "internal")} />
    </Function>
  );

  return code`
    from typings import List

    ${functionDef}
  `;
}