import { cookies } from "next/headers";
import { Button } from "@repo/ui";
import type { CurrentUserResponse } from "@repo/contracts/identity";
import { SignOutButton } from "../components/sign-out-button";
import { getApiUrl, getLoginPath, SESSION_COOKIE } from "../lib/auth";

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
      <h1>Booking</h1>
      <p>Public-facing booking application for customers.</p>
      {current ? (
        <p>
          Signed in as {current.user.phone}. <SignOutButton />
        </p>
      ) : (
        <p>
          <a href={getLoginPath("/")}>Sign in with phone</a>
        </p>
      )}
      <Button appName="booking">Click me</Button>
    </main>
  );
}
