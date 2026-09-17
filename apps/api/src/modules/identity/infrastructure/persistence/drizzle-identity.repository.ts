import { eq, type Database, users } from "@repo/database";
import type { Identity } from "../../domain/entities/identity";
import type { IdentityRepository } from "../../application/ports/identity.repository";

function toIdentity(row: typeof users.$inferSelect): Identity {
  return {
    id: row.id,
    phoneNumber: row.phone,
    status: row.status,
    isPlatformAdmin: row.isPlatformAdmin,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class DrizzleIdentityRepository implements IdentityRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Identity | undefined> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row ? toIdentity(row) : undefined;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Identity | undefined> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.phone, phoneNumber))
      .limit(1);
    return row ? toIdentity(row) : undefined;
  }

  async save(identity: Identity): Promise<void> {
    await this.db
      .insert(users)
      .values({
        id: identity.id,
        phone: identity.phoneNumber,
        status: identity.status,
        isPlatformAdmin: identity.isPlatformAdmin,
        createdAt: identity.createdAt,
        updatedAt: identity.updatedAt,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          phone: identity.phoneNumber,
          status: identity.status,
          isPlatformAdmin: identity.isPlatformAdmin,
          updatedAt: identity.updatedAt,
        },
      });
  }
}
