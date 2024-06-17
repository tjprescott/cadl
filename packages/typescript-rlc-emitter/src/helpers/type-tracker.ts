import { Type } from "@typespec/compiler";

export interface TypeTracker {
  track: (type: Type) => void;
  untrack: (type: Type) => void;
  isTracked: (type: Type) => boolean;
  getTracked: () => Type[];
}

export function createTypeTracker() {
  const trackedTypes: Set<Type> = new Set();

  const track = (type: Type) => {
    trackedTypes.add(type);
  };

  const untrack = (type: Type) => {
    trackedTypes.delete(type);
  };

  const isTracked = (type: Type) => {
    return trackedTypes.has(type);
  };

  const getTracked = () => {
    return Array.from(trackedTypes);
  };

  return {
    track,
    untrack,
    isTracked,
    getTracked,
  };
}
