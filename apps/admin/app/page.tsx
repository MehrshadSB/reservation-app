import { cookies } from "next/headers";
import { getAuthUrl, getLogoutUrl, SESSION_COOKIE } from "../lib/sso";

type SessionPayload = {
  identity: {
    identityId: string;
    phoneNumber: string;
  };
  authorization: {
    platformRoles: string[];
  };
};

async function loadSession(): Promise<SessionPayload | undefined> {
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
  return (await response.json()) as SessionPayload;
}

export default async function Home() {
  const session = await loadSession();
  const logoutUrl = getLogoutUrl("http://localhost:3002/");

  return (
    <main>
      <h1>Admin</h1>
      <p>Platform super-admin application.</p>
      {session ? (
        <section>
          <p>Signed in as {session.identity.phoneNumber}</p>
          <p>
            Platform roles: {session.authorization.platformRoles.join(", ") || "none"}
          </p>
          <a href={logoutUrl}>Sign out</a>
        </section>
      ) : (
        <p>No active session.</p>
      )}
    </main>
  );
}
