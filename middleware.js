import { handleAccessControl } from "./access-control.js";

export function middleware(context) {
  return handleAccessControl(context);
}

export const config = {
  matcher: "/:path*",
};
