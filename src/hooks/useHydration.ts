import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function useHydration() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // client snapshot: hydrated
    () => false   // server snapshot: not hydrated
  );
}
