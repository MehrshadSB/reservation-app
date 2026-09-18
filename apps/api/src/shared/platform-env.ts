export type PlatformUrls = {
  apiUrl: string;
  dashboardUrl: string;
  bookingUrl: string;
  adminUrl: string;
};

export type AuthRuntimeConfig = {
  nodeEnv: string;
  apiPort: number;
  urls: PlatformUrls;
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

function readUrl(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.length > 0 ? value.replace(/\/$/, "") : fallback;
}

function loadPlatformUrls(): PlatformUrls {
  return {
    apiUrl: readUrl("API_URL", "http://localhost:4000"),
    dashboardUrl: readUrl("DASHBOARD_URL", "http://localhost:3000"),
    bookingUrl: readUrl("BOOKING_URL", "http://localhost:3001"),
    adminUrl: readUrl("ADMIN_URL", "http://localhost:3002"),
  };
}

function splitOrigins(value: string | undefined, fallback: string[]): string[] {
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  return value
    .split(",")
    .map((item) => item.trim().replace(/\/$/, ""))
    .filter((item) => item.length > 0);
}

/**
 * Local copy of `@repo/config` runtime loading. The compiled Nest process
 * cannot import that package's TypeScript source (`.js` specifiers).
 */
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
      session: process.env.AUTH_COOKIE_NAME ?? "ra_session",
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
