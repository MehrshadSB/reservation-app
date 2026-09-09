import { cookies } from "next/headers";
import { Button } from "@repo/ui";
import { getAuthUrl, getLoginUrl, getLogoutUrl, SESSION_COOKIE } from "../lib/sso";

async function loadPhone(): Promise<string | undefined> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) {
    return undefined;
  }
  const response = await fetch(`${getAuthUrl()}/v1/sessions/current`, {
    headers: { cookie: `${SESSION_COOKIE}=${token}` },
    cache: "no-store",
  });
  if (!response.ok) {
    return undefined;
  }
  const body = (await response.json()) as { identity: { phoneNumber: string } };
  return body.identity.phoneNumber;
}

export default async function Home() {
  const phone = await loadPhone();
  const loginUrl = getLoginUrl("http://localhost:3001/");
  const logoutUrl = getLogoutUrl("http://localhost:3001/");

  return (
    <main>
      <h1>Booking</h1>
      <p>Public-facing booking application for customers.</p>
      {phone ? (
        <p>
          Signed in as {phone}. <a href={logoutUrl}>Sign out</a>
        </p>
      ) : (
        <p>
          <a href={loginUrl}>Sign in with phone</a>
        </p>
      )}
      <Button appName="booking">Click me</Button>
    </main>
  );
}
