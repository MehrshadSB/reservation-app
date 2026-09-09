export type AppClientId = "dashboard" | "admin" | "booking";

export type PlatformUrls = {
  apiUrl: string;
  authUrl: string;
  dashboardUrl: string;
  bookingUrl: string;
  adminUrl: string;
};

export type AuthRuntimeConfig = {
  nodeEnv: string;
  authPort: number;
  apiPort: number;
  urls: PlatformUrls;
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

function readUrl(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.length > 0 ? value.replace(/\/$/, "") : fallback;
}

function loadPlatformUrls(): PlatformUrls {
  return {
    apiUrl: readUrl("API_URL", "http://localhost:4000"),
    authUrl: readUrl("AUTH_URL", "http://localhost:4001"),
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

export function loadAuthRuntimeConfig(): AuthRuntimeConfig {
  const urls = loadPlatformUrls();
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const secure = nodeEnv === "production";
  const domain = process.env.AUTH_COOKIE_DOMAIN;
  const cookieDomain = domain && domain.length > 0 ? domain : undefined;

  return {
    nodeEnv,
    authPort: Number(process.env.AUTH_PORT ?? 4001),
    apiPort: Number(process.env.API_PORT ?? 4000),
    urls,
    cookie: {
      session: process.env.AUTH_COOKIE_NAME ?? "ra_session",
      refresh: process.env.AUTH_REFRESH_COOKIE_NAME ?? "ra_refresh",
      login: "ra_login",
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
