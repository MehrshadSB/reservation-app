import {
  boolean,
  date,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", ["active", "disabled"]);

export const kycStatusEnum = pgEnum("kyc_status", [
  "unverified",
  "pending",
  "verified",
  "rejected",
]);

/**
 * Authenticated account. Not a Customer and not tenant-scoped.
 * Phone OTP login keys off `phone`.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  phone: varchar("phone", { length: 16 }).notNull().unique(),
  status: userStatusEnum("status").notNull().default("active"),
  isPlatformAdmin: boolean("is_platform_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

/**
 * KYC profile of the person behind a user account.
 * Optional and 1:1. Completing KYC does not create a Customer.
 */
export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    givenName: varchar("given_name", { length: 100 }),
    familyName: varchar("family_name", { length: 100 }),
    nationalId: varchar("national_id", { length: 32 }),
    dateOfBirth: date("date_of_birth", { mode: "string" }),
    nationality: varchar("nationality", { length: 2 }),
    country: varchar("country", { length: 2 }),
    city: varchar("city", { length: 100 }),
    addressLine: varchar("address_line", { length: 255 }),
    kycStatus: kycStatusEnum("kyc_status").notNull().default("unverified"),
    kycSubmittedAt: timestamp("kyc_submitted_at", { withTimezone: true }),
    kycVerifiedAt: timestamp("kyc_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("user_profiles_national_id_uidx").on(table.nationalId),
  ],
);
