import { SourceNode } from "#jsx/jsx-runtime";
import { Model, ModelProperty, Operation, Union } from "@typespec/compiler";
import { EmitOutput, SourceFile } from "./framework/index.js";
import { Block } from "./typescript/block.js";

export function $onEmit() {
  const op: Operation = {} as any;
  return (
    <EmitOutput>
      <SourceFile path="test1.txt">
        import <lb /> parseArgs, type ParseArgsConfig <rb /> from "node:util";
        <CommandArgParser command={op} />
      </SourceFile>
      <SourceFile path="test2.txt"></SourceFile>
    </EmitOutput>
  );
}

export interface CommandArgParserProps {
  command: Operation;
}
export function CommandArgParser({ command }: CommandArgParserProps) {
  const options = collectCommandOptions(command).map((option) => (
    <>
      {option.name}: <CommandOptions option={option} />
    </>
  ));

  return (
    <>
      function parse{command.name}Args(args: string[]){" "}
      <Block>
        const <Block> tokens </Block> = nodeParseArgs(
        <Block>
          args, options: <Block>{options}</Block>, tokens: true, strict: true
        </Block>
        )
      </Block>
    </>
  );
}

// helpers
declare const isBoolean: any;
declare const hasShortName: any;
declare const getShortName: any;

function CommandOptions({ option }: { option: ModelProperty }) {
  const opts = [];

  if (isBoolean(option.type)) {
    opts.push(<>type: "boolean"</>);
  } else {
    opts.push(<>type: "string"</>);
  }

  if (hasShortName(option)) {
    opts.push(<>short: "{getShortName(option)}</>);
  }
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

/*
 import { parseArgs, type ParseArgsConfig } from "node:util";
function parse<%= string.capitalize(command.name) %>Args(args: string[]) {
  const { tokens } = nodeParseArgs({
    args,
    options: {
      <% for(const opt of options) { %>
        "<%- opt.name %>": {
          <% if (boolean.is(opt.type)) { %>
            type: "boolean",
          <% } else { %>
            type: "string",
          <% } %>
          <% if (option.hasShortName(opt)) { %>
            short: "<%- option.getShortName(opt) %>",
          <% } %>
        },
      <% } %>
    },
    tokens: true,
    strict: false,
  });

  const args: [
    <% for(const [paramName, paramType] of command.parameters.properties) { %>
      <%- paramName %>: <%- include("interface.ejs", { type: paramType }) %>
    <% } %>
  ] = [] as any;

  return tokens;
}
*/

const res = $onEmit();
renderTree(res);

// if this guy sees a promise somewhere in props, it can wait for resolution
// then replace that index of the array with that text.
function renderTree(root: SourceNode) {
  let currentNode = root;

  while (currentNode) {
    if (Array.isArray(currentNode)) {
      // handle this stuff
      break;
    }
    currentNode = currentNode.type(currentNode.props);
  }

  console.log(currentNode);
}
