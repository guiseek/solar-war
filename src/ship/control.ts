import { createEvent, createListener, dispatch } from "@websqnl/event-flow";

export const keyDown = createEvent("key.down");
export const onKeyDown = createListener("key.down");

export const keyUp = createEvent("key.up");
export const onKeyUp = createListener("key.up");

export const control = {
  KeyW: false,
  KeyD: false,
  KeyS: false,
  KeyA: false,
  ArrowUp: false,
  ArrowRight: false,
  ArrowDown: false,
  ArrowLeft: false,
  ShiftLeft: false,
  Space: false,
};

onKeyDown((key) => {
  control[key] = true;
});

onKeyUp((key) => {
  control[key] = false;
});

onkeydown = ({ code }) => dispatch(keyDown(code as Key));
onkeyup = ({ code }) => dispatch(keyUp(code as Key));
