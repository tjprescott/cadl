import { ComponentChildren, SourceNode } from "#jsx/jsx-runtime";
import { EmitContext, Model, ModelProperty, Operation, Union } from "@typespec/compiler";
import { EmitOutput, SourceFile } from "./framework/components/index.js";
import { Block } from "./typescript/block.js";
import { Function } from "./typescript/function.js";
import { $verbatim, ObjectValue } from "./typescript/value.js";
import { render, renderToSourceFiles } from "./framework/core/render.js";

export async function $onEmit(context: EmitContext) {
  const op: Operation = [...context.program.getGlobalNamespaceType().operations.values()][0];
  const sfs = await renderToSourceFiles(
    <EmitOutput>
      <SourceFile path="test1.ts" filetype="typescript">
        {`import { parseArgs, type ParseArgsConfig } from "node:util";`}
        <CommandArgParser command={op} />
      </SourceFile>
    </EmitOutput>,
    {format: true}
  );
  
  for (const sf of sfs) {
    console.log("## " + sf.path);
    console.log(sf.content);
  }
}

export interface CommandArgParserProps {
  command: Operation;
}



export function CommandArgParser({ command }: CommandArgParserProps) {
  // argument passed to nodeParseArgs
  const parseArgsArg: Record<string, any> = {
    args: $verbatim("args"),
    tokens: true,
    strict: true,
    options: {},
  };

  // assemble the options in parseArgsArg
  for (const option of collectCommandOptions(command)) {
    const argOptions: Record<string, any> = {};
    parseArgsArg.options[option.name] = argOptions;

    if (isBoolean(option.type)) {
      argOptions.type = "boolean";
    } else {
      argOptions.type = "string";
    }

    if (hasShortName(option)) {
      argOptions.short = getShortName(option);
    }
  }

  return (
    <Function name={`parse${command.name}Args`} parameters={{args: "string[]"}}>
      const <Block> tokens </Block> = nodeParseArgs(
        <ObjectValue jsValue={parseArgsArg} />
      );
    </Function>
  );
}

function isBoolean(type: Type) {
  return 
}


function collectCommandOptions(command: Operation): ModelProperty[] {
  const commandOpts: ModelProperty[] = [];

  const types: (Model | Union)[] = [command.parameters];

  while (types.length > 0) {
    const type = types.pop()!;

    if (type.kind === "Model") {
      for (const param of type.properties.values()) {
        if (param.type.kind === "Model") {
          types.push(param.type);
        } else if (
          param.type.kind === "Union" &&
          [...param.type.variants.values()].find((v) => v.type.kind === "Model")
        ) {
        } else {
          commandOpts.push(param);
        }
      }
    } else if (type.kind === "Union") {
      for (const variant of type.variants.values()) {
        if (variant.type.kind === "Union" || variant.type.kind === "Model") {
          types.push(variant.type);
        }
      }
    }
  }

  return commandOpts;
}