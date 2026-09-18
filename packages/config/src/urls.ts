export type AppClientId = "dashboard" | "admin" | "booking";

export type PlatformUrls = {
  apiUrl: string;
  dashboardUrl: string;
  bookingUrl: string;
  adminUrl: string;
};

export function readUrl(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.length > 0 ? value.replace(/\/$/, "") : fallback;
}

export function loadPlatformUrls(): PlatformUrls {
  return {
    apiUrl: readUrl("API_URL", "http://localhost:4000"),
    dashboardUrl: readUrl("DASHBOARD_URL", "http://localhost:3000"),
    bookingUrl: readUrl("BOOKING_URL", "http://localhost:3001"),
    adminUrl: readUrl("ADMIN_URL", "http://localhost:3002"),
  };
}

export function clientIdToUrl(
  clientId: AppClientId,
  urls: PlatformUrls,
): string {
  switch (clientId) {
    case "dashboard":
      return urls.dashboardUrl;
    case "admin":
      return urls.adminUrl;
    case "booking":
      return urls.bookingUrl;
  }
}
