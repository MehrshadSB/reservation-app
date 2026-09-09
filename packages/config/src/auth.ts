import { AUTH_COOKIE_NAMES } from "@repo/contracts/auth";
import { loadPlatformUrls, readUrl, type AppClientId } from "./urls.js";

export type AuthRuntimeConfig = {
  nodeEnv: string;
  authPort: number;
  apiPort: number;
  urls: ReturnType<typeof loadPlatformUrls>;
  cookie: {
    session: string;
    refresh: string;
    login: string;
    domain: string | undefined;
    secure: boolean;
    sameSite: "lax";
    path: string;
  };
  secrets: {
    otpPepper: string;
    cookieSigning: string;
    internal: string;
  };
  allowedRedirectOrigins: string[];
  bootstrapSuperAdminPhone: string | undefined;
  clients: AppClientId[];
};

function splitOrigins(value: string | undefined, fallback: string[]): string[] {
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  return value
    .split(",")
    .map((item) => item.trim().replace(/\/$/, ""))
    .filter((item) => item.length > 0);
}

export function loadAuthRuntimeConfig(): AuthRuntimeConfig {
  const urls = loadPlatformUrls();
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const secure = nodeEnv === "production";
  const domain = process.env.AUTH_COOKIE_DOMAIN;
  const cookieDomain =
    domain && domain.length > 0 ? domain : undefined;

  return {
    nodeEnv,
    authPort: Number(process.env.AUTH_PORT ?? 4001),
    apiPort: Number(process.env.API_PORT ?? 4000),
    urls,
    cookie: {
      session: process.env.AUTH_COOKIE_NAME ?? AUTH_COOKIE_NAMES.session,
      refresh: process.env.AUTH_REFRESH_COOKIE_NAME ?? AUTH_COOKIE_NAMES.refresh,
      login: AUTH_COOKIE_NAMES.login,
      domain: cookieDomain,
      secure,
      sameSite: "lax",
      path: "/",
    },
    secrets: {
      otpPepper: readUrl("AUTH_OTP_PEPPER", "dev-otp-pepper-change-me"),
      cookieSigning: readUrl(
        "AUTH_COOKIE_SIGNING_SECRET",
        "dev-cookie-signing-change-me",
      ),
      internal: readUrl("AUTH_INTERNAL_SECRET", "dev-internal-secret-change-me"),
    },
    allowedRedirectOrigins: splitOrigins(
      process.env.AUTH_ALLOWED_REDIRECT_ORIGINS,
      [urls.dashboardUrl, urls.adminUrl, urls.bookingUrl],
    ),
    bootstrapSuperAdminPhone: process.env.AUTH_BOOTSTRAP_SUPER_ADMIN_PHONE,
    clients: ["dashboard", "admin", "booking"],
  };
}

export function isAllowedRedirect(
  returnTo: string,
  allowedOrigins: string[],
): boolean {
  try {
    const url = new URL(returnTo);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    const origin = url.origin;
    return allowedOrigins.some((allowed) => origin === allowed);
  } catch {
    return false;
  }
}

export function buildLoginUrl(input: {
  authUrl: string;
  clientId: AppClientId;
  returnTo: string;
}): string {
  const url = new URL("/login", input.authUrl);
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("return_to", input.returnTo);
  return url.toString();
}
