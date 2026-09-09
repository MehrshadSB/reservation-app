import { Injectable } from "@nestjs/common";
import type { SessionIntrospection } from "@repo/contracts/auth";
import { loadAuthRuntimeConfig } from "../../../shared/platform-env";
import { AUTH_CONSTANTS } from "../auth-cache";

type CacheEntry = { value: SessionIntrospection; expiresAt: number };

@Injectable()
export class AuthIntrospectionClient {
  private readonly config = loadAuthRuntimeConfig();
  private readonly cache = new Map<string, CacheEntry>();

  async introspect(accessToken: string): Promise<SessionIntrospection> {
    const cached = this.cache.get(accessToken);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return cached.value;
    }

    const response = await fetch(
      `${this.config.urls.authUrl}/v1/internal/sessions/introspect`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-auth-internal-secret": this.config.secrets.internal,
        },
        body: JSON.stringify({ accessToken }),
      },
    );

    if (response.status === 401 || response.status === 403) {
      throw new Error("unauthenticated");
    }
    if (!response.ok) {
      throw new Error("auth_unavailable");
    }

    const value = (await response.json()) as SessionIntrospection;
    this.cache.set(accessToken, {
      value,
      expiresAt: now + AUTH_CONSTANTS.introspectionCacheMs,
    });
    return value;
  }
}
