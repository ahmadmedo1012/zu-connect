import { setAuthTokenGetter } from "@workspace/api-client-react";

export function setupAuthTokenGetter() {
  setAuthTokenGetter(() => localStorage.getItem("token"));
}
