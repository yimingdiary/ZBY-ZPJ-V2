import { handleAccessControl } from "../access-control.js";

export function onRequest(context) {
  return handleAccessControl(context);
}
