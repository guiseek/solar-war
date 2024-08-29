/// <reference types="vite/client" />

type Key =
  | "KeyW"
  | "KeyD"
  | "KeyS"
  | "KeyA"
  | "ArrowUp"
  | "ArrowRight"
  | "ArrowDown"
  | "ArrowLeft"
  | "ShiftLeft"
  | "Space";

type Control = Record<Key, boolean>;

interface StateEventMap {
  "key.down": Key;
  "key.up": Key;
}
