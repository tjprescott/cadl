import { Operation } from "@typespec/compiler";
import { code } from "../../framework/core/code.js";
import { getRefkey } from "../../framework/core/refkeyer.js";
import { Function } from "../../python/function.js";
import { Reference } from "../../python/reference.js";

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
  return (
    <Function type={operation}>
      return <Reference refkey={getRefkey(operation, "internal")} />
    </Function>
  );
}
