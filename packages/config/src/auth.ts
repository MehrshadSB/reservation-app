import { AUTH_COOKIE_NAMES } from "@repo/contracts/auth";
import { loadPlatformUrls, readUrl } from "./urls.js";

export type AuthRuntimeConfig = {
  nodeEnv: string;
  apiPort: number;
  urls: ReturnType<typeof loadPlatformUrls>;
  cookie: {
    session: string;
    domain: string | undefined;
    secure: boolean;
    sameSite: "lax";
    path: string;
  };
  secrets: {
    otpPepper: string;
  };
  allowedRedirectOrigins: string[];
  bootstrapPlatformAdminPhone: string | undefined;
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
  const cookieDomain = domain && domain.length > 0 ? domain : undefined;

  return {
    nodeEnv,
    apiPort: Number(process.env.API_PORT ?? 4000),
    urls,
    cookie: {
      session: process.env.AUTH_COOKIE_NAME ?? AUTH_COOKIE_NAMES.session,
      domain: cookieDomain,
      secure,
      sameSite: "lax",
      path: "/",
    },
    secrets: {
      otpPepper: readUrl("AUTH_OTP_PEPPER", "dev-otp-pepper-change-me"),
    },
    allowedRedirectOrigins: splitOrigins(
      process.env.AUTH_ALLOWED_REDIRECT_ORIGINS,
      [urls.dashboardUrl, urls.adminUrl, urls.bookingUrl],
    ),
    bootstrapPlatformAdminPhone: process.env.AUTH_BOOTSTRAP_PLATFORM_ADMIN_PHONE,
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
    return allowedOrigins.some((allowed) => url.origin === allowed);
  } catch {
    return false;
  }
}
