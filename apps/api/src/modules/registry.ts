import { AnalyticsModule } from "./analytics/analytics.module";
import { AvailabilityModule } from "./availability/availability.module";
import { BookingModule } from "./booking/booking.module";
import { CustomerModule } from "./customer/customer.module";
import { ExtensionsModule } from "./extensions/extensions.module";
import { IdentityModule } from "./identity/identity.module";
import { NotificationModule } from "./notification/notification.module";
import { OrganizationModule } from "./organization/organization.module";
import { PaymentModule } from "./payment/payment.module";
import { ResourceModule } from "./resource/resource.module";
import { ServiceModule } from "./service/service.module";

/**
 * NestJS module registry for the modular monolith.
 *
 * Industry extensions register through `extensionModules` so Booking Core
 * stays generic.
 */
export const coreModules = [
  IdentityModule,
  OrganizationModule,
  CustomerModule,
  BookingModule,
  ResourceModule,
  ServiceModule,
  AvailabilityModule,
  PaymentModule,
  NotificationModule,
  AnalyticsModule,
];

export const extensionModules = [ExtensionsModule];
