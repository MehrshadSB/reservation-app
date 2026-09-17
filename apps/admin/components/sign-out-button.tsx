"use client";

import { getApiUrl } from "../lib/auth";

export function SignOutButton() {
  async function signOut() {
    await fetch(`${getApiUrl()}/v1/identity/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.assign("/login");
  }

  return (
    <button type="button" onClick={() => void signOut()}>
      Sign out
    </button>
  );
}
