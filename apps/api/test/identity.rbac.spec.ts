import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PERMISSIONS } from "@repo/contracts/authorization";
import { isResourceInTenant } from "../src/shared/kernel/tenant-context";
import { createIdentityServices, loginWithPhone } from "./identity-test-utils";

class TestBookingStore {
  private readonly items = new Map<
    string,
    { id: string; organizationId: string }
  >();

  seed(booking: { id: string; organizationId: string }): void {
    this.items.set(booking.id, booking);
  }

  find(organizationId: string, id: string) {
    const booking = this.items.get(id);
    if (!booking || booking.organizationId !== organizationId) {
      return undefined;
    }
    return booking;
  }
}

describe("identity RBAC and tenant isolation", () => {
  it("allows OWNER to confirm a booking in their organization", async () => {
    const services = createIdentityServices();
    const { user } = await loginWithPhone(services, "09121111111");
    await services.authorization.grantMembership({
      userId: user.userId,
      organizationId: "org-a",
      role: "OWNER",
    });
    assert.equal(
      await services.authorization.can(user, PERMISSIONS.BOOKING_CONFIRM, {
        organizationId: "org-a",
      }),
      true,
    );
  });

  it("allows ADMIN to confirm a booking", async () => {
    const services = createIdentityServices();
    const { user } = await loginWithPhone(services, "09121111112");
    await services.authorization.grantMembership({
      userId: user.userId,
      organizationId: "org-a",
      role: "ADMIN",
    });
    assert.equal(
      await services.authorization.can(user, PERMISSIONS.BOOKING_CONFIRM, {
        organizationId: "org-a",
      }),
      true,
    );
  });

  it("denies MEMBER booking.confirm", async () => {
    const services = createIdentityServices();
    const { user } = await loginWithPhone(services, "09121111113");
    await services.authorization.grantMembership({
      userId: user.userId,
      organizationId: "org-b",
      role: "MEMBER",
    });
    assert.equal(
      await services.authorization.can(user, PERMISSIONS.BOOKING_CONFIRM, {
        organizationId: "org-b",
      }),
      false,
    );
  });

  it("allows MEMBER to read a booking in their organization", async () => {
    const services = createIdentityServices();
    const { user } = await loginWithPhone(services, "09121111114");
    await services.authorization.grantMembership({
      userId: user.userId,
      organizationId: "org-b",
      role: "MEMBER",
    });
    assert.equal(
      await services.authorization.can(user, PERMISSIONS.BOOKING_READ, {
        organizationId: "org-b",
      }),
      true,
    );
  });

  it("denies access when the user has no membership in the requested organization", async () => {
    const services = createIdentityServices();
    const { user } = await loginWithPhone(services, "09121111115");
    await services.authorization.grantMembership({
      userId: user.userId,
      organizationId: "org-a",
      role: "OWNER",
    });
    assert.equal(
      await services.authorization.can(user, PERMISSIONS.BOOKING_READ, {
        organizationId: "org-b",
      }),
      false,
    );
  });

  it("rejects ID tampering when the resource belongs to another organization", async () => {
    const services = createIdentityServices();
    const store = new TestBookingStore();
    store.seed({ id: "booking-a", organizationId: "org-a" });
    store.seed({ id: "booking-b", organizationId: "org-b" });

    const { user } = await loginWithPhone(services, "09121111116");
    await services.authorization.grantMembership({
      userId: user.userId,
      organizationId: "org-a",
      role: "OWNER",
    });
    await services.authorization.grantMembership({
      userId: user.userId,
      organizationId: "org-b",
      role: "MEMBER",
    });

    const tenantA = { organizationId: "org-a" };
    const tenantB = { organizationId: "org-b" };

    assert.equal(
      await services.authorization.can(
        user,
        PERMISSIONS.BOOKING_CONFIRM,
        tenantA,
      ),
      true,
    );
    assert.equal(
      await services.authorization.can(
        user,
        PERMISSIONS.BOOKING_CONFIRM,
        tenantB,
      ),
      false,
    );

    const leaked = store.find(tenantA.organizationId, "booking-b");
    assert.equal(leaked, undefined);
    assert.equal(
      isResourceInTenant("org-b", tenantA),
      false,
    );
    assert.ok(store.find(tenantA.organizationId, "booking-a"));
  });
});
