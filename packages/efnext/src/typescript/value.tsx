export interface ValueProps {
  jsValue?: unknown;
  tspValue?: unknown;
}

export function Value({ jsValue, tspValue }: ValueProps) {
  if (jsValue) {
    if (isVerbatim(jsValue)) {
      return jsValue.value;
    }
    switch (typeof jsValue) {
      case "object":
        if (jsValue === null) {
          return "null";
        } else {
          return <ObjectValue jsValue={jsValue} />;
        }
      case "boolean":
      case "number":
        return String(jsValue);
      case "string":
        return `"${jsValue}"`;
    }
  }

  return `"Unknown Value"`;
}

export interface ObjectValueProps {
  jsValue?: object;
}

export function ObjectValue({ jsValue }: ObjectValueProps) {
  if (jsValue) {
    const entries = Object.entries(jsValue);

    // Had to do this to be able to render the empty object
    if (entries.length === 0) {
      return <>{"{ }"}</>;
    }

    const val = Object.entries(jsValue)
      .map(([key, jsPropValue]) => {
        return <ObjectValue.Property name={key} jsPropertyValue={jsPropValue} />;
      })
      .reduce((prev, curr) => {
        // This prevents a trailing comma
        if (!prev || prev.length === 0) {
          return [curr];
        }
        return [prev, ", ", curr];
      }, []);

    return ["{", val, "}"];
  }
  return <></>;
}

export interface ObjectValuePropertyProps {
  name?: string;
  jsPropertyValue?: unknown;
}

ObjectValue.Property = function Property({ name, jsPropertyValue }: ObjectValuePropertyProps) {
  return (
    <>
      {name}: <Value jsValue={jsPropertyValue} />
    </>
  );
};

export function NullValue() {
  return "null";
}


const verbatimSym = Symbol();
export function isVerbatim(v: unknown): v is Verbatim {
  return typeof v === "object" && v !== null && (v as any)[verbatimSym];
}

export interface Verbatim {
  [verbatimSym]: true,
  value: string
}

export function $verbatim(s: string): Verbatim {
  return { [verbatimSym]: true, value: s }
}