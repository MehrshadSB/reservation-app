import { cookies } from "next/headers";
import { getAuthUrl, getLogoutUrl, SESSION_COOKIE } from "../lib/sso";

type SessionPayload = {
  identity: {
    identityId: string;
    phoneNumber: string;
  };
  authorization: {
    platformRoles: string[];
    memberships: Array<{ organizationId: string; role: string }>;
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
  const logoutUrl = getLogoutUrl("http://localhost:3000/");

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Business management application for tenant staff.</p>
      {session ? (
        <section>
          <p>Signed in as {session.identity.phoneNumber}</p>
          <p>Identity {session.identity.identityId}</p>
          <a href={logoutUrl}>Sign out</a>
        </section>
      ) : (
        <p>No active session.</p>
      )}
    </main>
  );
}
