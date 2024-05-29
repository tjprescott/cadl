interface FunctionComponent {
  (...args: any[]): SourceNode;
}
export function jsx(component: FunctionComponent, props?: Record<string, any>): SourceNode {
  return createSourceElement(component, props);
}

// fix these types obv
export function Fragment(props: Record<string, any>): any[] {
  return props.children;
}

export function jsxs(component: FunctionComponent, props?: Record<string, any>): SourceNode {
  return createSourceElement(component, props);
}

export interface SourceNode {
  type: FunctionComponent;
  props: Record<string, any>;
}

function createSourceElement(type: FunctionComponent, props?: Record<string, any>): SourceNode {
  return {
    type,
    props: props ?? {},
  };
}
