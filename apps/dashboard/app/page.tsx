import { cookies } from "next/headers";
import type { CurrentUserResponse } from "@repo/contracts/identity";
import { SignOutButton } from "../components/sign-out-button";
import { getApiUrl, SESSION_COOKIE } from "../lib/auth";

async function loadCurrentUser(): Promise<CurrentUserResponse | undefined> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) {
    return undefined;
  }
  const response = await fetch(`${getApiUrl()}/v1/me`, {
    headers: { cookie: `${SESSION_COOKIE}=${token}` },
    cache: "no-store",
  });
  if (!response.ok) {
    return undefined;
  }
  return (await response.json()) as CurrentUserResponse;
}

export default async function Home() {
  const current = await loadCurrentUser();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Business management application for tenant staff.</p>
      {current ? (
        <section>
          <p>Signed in as {current.user.phone}</p>
          <p>User {current.user.userId}</p>
          <SignOutButton />
        </section>
      ) : (
        <p>No active session.</p>
      )}
    </main>
  );
}
